"use client"

import { VisaServiceCard } from "@/components/VisaServiceCard"
import { usePageContent } from "@/providers/PageContentProvider"

/* ---------------- Types ---------------- */

type VisaHeader = {
    eyebrow: string
    title: string
    description: string
}

type VisaService = {
    index: string
    title: string
    description: string
    image: string
    items: string[]
    href: string
}

/* ---------------- Component ---------------- */

export function VisaServicesSection() {
    const content = usePageContent()

    const header = content["visa.header"] as VisaHeader | undefined
    const services = content["visa.services"] as VisaService[] | undefined

    // graceful CMS failure
    if (!header || !services?.length) return null

    return (
        <section className="py-4 sm:py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-4">

                {/* Heading (CMS-controlled) */}
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
                        {header.eyebrow}
                    </p>

                    <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        {header.title}
                    </h2>

                    <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                        {header.description}
                    </p>
                </div>

                {/* Cards (CMS-driven) */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {services.map((service) => (
                        <VisaServiceCard
                            key={service.index}
                            {...service}
                        />
                    ))}
                </div>

            </div>
        </section>
    )
}
