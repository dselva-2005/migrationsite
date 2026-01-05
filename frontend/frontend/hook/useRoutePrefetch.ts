"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

type Route = "/dashboard" | "/profile" | "/blog" | "/listing"

export function useRoutePrefetch(routes: Route[]) {
    const router = useRouter()

    useEffect(() => {
        routes.forEach((route) => {
            router.prefetch(route)
        })
    }, [router, routes])
}
