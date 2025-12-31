"use client"

import { blogs } from "@/lib/blog"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { TrustpilotRating } from "@/components/TrustpilotRating"
import { Section } from "@/components/Section"
export default function SingleBlog() {
    const pathname = usePathname()

    // "/blog/new-freehand-templates" → "new-freehand-templates"
    const slug = pathname.split("/").filter(Boolean).at(-1)

    const post = blogs.find((b) => b.slug === slug)
    if (!post) return null

    return (
        <Section>
            <article className="m-auto container max-w-3xl py-12 space-y-6">
                <h1 className="text-3xl font-bold">{post.title}</h1>

                <TrustpilotRating
                    rating={post.rating}
                    reviewCount={post.reviewCount}
                    starsize={22}
                />

                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>


                <div className="text-sm text-muted-foreground">
                    {post.author} · {post.date} · {post.views} views
                </div>

                <div className="prose max-w-none">
                    {post.content}
                </div>
            </article>
        </Section>
    )
}
