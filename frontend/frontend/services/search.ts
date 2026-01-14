import publicApi from "@/lib/publicApi"

/* ───────────────────────── TYPES ───────────────────────── */

export type Blog = {
    slug: string
    title: string
    excerpt: string
    image: string | null
    category: string
    author: string
    date: string
    views: number
    rating: number
    reviewCount: number
}

export type Company = {
    id: number
    slug: string
    name: string
    tagline?: string
    rating_average: number
    rating_count: number
    city?: string
    country?: string
    logo?: string | null
}

export type Meta = {
    page: number
    limit: number
    total_blogs: number
    total_companies: number
}

export type FullSearchResponse = {
    query: string
    blogs: Blog[]
    companies: Company[]
    meta: Meta
}

/* ───────────────────────── CACHE ───────────────────────── */

/**
 * Cache key format:
 * full-search::<query>::<page>
 */
type CacheEntry = {
    data: FullSearchResponse
    timestamp: number
}

const searchCache = new Map<string, CacheEntry>()

// Cache TTL (milliseconds)
// Set to `Infinity` if you want permanent cache per session
const CACHE_TTL = 1000 * 60 * 5 // 5 minutes

function getCacheKey(query: string, page: number) {
    return `full-search::${query.toLowerCase()}::${page}`
}

function getFromCache(key: string): FullSearchResponse | null {
    const entry = searchCache.get(key)
    if (!entry) return null

    const isExpired = Date.now() - entry.timestamp > CACHE_TTL
    if (isExpired) {
        searchCache.delete(key)
        return null
    }

    return entry.data
}

function setCache(key: string, data: FullSearchResponse) {
    searchCache.set(key, {
        data,
        timestamp: Date.now(),
    })
}

/* ───────────────────────── API ───────────────────────── */

export async function fullSearch(params: {
    query: string
    page: number
}) {
    const { query, page } = params
    const cacheKey = getCacheKey(query, page)

    // 1️⃣ Try cache first
    const cached = getFromCache(cacheKey)
    if (cached) {
        return cached
    }

    // 2️⃣ Fetch from API
    const res = await publicApi.get<FullSearchResponse>(
        "/api/content/full-search/",
        {
            params: {
                q: query,
                page,
            },
        }
    )

    // 3️⃣ Save to cache
    setCache(cacheKey, res.data)

    return res.data
}

/* ───────────────────────── OPTIONAL HELPERS ───────────────────────── */

/**
 * Clears entire search cache
 * Useful on logout or hard refresh scenarios
 */
export function clearSearchCache() {
    searchCache.clear()
}

/**
 * Clears cache for a specific query
 */
export function invalidateSearchQuery(query: string) {
    const prefix = `full-search::${query.toLowerCase()}::`
    for (const key of searchCache.keys()) {
        if (key.startsWith(prefix)) {
            searchCache.delete(key)
        }
    }
}
