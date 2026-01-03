// components/blog/BlogList.tsx
import { BlogPost } from "@/types/blog"
import { BlogRowCard } from "./BlogRowCard"

export function BlogList({ posts }: { posts: BlogPost[] }) {
    return (
        <div className="space-y-12">
            {posts.map((post) => (
                <BlogRowCard key={post.slug} post={post} />
            ))}
        </div>
    )
}
