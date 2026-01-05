import publicApi from "@/lib/publicApi"
import { BlogPost } from "@/types/blog"

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export type BlogCategory = {
    id: number
    name: string
    slug: string
    post_count: number
}

export type BlogListResponse = {
    count: number
    next: string | null
    previous: string | null
    results: BlogPost[]
}

/* ------------------------------------------------------------------ */
/* Simple in-memory cache */
/* ------------------------------------------------------------------ */

type CacheEntry<T> = {
    data: T
    expiresAt: number
}

const CACHE_TTL = 1000 * 60 * 5 // 5 minutes

const cache = new Map<string, CacheEntry<unknown>>()

function getCache<T>(key: string): T | null {
    const entry = cache.get(key)
    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
        cache.delete(key)
        return null
    }

    return entry.data as T
}

function setCache<T>(key: string, data: T) {
    cache.set(key, {
        data,
        expiresAt: Date.now() + CACHE_TTL,
    })
}

/* ------------------------------------------------------------------ */
/* Services */
/* ------------------------------------------------------------------ */

export async function getBlogPosts(
    page: number = 1
): Promise<BlogListResponse> {
    const cacheKey = `blog:list:page:${page}`

    const cached = getCache<BlogListResponse>(cacheKey)
    if (cached) return cached

    const res = await publicApi.get<BlogListResponse>("/api/blog/", {
        params: { page },
    })

    setCache(cacheKey, res.data)
    return res.data
}

export async function getBlogPost(
    slug: string
): Promise<BlogPost> {
    const cacheKey = `blog:detail:${slug}`

    const cached = getCache<BlogPost>(cacheKey)
    if (cached) return cached

    const res = await publicApi.get<BlogPost>(
        `/api/blog/${slug}/`
    )

    setCache(cacheKey, res.data)
    return res.data
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
    const cacheKey = `blog:categories`

    const cached = getCache<BlogCategory[]>(cacheKey)
    if (cached) return cached

    const res = await publicApi.get<BlogCategory[]>(
        "/api/blog/categories/"
    )

    setCache(cacheKey, res.data)
    return res.data
}
