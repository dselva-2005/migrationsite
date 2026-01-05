// app/blog/page.tsx
"use client"

import { useEffect, useState } from "react"
import { BlogPost, BlogCategory } from "@/types/blog"
import { getBlogPosts, getBlogCategories } from "@/services/blog"
import { Section } from "@/components/Section"
import { BlogList } from "@/components/blog/BlogList"
import { BlogSidebar } from "@/components/blog/BlogSidebar"

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [categories, setCategories] = useState<BlogCategory[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function load() {
            try {
                const [postsRes, categoriesRes] = await Promise.all([
                    getBlogPosts(),
                    getBlogCategories(),
                ])

                setPosts(postsRes.results)
                setCategories(categoriesRes)
            } catch (err) {
                console.error(err)
                setError("Failed to load blog data")
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

    if (loading) return <div className="p-8">Loading...</div>
    if (error) return <div className="p-8 text-red-500">{error}</div>

    return (
        <Section tone="base">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-8">
                    <BlogList posts={posts} />
                </div>

                <div className="xl:col-span-4">
                    <BlogSidebar categories={categories} />
                </div>
            </div>
        </Section>
    )
}
