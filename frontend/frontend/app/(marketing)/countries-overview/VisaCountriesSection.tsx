"use client"

import { usePageContent } from "@/providers/PageContentProvider"
import Image from "next/image"

/* =========================
   TYPES
========================= */
type Country = {
    flag: string
    category: string
    name: string
    link: string
    description: string
    benefits: string[]
}

type CountriesSectionData = {
    sectionTitle: {
        small: string
        main: string
        patternImage: string
    }
    countries_section: Country[]
}

/* =========================
   COMPONENT
========================= */
export default function VisaCountriesSection() {
    const { content, loading } = usePageContent()

    // Correct key: root object has sectionTitle + countries_section
    const data = content as CountriesSectionData | undefined

    if (loading) return <p>Loading...</p>
    if (!data) return null

    return (
        <section className="countries-style-three countries-page relative">
            {/* Pattern background */}
            <div
                className="pattern-layer absolute inset-0"
                style={{ backgroundImage: `url(${data.sectionTitle.patternImage})` }}
            />

            <div className="auto-container relative z-10 max-w-7xl mx-auto px-4 py-20">
                {/* Section title */}
                <div className="sec-title text-center mb-12">
                    <h6 className="text-primary font-medium">{data.sectionTitle.small}</h6>
                    <h2 className="text-3xl font-bold">{data.sectionTitle.main}</h2>
                </div>

                {/* Countries grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {data.countries_section.map((country) => (
                        <div key={country.name} className="countries-block">
                            <div className="countries-block-three border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition">
                                <div className="inner-box p-6">
                                    <figure className="flag mb-4 w-16 h-16">
                                        <Image
                                            src={country.flag}
                                            alt={country.name}
                                            width={64}
                                            height={64}
                                            className="object-contain"
                                        />
                                    </figure>
                                    <h6 className="text-sm text-gray-500">{country.category}</h6>
                                    <h4 className="text-lg font-semibold mb-2">
                                        <a href={country.link} className="hover:underline">
                                            {country.name}
                                        </a>
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-4">{country.description}</p>

                                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                        {country.benefits.map((benefit, i) => (
                                            <li key={i}>{benefit}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
