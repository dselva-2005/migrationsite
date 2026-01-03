export type ReviewReplyInline = {
    id: number
    body: string
    created_at: string
}

export type Review = {
    id: number
    title: string
    body: string
    rating: number
    author: string
    author_profile_image_url: string | null
    created_at: string
    reply?: ReviewReplyInline | null
}

/* Dashboard-only types (NO conflicts) */

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
    is_verified: boolean
    is_approved: boolean
    created_at: string
    reply?: DashboardReviewReply | null
}
