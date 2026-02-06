"use client"

import { Section } from "@/components/Section"
import ContactQuickContactSection from "@/components/ContactQuickContactSection"

import { PageContentProvider } from "@/providers/PageContentProvider"
import ContactOfficesSection from "@/components/ContactOfficesSection"
import PageHero from "@/components/contactpageHero"

export default function ContactPage() {
    return (
        <PageContentProvider page="contact">
            <>
                <PageHero></PageHero>
                <Section tone="base">
                    <ContactQuickContactSection />
                </Section>
                <Section tone="base">
                    <ContactOfficesSection />
                </Section>
            </>
        </PageContentProvider>
    )
}
