"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

export default function Breadcrumbs() {
    const pathname = usePathname()

    const segments = pathname
        .split("/")
        .filter(Boolean)

    if (segments.length === 0) return null

    return (
        <nav
            aria-label="Breadcrumb"
            className="border-b bg-white"
        >
            <div className="mx-auto max-w-7xl px-4">
                <ol className="flex h-11 items-center gap-1 text-sm text-muted-foreground">
                    {/* Home */}
                    <li>
                        <Link
                            href="/"
                            className="transition-colors hover:text-foreground"
                        >
                            Home
                        </Link>
                    </li>

                    {segments.map((segment, index) => {
                        const href =
                            "/" + segments.slice(0, index + 1).join("/")

                        const isLast = index === segments.length - 1

                        const label = segment
                            .replace(/-/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())

                        return (
                            <li
                                key={href}
                                className="flex items-center gap-1"
                            >
                                <ChevronRight className="h-4 w-4 text-muted-foreground/70" />

                                {isLast ? (
                                    <span className="font-medium text-foreground">
                                        {label}
                                    </span>
                                ) : (
                                    <Link
                                        href={href}
                                        className="transition-colors hover:text-foreground"
                                    >
                                        {label}
                                    </Link>
                                )}
                            </li>
                        )
                    })}
                </ol>
            </div>
        </nav>
    )
}
