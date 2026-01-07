// services/companyAccount.ts

import api from "@/lib/axios"
import { CompanyAccount } from "@/types/company"

/* =====================================================
   CACHE
===================================================== */

const companyAccountCache = new Map<string, CompanyAccount>()

/* =====================================================
   NORMALIZER
===================================================== */

function normalizeCompanyAccount(
    data: CompanyAccount
): CompanyAccount {
    return {
        ...data,
        rating_average: Number(
            Number(data.rating_average).toFixed(1)
        ),
        rating_count: Number(data.rating_count),
    }
}

/* =====================================================
   FETCH
===================================================== */

export async function getCompanyAccountBySlug(
    slug: string
): Promise<CompanyAccount> {
    const cached = companyAccountCache.get(slug)
    if (cached) return cached

    const res = await api.get<CompanyAccount>(
        `/api/company/${slug}/account/`
    )

    const normalized = normalizeCompanyAccount(res.data)
    companyAccountCache.set(slug, normalized)

    return normalized
}

/* =====================================================
   CACHE CONTROL
===================================================== */

export function clearCompanyAccountCache(slug: string) {
    companyAccountCache.delete(slug)
}
