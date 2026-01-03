"use client"

import { useEffect } from "react"
import { prefetchPageContent } from "@/providers/PageContentProvider"

const PAGES_TO_PREFETCH = ["home", "review"]

export function GlobalPrefetch() {
    useEffect(() => {
        if ("requestIdleCallback" in window) {
            requestIdleCallback(() => {
                PAGES_TO_PREFETCH.forEach(prefetchPageContent)
            })
        } else {
            // fallback
            setTimeout(() => {
                PAGES_TO_PREFETCH.forEach(prefetchPageContent)
            }, 0)
        }
    }, [])

    return null
}
