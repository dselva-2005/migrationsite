"use client"

import { useRoutePrefetch } from "@/hook/useRoutePrefetch"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    useRoutePrefetch([
        "/dashboard",
        "/profile",
    ])

    return <>{children}</>
}
