// =====================
// Review related types
// =====================

export interface Company {
    id: string
    name: string
    domain: string
    slug: string
    rating: number
    totalReviews: number
    ratingDistribution: RatingDistribution
}

export type RatingDistribution = {
    1: number
    2: number
    3: number
    4: number
    5: number
}

export interface Review {
    id: string
    rating: number
    title: string
    body: string
    author: string
    createdAt: string // ISO string
}

export interface CompanyReviewResponse {
    company: Company
    reviews: Review[]
    pagination: Pagination
}

export interface Pagination {
    page: number
    pageSize: number
    total: number
}
