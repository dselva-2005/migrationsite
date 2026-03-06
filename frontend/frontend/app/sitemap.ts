import type { MetadataRoute } from "next"

type SitemapItem = {
  slug: string
  updated_at: string
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

async function fetchSitemapData(endpoint: string): Promise<SitemapItem[]> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch sitemap data from ${endpoint}`)
  }

  return res.json() as Promise<SitemapItem[]>
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, companies] = await Promise.all([
    fetchSitemapData("/api/blog/sitemap/"),
    fetchSitemapData("/api/company/sitemap/"),
  ])

  // -------------------------
  // Static SEO pages
  // -------------------------

  const staticRoutes: string[] = [
    "/",
    "/about",
    "/contact",
    "/blog",
    "/listing",
    "/review",
    "/search",
    "/countries-overview",
    "/visa-overview",
  ]

  const staticPages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.9,
  }))

  // -------------------------
  // Blog pages
  // -------------------------

  const blogPages: MetadataRoute.Sitemap = blogs.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  // -------------------------
  // Company pages
  // -------------------------

  const companyPages: MetadataRoute.Sitemap = companies.map((company) => ({
    url: `${BASE_URL}/listing/${company.slug}`,
    lastModified: new Date(company.updated_at),
    changeFrequency: "weekly",
    priority: 0.9,
  }))

  return [...staticPages, ...blogPages, ...companyPages]
}