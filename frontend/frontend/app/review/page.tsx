import { CompanyReviewGrid } from "@/components/CompanyReviewGrid";
import { Section } from "@/components/Section";
import { ReviewHero } from "@/components/review/ReviewHero";
import { ReviewPagination } from "@/components/company/ReviewPagination";

export default function Review() {
    return (
        <>
            <ReviewHero></ReviewHero>
            <Section>
                <CompanyReviewGrid
                    companies={[
                        {
                            id: "1",
                            name: "ONEA Kids",
                            domain: "oneakids.com",
                            slug: "oneakids.com",
                            imageUrl:
                                "https://consumersiteimages.trustpilot.net/business-units/654e55b13e2c058cc7578849-198x149-1x.jpg",
                            rating: 2.2,
                            reviewCount: 114,
                        },
                        {
                            id: "2",
                            name: "CloudNest Hosting",
                            domain: "cloudnest.io",
                            slug: "cloudnest.io",
                            imageUrl: "https://picsum.photos/seed/cloudnest/400/300",
                            rating: 4.6,
                            reviewCount: 982,
                        },
                        {
                            id: "3",
                            name: "GreenCart",
                            domain: "greencart.shop",
                            slug: "greencart.shop",
                            imageUrl: "https://picsum.photos/seed/greencart/400/300",
                            rating: 3.8,
                            reviewCount: 421,
                        },
                        {
                            id: "4",
                            name: "UrbanRide",
                            domain: "urbanride.in",
                            slug: "urbanride.in",
                            imageUrl: "https://placeimg.com/400/300/transport",
                            rating: 4.1,
                            reviewCount: 1264,
                        },
                        {
                            id: "5",
                            name: "FitFuel",
                            domain: "fitfuel.com",
                            slug: "fitfuel.com",
                            imageUrl: "https://placeimg.com/400/300/tech",
                            rating: 3.2,
                            reviewCount: 189,
                        },
                        {
                            id: "6",
                            name: "StudySphere",
                            domain: "studysphere.org",
                            slug: "studysphere.org",
                            imageUrl: "https://picsum.photos/seed/studysphere/400/300",
                            rating: 4.9,
                            reviewCount: 3421,
                        },
                        {
                            id: "7",
                            name: "TravelMint",
                            domain: "travelmint.co",
                            slug: "travelmint.co",
                            imageUrl: "https://placeimg.com/400/300/nature",
                            rating: 2.7,
                            reviewCount: 76,
                        },
                        {
                            id: "8",
                            name: "PaySwift",
                            domain: "payswift.app",
                            slug: "payswift.app",
                            imageUrl: "https://picsum.photos/seed/payswift/400/300",
                            rating: 4.3,
                            reviewCount: 2154,
                        },
                    ]}
                />
                <ReviewPagination page={290} pageSize={5} total={899}/>
            </Section>
        </>
    );
}