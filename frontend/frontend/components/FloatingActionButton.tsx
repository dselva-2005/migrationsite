"use client"

import Link from "next/link"
import { Info } from "lucide-react"
import {
    PageContentProvider,
    usePageContent,
} from "@/providers/PageContentProvider"

type FloatingButton = {
    href: string
    position?: "left" | "right"
}

function FloatingButtonInner() {
    const { content, loading } = usePageContent()

    if (loading || !content) return null

    const button =
        content["global.floating_button"] as FloatingButton | undefined

    if (!button?.href) return null

    const side =
        button.position === "right" ? "right-6" : "left-6"

    return (
        <Link
            href={button.href}
            aria-label="About"
            className={`
        fixed ${side} bottom-6 z-50
        h-11 w-11 rounded-full
        flex items-center justify-center
        bg-background
        shadow-lg
        hover:shadow-xl
        hover:bg-muted
        transition
        translate-y-[2px]
      `}
        >
            <Info className="h-5 w-5" />
        </Link>
    )
}

export function FloatingActionButton() {
    return (
        <PageContentProvider page="global">
            <FloatingButtonInner />
        </PageContentProvider>
    )
}
