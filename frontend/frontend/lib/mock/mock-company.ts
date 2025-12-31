import { Company } from "../api/types"
export const mockCompany: Company = {
  id: "1",
  name: "Bud Love",
  slug: "budlove.com",
  logoUrl:
    "https://consumersiteimages.trustpilot.net/business-units/646d7167a10721677e3d0cf1-198x149-1x.jpg",
  websiteUrl: "https://budlove.com",
  category: {
    name: "Cannabis store",
    slug: "cannabis_store",
  },
  isClaimed: true,
  totalReviews: 577,
  trustScore: 4.9,
  ratingText: "Excellent",
  rating:4.3
}
