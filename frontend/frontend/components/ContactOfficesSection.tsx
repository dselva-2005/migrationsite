"use client"

import Image from "next/image"
import { usePageContent } from "@/providers/PageContentProvider"
import type { ContactOfficesContent } from "@/types/contact-offices"

/* ----------------------------------
   Utils
---------------------------------- */

// Converts normal Google Maps URL → embed URL (no API key)
function toEmbedUrl(url: string) {
    return `https://www.google.com/maps?q=${encodeURIComponent(url)}&output=embed`
}

/* ----------------------------------
   Component
---------------------------------- */

export default function ContactOfficesSection() {
    const { content, loading } = usePageContent()

    if (loading) return <ContactOfficesSkeleton />
    if (!content) return null

    const section =
        content["contact.offices"] as ContactOfficesContent | undefined

    if (!section || section.offices.length === 0) return null

    return (
        <section className="bg-background">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-sm font-semibold text-primary">
                        {section.header.eyebrow}
                    </p>
                    <h2 className="mt-2 text-3xl font-bold">
                        {section.header.title}
                    </h2>
                </div>

                {/* Offices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {section.offices.map((office) => (
                        <div
                            key={office.id}
                            className="bg-muted/30 rounded-xl p-6 text-center shadow-sm"
                        >
                            {/* Country Image */}
                            <div className="flex justify-center mb-4">
                                <Image
                                    src={office.image.url}
                                    alt={office.image.alt ?? office.country}
                                    width={48}
                                    height={32}
                                    className="object-contain"
                                />
                            </div>

                            <h4 className="font-semibold text-lg mb-2">
                                {office.country}
                            </h4>

                            <p className="text-sm">
                                <a
                                    href={office.phone.href}
                                    className="hover:underline"
                                >
                                    {office.phone.label}
                                </a>
                            </p>

                            <p className="text-sm mb-3">
                                <a
                                    href={office.email.href}
                                    className="text-primary hover:underline"
                                >
                                    {office.email.label}
                                </a>
                            </p>

                            <p className="text-sm text-muted-foreground">
                                {office.address}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Map */}
                <div className="mt-16 rounded-xl overflow-hidden border">
                    <iframe
                        src={toEmbedUrl(section.map.url)}
                        className="w-full h-[420px]"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>

            </div>
        </section>
    )
}

/* ----------------------------------
   Skeleton
---------------------------------- */

function ContactOfficesSkeleton() {
    return (
        <section className="animate-pulse">
            <div className="max-w-7xl mx-auto px-4">

                <div className="mb-12 text-center space-y-3">
                    <div className="h-4 w-40 mx-auto bg-muted rounded" />
                    <div className="h-8 w-2/3 mx-auto bg-muted rounded" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-muted/30 rounded-xl p-6 space-y-4"
                        >
                            <div className="h-8 w-12 mx-auto bg-muted rounded" />
                            <div className="h-4 w-24 mx-auto bg-muted rounded" />
                            <div className="h-3 w-32 mx-auto bg-muted rounded" />
                            <div className="h-3 w-40 mx-auto bg-muted rounded" />
                        </div>
                    ))}
                </div>

                <div className="mt-16 h-[420px] bg-muted rounded-xl" />

            </div>
        </section>
    )
}
