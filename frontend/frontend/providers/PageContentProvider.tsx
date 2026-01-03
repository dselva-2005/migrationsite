"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { getPageContent } from "@/services/content"

type PageContent = Record<string, unknown>

const PageContentContext = createContext<PageContent | null>(null)

// module-level cache (persists across navigations)
export const contentCache: Record<string, PageContent> = {}

/* ---------------------------------- */
/* Prefetch (safe, no React state) */
/* ---------------------------------- */
export async function prefetchPageContent(page: string) {
    if (contentCache[page]) return

    try {
        const data = await getPageContent(page)
        contentCache[page] = data
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
    const [content, setContent] = useState<PageContent | null>(
        () => contentCache[page] ?? null
    )

    useEffect(() => {
        // 🚫 do nothing if already cached
        if (contentCache[page]) return

        let cancelled = false

        getPageContent(page).then((data) => {
            if (cancelled) return
            contentCache[page] = data
            setContent(data) // ✅ async update only
        })

        return () => {
            cancelled = true
        }
    }, [page])

    if (!content) return null

    return (
        <PageContentContext.Provider value={content}>
            {children}
        </PageContentContext.Provider>
    )
}

/* ---------------------------------- */
/* Hook */
/* ---------------------------------- */
export function usePageContent() {
    const ctx = useContext(PageContentContext)
    if (!ctx) {
        throw new Error("usePageContent must be used inside PageContentProvider")
    }
    return ctx
}
