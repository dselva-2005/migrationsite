// services/company.ts
import publicApi from "@/lib/publicApi"
import { Company } from "@/types/company"

export interface CompanyListResponse {
    count: number
    next: string | null
    previous: string | null
    results: Company[]
}

const companyListCache = new Map<string, CompanyListResponse>()
const companyDetailCache = new Map<string, Company>()

function getCacheKey(page: number, pageSize: number) {
    return `${page}:${pageSize}`
}

function normalizeCompany(company: Company): Company {
    return {
        ...company,
        rating_average:
            typeof company.rating_average === "number"
                ? company.rating_average
                : Number(company.rating_average),
    }
}

function normalizeCompanyList(
    data: CompanyListResponse
): CompanyListResponse {
    return {
        ...data,
        results: data.results.map(normalizeCompany),
    }
}

export async function getCompanies(page = 1, pageSize = 8) {
    const key = getCacheKey(page, pageSize)

    if (companyListCache.has(key)) {
        return companyListCache.get(key)!
    }

    const res = await publicApi.get<CompanyListResponse>(
        `/api/company/?page=${page}&page_size=${pageSize}`
    )

    const normalized = normalizeCompanyList(res.data)

    companyListCache.set(key, normalized)

    return normalized
}


export async function getCompanyBySlug(slug: string) {

    if (companyDetailCache.has(slug)) {
        return companyDetailCache.get(slug)!
    }

    const res = await publicApi.get<Company>(`/api/company/${slug}/`)

    const normalized = normalizeCompany(res.data)

    companyDetailCache.set(slug, normalized)

    return normalized
}
