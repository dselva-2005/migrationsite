// lib/buildBreadcrumbs.ts

import { BREADCRUMB_ROUTES } from "./breadcrumbs"

export type BreadcrumbItem = {
    href: string
    label: string
    clickable: boolean
}

const STATIC_SEGMENTS = new Set([
    "blog",
    "review",
    "listing",
    "account",
    "profile",
    "visa-overview",
    "visa",
    "countries",
    "about",
])

export function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
    const segments = pathname.split("/").filter(Boolean)

    const crumbs: BreadcrumbItem[] = []

    /* ---------------------------------- */
    /* Home (always first)                */
    /* ---------------------------------- */
    const home = BREADCRUMB_ROUTES["/"]
    crumbs.push({
        href: "/",
        label: home?.label ?? "Home",
        clickable: home?.clickable !== false,
    })

    /* ---------------------------------- */
    /* Dynamic crumbs                     */
    /* ---------------------------------- */
    const accumulated: string[] = []

    for (let i = 0; i < segments.length; i++) {
        accumulated.push(segments[i])

        const href = "/" + accumulated.join("/")

        const routeKey =
            "/" +
            accumulated
                .map((seg) =>
                    STATIC_SEGMENTS.has(seg) ? seg : "[slug]"
                )
                .join("/")

        const config = BREADCRUMB_ROUTES[routeKey]

        if (!config) continue

        const label =
            config.label ??
            segments[i]
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())

        crumbs.push({
            href,
            label,
            clickable: config.clickable !== false,
        })
    }

    return crumbs
}
