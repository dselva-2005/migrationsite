// types/company.ts

/* =====================================================
   PUBLIC COMPANY
===================================================== */

export interface Company {
    id: number
    name: string
    slug: string
    tagline: string | ""
    description: string | ""
    website: string | ""


    logo: string | null
    cover_image: string | null

    address_line_1?: string
    address_line_2?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
    phone?: string
    email?: string

    rating_average: number
    rating_count: number

    is_verified: boolean
    category: string | null
    created_at?: string

    // ⭐ optional future-proof
    rating_breakdown?: {
        rating: number
        count: number
    }[]
}

/* =====================================================
   COMPANY ACCOUNT / DASHBOARD
===================================================== */

export interface CompanyAccount {
    id: number
    name: string
    slug: string

    rating_average: number
    rating_count: number

    is_verified: boolean
    logo: string | null
}
