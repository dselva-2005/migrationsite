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

export default function Home() {
    const [companies, setCompanies] = useState<Company[]>([])

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
            }
        }

        fetchCompanies()

        return () => {
            cancelled = true
        }
    }, [])

    return (
        <PageContentProvider page="home">
            <>
                <Hero />

                <Section tone="base">
                    <InfoSection />
                </Section>
                <Section tone="base">
                    <CompanyReviewsSection
                        companies={companies.map((c) => ({
                            id: String(c.id),
                            name: c.name,
                            slug: c.slug,
                            domain: c.slug,
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
        </PageContentProvider>
    )
}
