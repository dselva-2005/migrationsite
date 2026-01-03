// services/companyAccount.ts
import api from "@/lib/axios"
import { CompanyAccount } from "@/types/company"

const companyAccountCache = new Map<string, CompanyAccount>()

function normalizeCompanyAccount(data: CompanyAccount): CompanyAccount {
    return {
        ...data,
        rating_average:
            typeof data.rating_average === "number"
                ? Number(data.rating_average.toFixed(1))
                : Number(data.rating_average),
        rating_count: Number(data.rating_count),
        reviews: data.reviews.map(r => ({
            ...r,
            rating: Number(r.rating),
        })),
    }
}

/**
 * Fetch company account by slug
 * Uses in-memory cache to avoid duplicate calls
 */
export async function getCompanyAccountBySlug(slug: string) {
    if (companyAccountCache.has(slug)) {
        return companyAccountCache.get(slug)!
    }

    const res = await api.get<CompanyAccount>(`/api/company/${slug}/account/`)
    const normalized = normalizeCompanyAccount(res.data)
    companyAccountCache.set(slug, normalized)
    return normalized
}

/**
 * Update local cache after bulk action
 */
export function updateCompanyAccountCache(
    slug: string,
    updatedReviews: { id: number; is_approved: boolean; rating: number }[]
) {
    const account = companyAccountCache.get(slug)
    if (!account) return

    const newReviews = account.reviews.map(r => {
        const updated = updatedReviews.find(u => u.id === r.id)
        return updated ? { ...r, is_approved: updated.is_approved } : r
    })

    const approvedReviews = newReviews.filter(r => r.is_approved)
    const ratingCount = approvedReviews.length
    const ratingSum = approvedReviews.reduce((sum, r) => sum + r.rating, 0)
    const ratingAverage = ratingCount ? ratingSum / ratingCount : 0

    const updatedAccount: CompanyAccount = {
        ...account,
        reviews: newReviews,
        rating_count: ratingCount,
        rating_average: ratingAverage,
    }

    companyAccountCache.set(slug, updatedAccount)
    return updatedAccount
}

/**
 * Clear cache for a company account
 */
export function clearCompanyAccountCache(slug: string) {
    companyAccountCache.delete(slug)
}
