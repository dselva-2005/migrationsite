import publicApi from "@/lib/publicApi"
import { BlogPost } from "@/types/blog"

export type BlogListResponse = {
    count: number
    next: string | null
    previous: string | null
    results: BlogPost[]
}

export async function getBlogPosts(
    page: number = 1
): Promise<BlogListResponse> {
    const res = await publicApi.get<BlogListResponse>("/api/blog/", {
        params: { page },
    })

    return res.data
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
    const res = await publicApi.get<BlogPost>(`/api/blog/${slug}/`)
    return res.data
}