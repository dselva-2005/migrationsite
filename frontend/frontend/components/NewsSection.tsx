"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"
import { usePageContent } from "@/providers/PageContentProvider"
import { useEffect, useState } from "react"
import { getBlogPosts } from "@/services/blog" // Import from your service

/* ---------------- Types ---------------- */

type NewsHeader = {
    eyebrow: string
    title: string
}

type NewsItem = {
    id: string
    title: string
    excerpt: string
    image: string
    date: {
        day: string
        month: string
    }
    category: string
    author: string
    comments: number
    href: string
}

/* ---------------- Component ---------------- */

export default function NewsSection() {
    const { content, loading } = usePageContent()
    const [blogs, setBlogs] = useState<NewsItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    /* ---------------- Fetch blogs using service ---------------- */

    useEffect(() => {
        async function fetchBlogs() {
            setIsLoading(true)
            try {
                // Use the cached service function
                const data = await getBlogPosts(1) // Page 1, uses cache automatically
                
                // Take only first 3 blogs for the homepage section
                // (API returns max 8 blogs, so this is efficient enough)
                const mapped: NewsItem[] = data.results.slice(0, 3).map((b) => {
                    const dateObj = new Date(b.date)
                    const day = dateObj.getUTCDate().toString().padStart(2, "0")
                    const month = dateObj.toLocaleString("default", { month: "short" })

                    return {
                        id: b.slug,
                        title: b.title,
                        excerpt: b.excerpt || "", // Handle if excerpt might be missing
                        image: b.image || "/placeholder.jpg", // Provide fallback image
                        date: { day, month },
                        category: b.category || "Uncategorized",
                        author: b.author || "Anonymous",
                        comments: b.reviewCount || 0,
                        href: `/blog/${b.slug}`,
                    }
                })

                setBlogs(mapped)
            } catch (err) {
                console.error("Failed to fetch blogs", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchBlogs()
    }, []) // Empty dependency array means this runs once on mount

    /* ---------------- Hook-safe guards ---------------- */

    if (loading || !content) return null

    const header = content["news.header"] as NewsHeader | undefined
    if (!header) return null

    /* ---------------- Render ---------------- */

    return (
        <section id="news" className="bg-background py-5">
            <div className="mx-auto max-w-7xl px-4">

                {/* Header */}
                <div className="mb-14 text-center">
                    <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary/80">
                        {header.eyebrow}
                    </p>
                    <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        {header.title}
                    </h2>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="overflow-hidden rounded-2xl border p-0">
                                <div className="h-[200px] bg-gray-200 animate-pulse" />
                                <CardContent className="p-8">
                                    <div className="h-4 bg-gray-200 animate-pulse mb-4 w-1/3" />
                                    <div className="h-6 bg-gray-200 animate-pulse mb-4" />
                                    <div className="h-4 bg-gray-200 animate-pulse mb-2" />
                                    <div className="h-4 bg-gray-200 animate-pulse mb-2 w-2/3" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* News Grid */}
                {!isLoading && (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {blogs.map((post) => (
                            <Card
                                key={post.id}
                                className="group overflow-hidden rounded-2xl border p-0 transition-shadow hover:shadow-lg"
                            >
                                {/* Image */}
                                <div className="relative overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        width={370}
                                        height={300}
                                        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        unoptimized
                                    />

                                    {/* Date badge */}
                                    <div className="absolute left-4 top-4 rounded-xl bg-background px-3 py-2 text-center shadow-sm">
                                        <div className="text-lg font-semibold leading-none">
                                            {post.date.day}
                                        </div>
                                        <div className="text-xs uppercase text-muted-foreground">
                                            {post.date.month}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <CardContent className="flex flex-col gap-4 p-8">
                                    {/* Meta */}
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="font-medium text-primary">
                                            {post.category}
                                        </span>
                                        {/* <span>By {post.author}</span> */}
                                    </div>

                                    {/* Title */}
                                    <h4 className="line-clamp-2 text-lg font-semibold leading-snug">
                                        <Link href={post.href} className="hover:underline">
                                            {post.title}
                                        </Link>
                                    </h4>

                                    {/* Excerpt */}
                                    <p className="line-clamp-3 text-sm text-muted-foreground">
                                        {post.excerpt}
                                    </p>

                                    {/* Footer */}
                                    <div className="mt-auto flex items-center justify-between">
                                        <Link
                                            href={post.href}
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Read More →
                                        </Link>

                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <MessageCircle className="h-4 w-4" />
                                            {post.comments}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}