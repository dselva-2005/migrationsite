
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

export default function Home() {
    return (
        <PageContentProvider page="home">
            <Hero/>
            <Section tone="base">
                <InfoSection />
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
