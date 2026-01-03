import publicApi from "@/lib/publicApi"

// Simple in-memory cache
const pageContentCache: Record<string, unknown> = {}

/**
 * Get page content with caching
 */
export async function getPageContent(page: string) {
    // Return cached data if exists
    if (pageContentCache[page]) {
        return pageContentCache[page]
    }

    // Fetch from API
    const res = await publicApi.get(`/api/content/${page}/`)

    // Store in cache
    pageContentCache[page] = res.data

    return res.data
}
