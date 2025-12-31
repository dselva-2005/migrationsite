"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CountriesCarousel } from "./CountriesCarousel"
const DATA = {
    education: [
        {
            id: "canada-edu",
            name: "Canada",
            description:
                "World-class universities, post-study work permits, and a welcoming immigration system for international students.",
            image:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/02/i-5-370x250.jpg",
            flag:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/04/066-canada.svg",
            link: "/canada",
        },
        {
            id: "southafrica-edu",
            name: "South Africa",
            description:
                "Affordable education with globally recognized degrees and diverse cultural exposure.",
            image:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/02/i-1-370x250.jpg",
            flag:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/04/188-south-africa.svg",
            link: "/south-africa",
        },
        {
            id: "brazil-edu",
            name: "Brazil",
            description:
                "Emerging education hub offering research-focused universities and vibrant student life.",
            image:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/02/i-6-370x250.jpg",
            flag:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/04/022-brazil.svg",
            link: "/brazil",
        },
        {
            id: "uk-edu",
            name: "United Kingdom",
            description:
                "Home to historic universities, globally ranked institutions, and shorter degree durations.",
            image:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/02/i-4-370x250.jpg",
            flag:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/04/110-united-kingdom.svg",
            link: "/united-kingdom",
        },
        {
            id: "australia-edu",
            name: "Australia",
            description:
                "High academic standards, strong research focus, and excellent post-study work options.",
            image:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/02/i-2-370x250.jpg",
            flag:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/04/009-australia.svg",
            link: "/australia",
        },
    ],

    immigration: [
        {
            id: "germany-imm",
            name: "Germany",
            description:
                "Skilled worker programs, strong economy, and long-term settlement opportunities.",
            image:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/02/e2-370x250.jpg",
            flag:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/04/208-germany.svg",
            link: "/germany",
        },
        {
            id: "uae-imm",
            name: "UAE",
            description:
                "Golden visa programs, tax-free income, and a fast-growing global business hub.",
            image:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/04/e13-370x250.jpg",
            flag:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/04/195-united-arab-emirates.svg",
            link: "/uae",
        },
        {
            id: "canada-imm",
            name: "Canada",
            description:
                "Points-based immigration system with clear pathways to permanent residency.",
            image:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/02/e1-370x250.jpg",
            flag:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/04/066-canada.svg",
            link: "/canada-immigration",
        },
        {
            id: "newzealand-imm",
            name: "New Zealand",
            description:
                "High quality of life, skilled migration visas, and family-friendly policies.",
            image:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/02/e8-370x250.jpg",
            flag:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/04/215-new-zealand.svg",
            link: "/new-zealand",
        },
    ],

    business: [
        {
            id: "usa-biz",
            name: "United States",
            description:
                "Global business capital offering startup visas, investor programs, and innovation ecosystems.",
            image:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/02/e3-370x250.jpg",
            flag:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/04/186-united-states.svg",
            link: "/usa",
        },
        {
            id: "india-biz",
            name: "India",
            description:
                "Rapidly growing economy with vast market potential and startup-friendly initiatives.",
            image:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/02/e4-370x250.jpg",
            flag:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/02/055-india.svg",
            link: "/india",
        },
        {
            id: "singapore-biz",
            name: "Singapore",
            description:
                "Asia’s financial hub with strong legal systems and ease of doing business.",
            image:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/02/i-7-370x250.jpg",
            flag:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/04/191-singapore.svg",
            link: "/singapore",
        },
        {
            id: "uk-biz",
            name: "United Kingdom",
            description:
                "Gateway to European markets with investor and innovator visa routes.",
            image:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/02/i-4-370x250.jpg",
            flag:
                "https://migrationreviews.com/1123/wp-content/uploads/2022/04/110-united-kingdom.svg",
            link: "/uk-business",
        },
    ],
}


export default function CountriesSection() {
    return (
        <section className="py-2">
            <div className="mx-auto max-w-7xl px-4">

                {/* Header */}
                <div className="mb-12 text-center">
                    <p className="text-sm uppercase tracking-widest text-muted-foreground">
                        Countries We Offer
                    </p>
                    <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                        Best Countries to Travel
                    </h2>
                </div>

                <Tabs defaultValue="education">
                    <TabsList className="mx-auto mb-10 flex w-fit gap-6">
                        <TabsTrigger value="education">Education</TabsTrigger>
                        <TabsTrigger value="immigration">Immigration</TabsTrigger>
                        <TabsTrigger value="business">Business</TabsTrigger>
                    </TabsList>

                    <TabsContent value="education">
                        <CountriesCarousel items={DATA.education} />
                    </TabsContent>

                    <TabsContent value="immigration">
                        <CountriesCarousel items={DATA.immigration} />
                    </TabsContent>

                    <TabsContent value="business">
                        <CountriesCarousel items={DATA.business} />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    )
}
