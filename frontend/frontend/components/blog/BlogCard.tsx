// components/blog/BlogCard.tsx
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { BlogPost } from "@/types/blog"
import { TrustpilotRating } from "@/components/TrustpilotRating"
import { Badge } from "@/components/ui/badge"

export function BlogCard({ post }: { post: BlogPost }) {
    return (
        <Card className="p-0 overflow-hidden blog-layout-1">
            <div className="blog-box">
                {/* Image */}
                <div className="relative h-[220px]">
                    <Link href={`/blog/${post.slug}`}>
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                        />
                    </Link>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                    {/* Category + Rating */}
                    <div className="flex items-center justify-between">
                        <Badge className="bg-red-100 text-red-600">
                            {post.category}
                        </Badge>

                        <TrustpilotRating
                            rating={post.rating}
                            reviewCount={post.reviewCount}
                            starsize={14}
                        />
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold leading-snug">
                        <Link
                            href={`/blog/${post.slug}`}
                            className="hover:text-red-600 transition"
                        >
                            {post.title}
                        </Link>
                    </h2>

                    {/* Meta */}
                    <ul className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <li>by {post.author}</li>
                        <li>{post.date}</li>
                        <li>{post.views} views</li>
                    </ul>

                    {/* Excerpt */}
                    <p className="text-sm text-muted-foreground">
                        {post.excerpt}
                    </p>

                    {/* Read more */}
                    <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center font-medium text-red-600 hover:underline"
                    >
                        Read More →
                    </Link>
                </div>
            </div>
        </Card>
    )
}
