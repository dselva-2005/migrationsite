"use client"

import { PageContentProvider } from "@/providers/PageContentProvider"
import VisaCountriesSection from "./VisaCountriesSection"
import TravelVisaSection from "./TravelVisaSection"
import CountriesSection from "@/components/CountriesSection"
import CountriesPageTitle from "./CountriesPageTitle"
import { Section } from "@/components/Section"

/* =========================
   COUNTRIES PAGE
========================= */
export default function Countries() {
    return (
        // Wrap with PageContentProvider and pass page key as "countries"
        <PageContentProvider page="countries-overview">
            <CountriesPageTitle />
            <Section>
                <TravelVisaSection />
            </Section>
            <Section>
                <CountriesSection />
            </Section>
            <Section>
                <VisaCountriesSection />
            </Section>
        </PageContentProvider>
    )
}
