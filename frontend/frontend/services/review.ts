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

// Cache: { "company:<slug>": { [page]: data } }
const reviewCache: Record<string, Record<number, unknown>> = {}

/* ---------------- Helpers ---------------- */

/**
 * Build FormData for REVIEW CREATION ONLY (NO MEDIA)
 */
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

/**
 * Create company review (text only)
 * Returns { id }
 */
export async function createCompanyReview(
    slug: string,
    data: FormData
) {
    const res = await api.post(
        `/api/company/${slug}/reviews/`,
        data
    )
    return res.data
}

/**
 * Create blog review (text only)
 * Returns { id }
 */
export async function createBlogReview(
    slug: string,
    data: FormData
) {
    const res = await api.post(
        `/api/blog/${slug}/reviews/`,
        data
    )
    return res.data
}

/* ---------------- Upload review media ---------------- */

/**
 * Upload ONE media file for a review
 */
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

/**
 * Get company reviews (public, paginated, cached)
 */
export async function getCompanyReviews(
    companySlug: string,
    page = 1
) {
    const cacheKey = `company:${companySlug}`

    reviewCache[cacheKey] ||= {}

    const cached = reviewCache[cacheKey][page] as
        | PaginatedReviewResponse
        | undefined

    if (cached) return cached

    const res = await publicApi.get<PaginatedReviewResponse>(
        `/api/company/${companySlug}/reviews/`,
        { params: { page } }
    )

    reviewCache[cacheKey][page] = res.data
    return res.data
}

/**
 * Get blog reviews (public)
 */
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

/**
 * Reply to a review (company owner / manager)
 */
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
