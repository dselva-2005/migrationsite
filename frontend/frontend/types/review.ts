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

    /** NEW */
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
    is_approved: boolean
    created_at: string

    /** NEW */
    media: ReviewMedia[]

    reply?: DashboardReviewReply | null
}


export type CompanyReview = {
    id: number
    author_name: string
    body: string
    is_approved: boolean
    created_at: string
    rating: number
    reply?: {
        id: number
        body: string
        created_at: string
    } | null
    media?: ReviewMedia[]
}