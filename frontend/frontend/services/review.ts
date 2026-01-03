import { Review } from "@/types/review"
import api from "@/lib/axios"
import publicApi from "@/lib/publicApi"

/* ---------------- Types ---------------- */

export type CreateReviewPayload = {
    rating: number
    title?: string
    body: string
}

/* 🔹 ADD: paginated response type */
export type PaginatedReviewResponse = {
    count: number
    results: Review[]
}

/* 🔹 ADD: reply response type */
export type ReviewReplyResponse = {
    id: number
    body: string
    created_at: string
}

/* ---------------- Cache ---------------- */

// Cache: { "company:<slug>": { [page]: data } }
/* 🔹 ADD: narrow `unknown` usage via type assertion at read time */
const reviewCache: Record<string, Record<number, unknown>> = {}

/* ---------------- Create Review ---------------- */
/**
 * Create a review for a company (authenticated)
 */
export async function createCompanyReview(
    companySlug: string,
    payload: CreateReviewPayload
) {
    /* 🔹 ADD: generic response typing */
    const res = await api.post<Review>(
        `/api/company/${companySlug}/reviews/`,
        payload
    )

    // Invalidate cache for this company
    const cacheKey = `company:${companySlug}`
    if (reviewCache[cacheKey]) {
        delete reviewCache[cacheKey]
    }

    return res.data
}

/* ---------------- Fetch Reviews ---------------- */
/**
 * Get company reviews (public, paginated, cached)
 */
export async function getCompanyReviews(
    companySlug: string,
    page: number = 1
) {
    const cacheKey = `company:${companySlug}`

    if (!reviewCache[cacheKey]) {
        reviewCache[cacheKey] = {}
    }

    /* 🔹 ADD: safe cast when reading cache */
    const cached = reviewCache[cacheKey][page] as
        | PaginatedReviewResponse
        | undefined

    if (cached) {
        return cached
    }

    /* 🔹 ADD: generic response typing */
    const res = await publicApi.get<PaginatedReviewResponse>(
        `/api/company/${companySlug}/reviews/`,
        { params: { page } }
    )

    reviewCache[cacheKey][page] = res.data
    return res.data
}


/**
 * GET top blog reviews (public)
 */
export async function getBlogReviews(
    slug: string,
    page = 1,
    pageSize = 4
) {
    const res = await publicApi.get<{
        count: number
        results: Review[]
    }>(`/api/blog/${slug}/reviews/`, {
        params: {
            page,
            page_size: pageSize,
        },
    })

    return res.data
}

/**
 * POST blog review (authenticated)
 */
export async function createBlogReview(
    slug: string,
    payload: {
        rating: number
        title?: string
        body: string
    }
) {
    /* 🔹 ADD: generic response typing */
    const res = await api.post<Review>(
        `/api/blog/${slug}/reviews/`,
        payload
    )

    return res.data
}

export async function replyToReview(
    reviewId: number,
    body: string
) {
    /* 🔹 ADD: generic response typing */
    const res = await api.post<ReviewReplyResponse>(
        `/api/reviews/${reviewId}/reply/`,
        { body }
    )
    return res.data
}
