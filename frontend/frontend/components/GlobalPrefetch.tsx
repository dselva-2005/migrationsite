"use client"

import { useEffect } from "react"
import { prefetchPageContent } from "@/providers/PageContentProvider"

const PAGES_TO_PREFETCH = ["home", "review" ,"blog" ,"about" ,"contact" ,]

export function GlobalPrefetch() {
    useEffect(() => {
        const runPrefetch = () => {
            PAGES_TO_PREFETCH.forEach((page) => {
                prefetchPageContent(page) // ✅ only pass page, not index
            })
        }

        if ("requestIdleCallback" in window) {
            requestIdleCallback(runPrefetch)
        } else {
            // fallback
            setTimeout(runPrefetch, 0)
        }
    }, [])

    return null
}
