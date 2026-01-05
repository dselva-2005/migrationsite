"use client"

import { useRoutePrefetch } from "@/hook/useRoutePrefetch"

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    useRoutePrefetch([
        "/blog",
        "/listing",
    ])

    return <>{children}</>
}
