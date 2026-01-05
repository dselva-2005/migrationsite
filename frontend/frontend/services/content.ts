import publicApi from "@/lib/publicApi"
type CacheEntry<T> = {
    value: T
    expiresAt: number
}

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const pageContentCache = new Map<string, CacheEntry<unknown>>()

export async function getPageContent(page: string) {
    const cached = pageContentCache.get(page)

    if (cached && cached.expiresAt > Date.now()) {
        return cached.value
    }

    const res = await publicApi.get(`/api/content/${page}/`)

    pageContentCache.set(page, {
        value: res.data,
        expiresAt: Date.now() + CACHE_TTL,
    })

    return res.data
}
