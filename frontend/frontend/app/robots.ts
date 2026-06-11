import type { MetadataRoute } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://migrationreviews.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/auth/",
          "/api/admin/",
          "/api/private/",
          "/login/",
          "/register/",
          "/reset-password/",
          "/profile/",
          "/business-login/",
          "/register-a-business/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
