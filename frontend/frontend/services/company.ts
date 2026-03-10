// services/company.ts
import publicApi from "@/lib/publicApi"
import { getServerApi } from "@/lib/serverApi"
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

// ✅ SERVER-SIDE FETCHING FUNCTIONS (ADD THESE AT THE BOTTOM)
export async function getCompanyBySlugServer(slug: string): Promise<Company> {
    const serverApi = getServerApi() // Initialize inside function
    const response = await serverApi.get(`/api/company/${slug}/`)
    return normalizeCompany(response.data)
}

export async function getCompaniesServer(page = 1, pageSize = 8): Promise<CompanyListResponse> {
    const serverApi = getServerApi() // Initialize inside function
    const response = await serverApi.get(`/api/company/?page=${page}&page_size=${pageSize}`)
    return normalizeCompanyList(response.data)
}