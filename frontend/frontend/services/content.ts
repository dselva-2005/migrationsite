import publicApi from "@/lib/publicApi"

type CacheEntry<T> = {
    value: T
    expiresAt: number
}

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const pageContentCache = new Map<string, CacheEntry<unknown>>()

/**
 * Fetch page content from API, optionally for a specific country.
 * Caches results per page + country combination.
 */
export async function getPageContent(page: string, country?: string) {
    // ✅ Use page:country as cache key
    const cacheKey = country ? `${page}:${country}` : page
    const cached = pageContentCache.get(cacheKey)

    if (cached && cached.expiresAt > Date.now()) {
        return cached.value
    }

    // ✅ Include country query param if present
    const url = country
        ? `/api/content/${page}/?country=${encodeURIComponent(country)}`
        : `/api/content/${page}/`

    const res = await publicApi.get(url)

    pageContentCache.set(cacheKey, {
        value: res.data,
        expiresAt: Date.now() + CACHE_TTL,
    })

    return res.data
}
