"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { SearchResponse } from "@/types/search"
import { globalSearch } from "@/services/globalsearch"
import { Input } from "@/components/ui/input"
import { Loader2, Search } from "lucide-react"

const MIN_QUERY_LENGTH = 1
const DEBOUNCE_MS = 350

export function GlobalSearch() {
    const containerRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SearchResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    /* ------------------------------
       Outside click → close
    ------------------------------ */
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () =>
            document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    /* ------------------------------
       Escape key → close
    ------------------------------ */
    useEffect(() => {
        function handleEscape(e: KeyboardEvent) {
            if (e.key === "Escape") {
                setIsOpen(false)
            }
        }

        document.addEventListener("keydown", handleEscape)
        return () =>
            document.removeEventListener("keydown", handleEscape)
    }, [])

    /* ------------------------------
       Debounced search
    ------------------------------ */
    useEffect(() => {
        const trimmed = query.trim()

        if (trimmed.length < MIN_QUERY_LENGTH) {
            setResults(null)
            setIsOpen(false)
            return
        }

        const timeout = setTimeout(async () => {
            try {
                setLoading(true)
                const data = await globalSearch(trimmed)
                setResults(data)
                setIsOpen(true)
            } finally {
                setLoading(false)
            }
        }, DEBOUNCE_MS)

        return () => clearTimeout(timeout)
    }, [query])

    /* ------------------------------
       Enter → full search page
    ------------------------------ */
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            const trimmed = query.trim()
            if (trimmed.length < MIN_QUERY_LENGTH) return

            setIsOpen(false)
            router.push(`/search?q=${encodeURIComponent(trimmed)}`)
        }
    }

    return (
        <div
            ref={containerRef}
            className="relative mx-auto w-full max-w-lg"
        >
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <Input
                    placeholder="Search companies, blogs..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => results && setIsOpen(true)}
                    className="bg-white text-black border-gray-300 pl-9 focus:border-black"
                />

                {loading && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-500" />
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && results && (
                <div className="absolute z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                    {/* Companies */}
                    {results.companies.length > 0 && (
                        <Section title="Companies">
                            {results.companies.map(c => (
                                <ResultItem
                                    key={c.id}
                                    href={`/listing/${c.slug}`}
                                    label={c.name}
                                    onSelect={() => setIsOpen(false)}
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
                                    onSelect={() => setIsOpen(false)}
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
    onSelect,
}: {
    href: string
    label: string
    onSelect?: () => void
}) {
    return (
        <Link
            href={href}
            onClick={onSelect}
            className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100"
        >
            {label}
        </Link>
    )
}
