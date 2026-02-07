"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { getPageContent } from "@/services/content"

type PageContent = Record<string, unknown>

type PageContentContextType = {
    content: PageContent | null
    loading: boolean
}

const PageContentContext = createContext<PageContentContextType | null>(null)

export const contentCache = new Map<string, PageContent>()

/* ---------------------------------- */
/* Prefetch (safe, no React state) */
/* ---------------------------------- */
export async function prefetchPageContent(
    page: string,
    country?: string
) {
    const cacheKey = country ? `${page}:${country}` : page
    if (contentCache.has(cacheKey)) return

    try {
        // ✅ Pass country to API directly
        const data = await getPageContent(page, country)
        contentCache.set(cacheKey, data)
    } catch {
        // silent fail
    }
}

/* ---------------------------------- */
/* Provider */
/* ---------------------------------- */
export function PageContentProvider({
    page,
    country,
    children,
}: {
    page: string
    country?: string
    children: React.ReactNode
}) {
    const cacheKey = country ? `${page}:${country}` : page
    const cachedContent = contentCache.get(cacheKey) ?? null

    const [content, setContent] = useState<PageContent | null>(cachedContent)
    const [loading, setLoading] = useState<boolean>(!cachedContent)

    useEffect(() => {
        if (cachedContent) return

        let cancelled = false

        getPageContent(page, country)
            .then((data) => {
                if (cancelled) return
                contentCache.set(cacheKey, data)
                setContent(data)
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [page, country, cacheKey, cachedContent])

    return (
        <PageContentContext.Provider value={{ content, loading }}>
            {children}
        </PageContentContext.Provider>
    )
}

/* ---------------------------------- */
/* Hook for consuming content */
/* ---------------------------------- */
export function usePageContent() {
    const ctx = useContext(PageContentContext)
    if (!ctx) {
        throw new Error("usePageContent must be used inside PageContentProvider")
    }
    return ctx
}
