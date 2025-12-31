"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"

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

const NEWS: NewsItem[] = [
    {
        id: "1",
        title: "Project concepts or related queries should be",
        excerpt:
            "Nemo ipsam egestas volute turpis dolores and aliquam quaerat in which toil and pain procure...",
        image:
            "https://migrationreviews.com/1123/wp-content/uploads/2022/02/visa-15-370x300.jpg",
        date: { day: "04", month: "Mar" },
        category: "Immigration",
        author: "Admin",
        comments: 0,
        href: "#",
    },
    {
        id: "2",
        title: "Covid-19 And Its Impact On UK Immigration",
        excerpt:
            "Indignation and dislike men who are beguiled and demoralized in which toil and pain procure...",
        image:
            "https://migrationreviews.com/1123/wp-content/uploads/2022/02/visa-16-370x300.jpg",
        date: { day: "05", month: "Feb" },
        category: "Immigration",
        author: "Admin",
        comments: 0,
        href: "#",
    },
    {
        id: "3",
        title: "Customers Applying for Priority Visas",
        excerpt:
            "Fusce sollicitudin ante et felis cursus, id tristique ex volutpat. An magnis nulla dolor sapien...",
        image:
            "https://migrationreviews.com/1123/wp-content/uploads/2022/02/visa-14-370x300.jpg",
        date: { day: "05", month: "Feb" },
        category: "Immigration",
        author: "Admin",
        comments: 0,
        href: "#",
    },
]

export default function NewsSection() {
    return (
        <section id="news" className="bg-background py-20">
            <div className="mx-auto max-w-7xl px-4">
                {/* Section Header */}
                <div className="mb-14 text-center">
                    <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary/80">
                        News & Updates
                    </p>
                    <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Read Our Latest Insights
                    </h2>
                </div>

                {/* News Grid */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {NEWS.map((post) => (
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
                                    className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                />

                                {/* Date Badge */}
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
                            <CardContent className="flex h-75 flex-col gap-4 p-8">
                                {/* Meta */}
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="font-medium text-primary">
                                        {post.category}
                                    </span>
                                    <span>By {post.author}</span>
                                </div>

                                {/* Title */}
                                <h4 className="text-lg font-semibold leading-snug line-clamp-2">
                                    <Link href={post.href} className="hover:underline">
                                        {post.title}
                                    </Link>
                                </h4>

                                {/* Excerpt */}
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {post.excerpt}
                                </p>

                                {/* Footer */}
                                <div className="mt-auto flex items-center justify-between pt-4">
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
            </div>
        </section>
    )
}
