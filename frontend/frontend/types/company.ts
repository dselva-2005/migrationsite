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
    rating_average: number
    rating_count: number
    is_verified: boolean
    category: string | null
}

export type CompanyAccount = {
    id: number
    name: string
    slug: string
    rating_average: number
    rating_count: number
    is_verified: boolean
    reviews: CompanyReview[]
}
