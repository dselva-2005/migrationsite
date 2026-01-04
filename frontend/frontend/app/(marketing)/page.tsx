"use client"
import AboutSection from "@/components/AboutSection"
import InfoSection from "@/components/InfoSection"
import { VisaServicesSection } from "@/components/VisaServicesSection"
import TestimonialSection from "@/components/TestimonialSection"
import CountriesSection from "@/components/CountriesSection"
import { Section } from "@/components/Section"
import WhyChooseUsSection from "@/components/WhyChooseUsSection"
import NewsSection from "@/components/NewsSection"
import { PageContentProvider } from "@/providers/PageContentProvider"
import Hero from "@/components/Hero"
import { CompanyReviewGrid } from "@/components/CompanyReviewGrid"
import { Company } from "@/types/company"
import { getCompanies } from "@/services/company"
import { useState,useEffect } from "react"    

export default function Home() {
    const [companies,setCompanies] = useState<Company[]>([])
    useEffect(() => {
        let cancelled = false

        getCompanies().then((data) => {
            if (cancelled) return
            setCompanies(data.results)
        })

        return () => {
            cancelled = true
        }
    }, [])
    return (
        <PageContentProvider page="home">
            <Hero/>
            <Section tone="base">
                <InfoSection />
            </Section>

            <Section tone="base">
                <CompanyReviewGrid
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
        </PageContentProvider>
    )
}
