"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { searchAll, SearchResponse } from "@/types/search"
import { Input } from "@/components/ui/input"
import { Loader2, Search } from "lucide-react"

export function GlobalSearch() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SearchResponse | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!query || query.length < 2) {
            setResults(null)
            return
        }

        const timeout = setTimeout(async () => {
            try {
                setLoading(true)
                const data = await searchAll(query)
                setResults(data)
            } finally {
                setLoading(false)
            }
        }, 500)

        return () => clearTimeout(timeout)
    }, [query])

    return (
        <div className="relative mx-auto w-full max-w-lg">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <Input
                    placeholder="Search companies, blogs..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-white text-black border-gray-300 pl-9 focus:border-black"
                />

                {loading && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-500" />
                )}
            </div>

            {/* Results */}
            {results && (
                <div className="absolute z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                    {/* Companies */}
                    {results.companies.length > 0 && (
                        <Section title="Companies">
                            {results.companies.map(c => (
                                <ResultItem
                                    key={c.id}
                                    href={`/review/${c.slug}`}
                                    label={c.name}
                                />
                            ))}
                        </Section>
                    )}

                    {/* Blogs */}
                    {results.blogs.length > 0 && (
                        <Section title="Blogs">
                            {results.blogs.map(b => (
                                <ResultItem
                                    key={b.id}
                                    href={`/blog/${b.slug}`}
                                    label={b.title}
                                />
                            ))}
                        </Section>
                    )}

                    {results.blogs.length === 0 &&
                        results.companies.length === 0 && (
                            <div className="px-3 py-3 text-sm text-gray-500">
                                No results found
                            </div>
                        )}
                </div>
            )}
        </div>
    )
}

/* ---------- Helpers ---------- */

function Section({
    title,
    children,
}: {
    title: string
    children: React.ReactNode
}) {
    return (
        <div className="border-b border-gray-100 last:border-none">
            <div className="px-3 py-2 text-xs font-semibold uppercase text-gray-500">
                {title}
            </div>
            {children}
        </div>
    )
}

function ResultItem({
    href,
    label,
}: {
    href: string
    label: string
}) {
    return (
        <Link
            href={href}
            className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100"
        >
            {label}
        </Link>
    )
}
