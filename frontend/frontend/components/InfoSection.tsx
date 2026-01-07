"use client"

import { InfoCard } from "./InfoCard"
import { InfoCardCarousel } from "./InfoCardCarousel"
import { ShieldCheck, Globe, FileText } from "lucide-react"
import { usePageContent } from "@/providers/PageContentProvider"

/* ───────────────────────── TYPES ───────────────────────── */

type InfoHeader = {
    eyebrow: string
    title: string
    highlight: string
}

type InfoCardCMS = {
    title: string
    description: string
    buttonText: string
    buttonLink: string
}

/* ───────────────────────── ICON MAP ───────────────────────── */

const ICONS = [
    <ShieldCheck key={1} className="h-8 w-8 text-red-500" />,
    <Globe key={2} className="h-8 w-8 text-blue-500" />,
    <FileText key={3} className="h-8 w-8 text-green-500" />,
    <ShieldCheck key={4} className="h-8 w-8 text-purple-500" />,
]

/* ───────────────────────── COMPONENT ───────────────────────── */

export default function InfoSection() {
    const { content, loading } = usePageContent()

    if (loading || !content) return null

    const header = content["info.header"] as InfoHeader | undefined
    const cards = content["info.cards"] as InfoCardCMS[] | undefined

    // graceful CMS failure
    if (!header || !cards?.length) return null

    return (
        <div>
            {/* Header */}
            <div className="text-center p-4">
                <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary/80">
                    {header.eyebrow}
                </p>

                <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-3xl">
                    {header.title}{" "}
                    <span className="text-primary">{header.highlight}</span>
                </h2>
            </div>

            {/* Cards */}
            <InfoCardCarousel>
                {cards.map((card, idx) => (
                    <InfoCard
                        key={idx}
                        icon={ICONS[idx] ?? null}
                        title={card.title}
                        description={card.description}
                        buttonText={card.buttonText}
                        buttonLink={card.buttonLink}
                    />
                ))}
            </InfoCardCarousel>
        </div>
    )
}
