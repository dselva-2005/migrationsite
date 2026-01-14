/* =====================================================
   REVIEW MODERATION STATUS
===================================================== */

export type ReviewModerationStatus =
    | "pending"
    | "approved"
    | "rejected"


/* =====================================================
   REVIEW MEDIA
===================================================== */

export type ReviewMedia = {
    id: number
    media_type: "image" | "video"
    url: string
}


/* =====================================================
   PUBLIC REVIEW TYPES
   (Only APPROVED reviews are ever exposed)
===================================================== */

export type ReviewReplyInline = {
    id: number
    body: string
    created_at: string
}

export type Review = {
    id: number
    rating: number
    title: string
    body: string
    author: string
    author_profile_image_url: string | null
    created_at: string
    moderation_status: string

    media: ReviewMedia[]

    reply?: ReviewReplyInline | null
}


/* =====================================================
   DASHBOARD REVIEW TYPES (ADMIN / OWNER)
===================================================== */

export type DashboardReviewReply = {
    id: number
    body: string
    created_at: string
}

export type DashboardReview = {
    id: number
    rating: number
    title: string
    body: string
    author_name: string
    author_email?: string
    is_verified: boolean

    moderation_status: ReviewModerationStatus

    created_at: string
    media: ReviewMedia[]

    reply?: DashboardReviewReply | null
}


/* =====================================================
   COMPANY REVIEW (OWNER VIEW)
===================================================== */

export type CompanyReview = {
    id: number
    author_name: string
    body: string
    rating: number

    moderation_status: ReviewModerationStatus

    created_at: string

    reply?: {
        id: number
        body: string
        created_at: string
    } | null

    media?: ReviewMedia[]
}

/* =====================================================
   GENERIC PAGINATION WRAPPER
===================================================== */

export type PaginatedResponse<T> = {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

/* =====================================================
   PAGINATED COMPANY REVIEWS
===================================================== */

export type PaginatedCompanyReviews =
    PaginatedResponse<CompanyReview>
