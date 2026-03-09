import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/login/",
          "/register/",
          "/reset-password/",
          "/profile/",
          "/business-login/",
          "/register-a-business/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}