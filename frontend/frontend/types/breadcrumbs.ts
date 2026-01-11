// lib/breadcrumbs.ts

export type BreadcrumbConfig = {
    label?: string
    clickable?: boolean
}

/**
 * Keys represent REAL ROUTES only
 * Dynamic segments must be written as [slug]
 */
export const BREADCRUMB_ROUTES: Record<string, BreadcrumbConfig> = {
    "/": { label: "Home", clickable: true },

    "/blog": { label: "Blog", clickable: true },
    "/countries/[slug]": { label: "countries", clickable: false },
    "/visa/[slug]": { label: "visa", clickable: false },
    "/visa-overview": { label: "visa-overview", clickable: false },
    "/blog/[slug]": { clickable: false },

    "/review": { label: "Reviews", clickable: true },
    "/review/[slug]": { clickable: false },

    "/listing": { label: "Listings", clickable: false },

    "/listing/[slug]": {
        clickable: false, // clicking slug usually doesn't make sense
    },

    "/listing/[slug]/account": {
        label: "Account",
        clickable: false,
    },

    "/profile": { label: "Profile", clickable: true },
}
