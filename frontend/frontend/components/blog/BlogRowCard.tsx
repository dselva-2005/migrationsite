// components/blog/BlogRowCard.tsx
import Image from "next/image"
import Link from "next/link"
import { BlogPost } from "@/types/blog"
import { TrustpilotRating } from "@/components/TrustpilotRating"
import { Badge } from "@/components/ui/badge"

export function BlogRowCard({ post }: { post: BlogPost }) {
    const imageSrc = post.image ?? "/images/placeholder.png"
    return (
        <article className="blog-layout-1">
            <div className="blog-box overflow-hidden rounded-lg border">
                {/* IMAGE */}
                <div className="relative h-[320px]">
                    <Link href={`/blog/${post.slug}`}>
                        <Image
                            src={imageSrc}
                            alt={post.title}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </Link>
                </div>

                {/* CONTENT */}
                <div className="p-6 space-y-4">
                    {/* CATEGORY + RATING */}
                    <div className="flex items-center justify-between">
                        <Badge variant="secondary">{post.category}</Badge>

                        <TrustpilotRating
                            rating={post.rating}
                            reviewCount={post.reviewCount}
                            starsize={14}
                        />
                    </div>

                    {/* TITLE */}
                    <h2 className="text-2xl font-semibold leading-snug">
                        <Link
                            href={`/blog/${post.slug}`}
                            className="hover:text-red-600 transition"
                        >
                            {post.title}
                        </Link>
                    </h2>

                    {/* META */}
                    <ul className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {/* <li>by {post.author}</li> */}
                        <li>{post.date}</li>
                        <li>{post.views} views</li>
                    </ul>

                    {/* EXCERPT */}
                    <p className="text-muted-foreground">
                        {post.excerpt}
                    </p>

                    {/* READ MORE */}
                    <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center font-medium text-red-600"
                    >
                        Read More →
                    </Link>
                </div>
            </div>
        </article>
    )
}
