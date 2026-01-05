import { Review } from "@/types/review"
import api from "@/lib/axios"
import publicApi from "@/lib/publicApi"

/* ---------------- Types ---------------- */

export type CreateReviewPayload = {
    rating: number
    title?: string
    body: string
}

export type PaginatedReviewResponse = {
    count: number
    results: Review[]
}

export type ReviewReplyResponse = {
    id: number
    body: string
    created_at: string
}

/* ---------------- Cache ---------------- */

// company:<slug> -> page -> response
const reviewCache = new Map<
    string,
    Map<number, PaginatedReviewResponse>
>()

/* ---------------- Helpers ---------------- */

export function buildReviewFormData(data: CreateReviewPayload) {
    const formData = new FormData()
    formData.append("rating", data.rating.toString())
    formData.append("body", data.body)

    if (data.title) {
        formData.append("title", data.title)
    }

    return formData
}

/* ---------------- Create review ---------------- */

export async function createCompanyReview(
    slug: string,
    data: FormData
) {
    const res = await api.post(
        `/api/company/${slug}/reviews/`,
        data
    )

    // 🔥 Optional: invalidate company review cache
    reviewCache.delete(`company:${slug}`)

    return res.data
}

export async function createBlogReview(
    slug: string,
    data: FormData
) {
    return api.post(`/api/blog/${slug}/reviews/`, data)
}

/* ---------------- Upload review media ---------------- */

export async function uploadReviewMedia(
    reviewId: number,
    file: File
) {
    const formData = new FormData()
    formData.append("file", file)

    return api.post(
        `/api/review/${reviewId}/media/`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    )
}

/* ---------------- Fetch Reviews ---------------- */

export async function getCompanyReviews(
    companySlug: string,
    page = 1
) {
    const cacheKey = `company:${companySlug}`

    if (!reviewCache.has(cacheKey)) {
        reviewCache.set(cacheKey, new Map())
    }

    const companyCache = reviewCache.get(cacheKey)!
    const cached = companyCache.get(page)

    if (cached) return cached

    const res = await publicApi.get<PaginatedReviewResponse>(
        `/api/company/${companySlug}/reviews/`,
        { params: { page } }
    )

    companyCache.set(page, res.data)
    return res.data
}

export async function getBlogReviews(
    slug: string,
    page = 1,
    pageSize = 4
) {
    const res = await publicApi.get<PaginatedReviewResponse>(
        `/api/blog/${slug}/reviews/`,
        {
            params: {
                page,
                page_size: pageSize,
            },
        }
    )

    return res.data
}

/* ---------------- Replies ---------------- */

export async function replyToReview(
    reviewId: number,
    body: string
) {
    const res = await api.post<ReviewReplyResponse>(
        `/api/review/${reviewId}/reply/`,
        { body }
    )

    return res.data
}
