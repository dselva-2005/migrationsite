import publicApi from "@/lib/publicApi"
import type { SearchResponse } from "@/types/search"

/* ───────────────────────── CACHE ───────────────────────── */

/**
 * Cache key format:
 * global-search::<query>
 */
type CacheEntry = {
    data: SearchResponse
    timestamp: number
}

const globalSearchCache = new Map<string, CacheEntry>()

// Cache TTL (milliseconds)
// Set to Infinity for session-long cache
const CACHE_TTL = 1000 * 60 * 3 // 3 minutes

function getCacheKey(query: string) {
    return `global-search::${query.toLowerCase()}`
}

function getFromCache(key: string): SearchResponse | null {
    const entry = globalSearchCache.get(key)
    if (!entry) return null

    const isExpired = Date.now() - entry.timestamp > CACHE_TTL
    if (isExpired) {
        globalSearchCache.delete(key)
        return null
    }

    return entry.data
}

function setCache(key: string, data: SearchResponse) {
    globalSearchCache.set(key, {
        data,
        timestamp: Date.now(),
    })
}

/* ───────────────────────── API ───────────────────────── */

/**
 * Global search (used by header search dropdown)
 * Lightweight, cached
 */
export async function globalSearch(query: string) {
    const cacheKey = getCacheKey(query)

    // 1️⃣ Try cache first
    const cached = getFromCache(cacheKey)
    if (cached) {
        return cached
    }

    // 2️⃣ Fetch from API
    const res = await publicApi.get<SearchResponse>(
        "/api/content/search/",
        {
            params: {
                q: query,
            },
        }
    )

    // 3️⃣ Save to cache
    setCache(cacheKey, res.data)

    return res.data
}

/* ───────────────────────── OPTIONAL HELPERS ───────────────────────── */

/**
 * Clears entire global search cache
 */
export function clearGlobalSearchCache() {
    globalSearchCache.clear()
}

/**
 * Clears cache for a specific query
 */
export function invalidateGlobalSearch(query: string) {
    globalSearchCache.delete(getCacheKey(query))
}
