"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { buildBreadcrumbs } from "@/types/buildBreadcrumbs"

export default function Breadcrumbs() {
    const pathname = usePathname()
    const crumbs = buildBreadcrumbs(pathname)

    if (crumbs.length === 0) return null

    return (
        <nav aria-label="Breadcrumb" className="border-b bg-white">
            <div className="mx-auto max-w-7xl px-4">
                <ol className="flex h-11 items-center gap-1 text-sm text-muted-foreground">
                    {crumbs.map((crumb, index) => (
                        <li
                            key={crumb.href}
                            className="flex items-center gap-1"
                        >
                            {index > 0 && (
                                <ChevronRight className="h-4 w-4 text-muted-foreground/70" />
                            )}

                            {crumb.clickable ? (
                                <Link
                                    href={crumb.href}
                                    className="transition-colors hover:text-foreground"
                                >
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="font-medium text-foreground">
                                    {crumb.label}
                                </span>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </nav>
    )
}
