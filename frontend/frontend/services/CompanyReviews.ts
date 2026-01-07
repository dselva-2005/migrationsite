// services/companyReviews.ts

import api from "@/lib/axios"
import {
    PaginatedCompanyReviews,
} from "@/types/review"

export async function getCompanyReviews(
    slug: string,
    params?: {
        page?: number
        page_size?: number
        status?: "pending" | "approved" | "rejected"
    }
): Promise<PaginatedCompanyReviews> {
    const res = await api.get<PaginatedCompanyReviews>(
        `/api/company/${slug}/reviews/`,
        {
            params: {
                page: params?.page ?? 1,
                page_size: params?.page_size ?? 10,
                status: params?.status,
            },
        }
    )

    return {
        ...res.data,
        results: res.data.results.map(r => ({
            ...r,
            rating: Number(r.rating),
        })),
    }
}
