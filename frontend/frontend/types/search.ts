import publicApi from "@/lib/publicApi"

export type SearchResponse = {
    blogs: {
        id: number
        title: string
        slug: string
    }[]
    companies: {
        id: number
        name: string
        slug: string
    }[]
}

export async function searchAll(q: string) {
    const res = await publicApi.get<SearchResponse>(
        "/api/content/search/",
        { params: { q } }
    )
    return res.data
}
