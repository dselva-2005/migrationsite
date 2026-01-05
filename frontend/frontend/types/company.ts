// types/company.ts
import { CompanyReview } from "./review"

export interface Company {
    id: number
    name: string
    slug: string
    tagline: string
    description: string
    website: string

    logo: string | null
    cover_image: string | null

    // Address / Contact (NEW — optional-safe)
    address_line_1?: string
    address_line_2?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
    phone?: string
    email?: string

    // Ratings
    rating_average: number
    rating_count: number

    // Meta
    is_verified: boolean
    category: string | null
    created_at?: string
}

export type CompanyAccount = {
    id: number
    name: string
    slug: string
    rating_average: number
    rating_count: number
    is_verified: boolean
    logo?: string
    reviews: CompanyReview[]
}
