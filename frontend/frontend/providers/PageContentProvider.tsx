"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { getPageContent } from "@/services/content"

type PageContent = Record<string, unknown>

type PageContentContextType = {
    content: PageContent | null
    loading: boolean
}

const PageContentContext =
    createContext<PageContentContextType | null>(null)

export const contentCache = new Map<string, PageContent>()

/* ---------------------------------- */
/* Prefetch (safe, no React state) */
/* ---------------------------------- */
export async function prefetchPageContent(page: string) {
    if (contentCache.has(page)) return

    try {
        const data = await getPageContent(page)
        contentCache.set(page, data)
    } catch {
        // silent fail
    }
}

/* ---------------------------------- */
/* Provider */
/* ---------------------------------- */
export function PageContentProvider({
    page,
    children,
}: {
    page: string
    children: React.ReactNode
}) {
    const cachedContent = contentCache.get(page) ?? null

    const [content, setContent] = useState<PageContent | null>(cachedContent)
    const [loading, setLoading] = useState<boolean>(!cachedContent)

    useEffect(() => {
        if (cachedContent) return

        let cancelled = false

        getPageContent(page)
            .then((data) => {
                if (cancelled) return
                contentCache.set(page, data)
                setContent(data)
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [page, cachedContent])

    return (
        <PageContentContext.Provider value={{ content, loading }}>
            {children}
        </PageContentContext.Provider>
    )
}

export function usePageContent() {
    const ctx = useContext(PageContentContext)
    if (!ctx) {
        throw new Error("usePageContent must be used inside PageContentProvider")
    }
    return ctx
}
