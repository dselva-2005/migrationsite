import type { MetadataRoute } from "next"

export const dynamic = "force-dynamic"

type SitemapItem = {
  slug: string
  updated_at: string
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://migrationreviews.com"

async function fetchSitemapData(endpoint: string): Promise<SitemapItem[]> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) {
      console.error(`Sitemap fetch failed: ${endpoint} (status: ${res.status})`)
      return []
    }
    const data = await res.json()
    return Array.isArray(data) ? data : data.results || []
  } catch (error) {
    console.error(`Sitemap fetch error: ${endpoint}`, error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, companies] = await Promise.all([
    fetchSitemapData("/api/blog/sitemap/"),
    fetchSitemapData("/api/company/sitemap/"),
  ])

  // Static SEO pages (with trailing slashes)
  const staticRoutes = [
    { path: "/", priority: 1, frequency: "daily" as const },
    { path: "/about/", priority: 0.9, frequency: "weekly" as const },
    { path: "/contact/", priority: 0.8, frequency: "monthly" as const },
    { path: "/blog/", priority: 0.9, frequency: "daily" as const },
    { path: "/listing/", priority: 0.9, frequency: "daily" as const },
    { path: "/review/", priority: 0.95, frequency: "daily" as const },
    { path: "/search/", priority: 0.7, frequency: "weekly" as const },
    { path: "/countries-overview/", priority: 0.8, frequency: "weekly" as const },
    { path: "/visa-overview/", priority: 0.8, frequency: "weekly" as const },
  ]

  const staticPages: MetadataRoute.Sitemap = staticRoutes.map(({ path, priority, frequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: frequency,
    priority,
  }))

  // Blog pages (with trailing slashes)
  const blogPages: MetadataRoute.Sitemap = blogs
    .filter((post) => post.slug && post.updated_at) // Validate data
    .map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}/`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))

  // Company/Consultant pages (with trailing slashes)
  const companyPages: MetadataRoute.Sitemap = companies
    .filter((company) => company.slug && company.updated_at) // Validate data
    .map((company) => ({
      url: `${BASE_URL}/listing/${company.slug}/`,
      lastModified: new Date(company.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }))

  return [
    ...staticPages,
    ...blogPages,
    ...companyPages,
  ]
}