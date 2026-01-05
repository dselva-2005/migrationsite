// types/blog.ts
export type BlogPost = {
    slug: string
    title: string
    excerpt: string
    content: string
    image: string | null
    category: string
    author: string
    date: string
    views: number
    rating: number
    reviewCount: number
}

export type PaginatedResponse<T> = {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

export type BlogCategory = {
    id: number
    name: string
    slug: string
    post_count: number
}
