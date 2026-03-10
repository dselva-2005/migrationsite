"use client"

import { useEffect, useState } from "react"

import AboutSection from "@/components/AboutSection"
import InfoSection from "@/components/InfoSection"
import { VisaServicesSection } from "@/components/VisaServicesSection"
import TestimonialSection from "@/components/TestimonialSection"
import CountriesSection from "@/components/CountriesSection"
import { Section } from "@/components/Section"
import WhyChooseUsSection from "@/components/WhyChooseUsSection"
import NewsSection from "@/components/NewsSection"
import Hero from "@/components/Hero"
import { CompanyReviewsSection } from "@/components/CompanyReviewsSection"

import { PageContentProvider } from "@/providers/PageContentProvider"
import { Company } from "@/types/company"
import { getCompanies } from "@/services/company"

/* =========================
   PAGE SKELETON
========================= */
function HomeSkeleton() {
    return (
        <div className="space-y-24">
            {/* Hero */}
            <div className="h-[420px] bg-muted animate-pulse" />

            {/* Repeating sections */}
            {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="max-w-7xl mx-auto px-4">
                    <div className="h-8 w-48 bg-muted rounded mb-6 animate-pulse" />
                    <div className="grid md:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, j) => (
                            <div
                                key={j}
                                className="h-48 bg-muted rounded-xl animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

/* =========================
   HOME PAGE
========================= */
export default function Home() {
    const [companies, setCompanies] = useState<Company[]>([])
    const [companiesLoading, setCompaniesLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        async function fetchCompanies() {
            try {
                const data = await getCompanies()
                if (!cancelled) {
                    setCompanies(data.results)
                }
            } catch (err) {
                console.error("Failed to fetch companies", err)
            } finally {
                if (!cancelled) {
                    setCompaniesLoading(false)
                }
            }
        }

        fetchCompanies()

        return () => {
            cancelled = true
        }
    }, [])

    return (
        <PageContentProvider page="home">
            {companiesLoading ? (
                <HomeSkeleton />
            ) : (
                <>
                    <Hero />
                    {/* temperory removal 
                    <Section tone="base">
                        <InfoSection />
                    </Section> */}

                    <Section tone="base">
                        <CompanyReviewsSection
                            companies={companies.map((c) => ({
                                id: String(c.id),
                                name: c.name,
                                slug: c.slug,
                                domain: c.slug,
                                city: c.city,
                                country: c.country,
                                imageUrl: c.logo ?? "/placeholder.png",
                                rating: Number(c.rating_average),
                                reviewCount: c.rating_count,
                            }))}
                        />
                    </Section>

                    <Section tone="soft">
                        <VisaServicesSection />
                    </Section>

                    <Section tone="neutral">
                        <AboutSection />
                    </Section>

                    <Section tone="base">
                        <CountriesSection />
                    </Section>

                    <Section tone="soft">
                        <TestimonialSection />
                    </Section>

                    <Section tone="neutral">
                        <WhyChooseUsSection />
                    </Section>

                    <Section tone="base">
                        <NewsSection />
                    </Section>
                </>
            )}
        </PageContentProvider>
    )
}
