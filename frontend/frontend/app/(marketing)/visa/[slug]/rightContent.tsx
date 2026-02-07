"use client"

import { usePageContent } from "@/providers/PageContentProvider"
import { VisaTypeCard, VisaPackages, VisaReasonItem } from "@/types/visa"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"

/* =========================
   TYPES
========================= */
type VisaOverviewContent = {
    image: string
    title: string
    paragraphs: string[] // HTML strings
}

type VisaSectionDetails = Record<string, VisaOverviewContent>

type VisaPageContent = {
    visa_section_details: VisaSectionDetails
    visa_types?: VisaTypeCard[]
    packages?: VisaPackages
    reason?: {
        title: string
        description: string
        items: VisaReasonItem[]
    }
}

/* =========================
   SKELETON
========================= */
function RightContentSkeleton() {
    return (
        <div className="space-y-20 max-w-7xl mx-auto animate-pulse">
            <div className="space-y-6 py-10">
                <div className="h-64 w-full rounded-lg bg-muted" />
                <div className="space-y-3">
                    <div className="h-8 w-1/2 bg-muted rounded" />
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-5/6 bg-muted rounded" />
                    <div className="h-4 w-4/6 bg-muted rounded" />
                </div>
            </div>
        </div>
    )
}

/* =========================
   COMPONENT
========================= */
export default function RightContent() {
    const { content, loading } = usePageContent()
    const pathname = usePathname()

    const slug =
        pathname.replace(/\/$/, "").split("/").pop() ||
        "student-visa"

    const pageContent = content as VisaPageContent | undefined

    const overview =
        pageContent?.visa_section_details?.[slug]
    const visaTypes = pageContent?.visa_types ?? []
    const packages = pageContent?.packages
    const reason = pageContent?.reason

    const [activeTab, setActiveTab] = useState(
        packages?.tabs?.[0]?.key ?? ""
    )

    if (loading) return <RightContentSkeleton />
    if (!packages || !reason) return null

    return (
        <div className="space-y-20 max-w-7xl mx-auto">

            {/* ================= VISA OVERVIEW ================= */}
            {overview && (
                <div className="flex flex-col gap-6 py-10">
                    <Image
                        src={overview.image}
                        alt={overview.title}
                        width={800}
                        height={400}
                        className="rounded-lg object-cover w-full"
                    />

                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold">
                            {overview.title}
                        </h2>

                        {/* ✅ HTML STRING RENDERING */}
                        {overview.paragraphs.map((html, i) => (
                            <div
                                key={i}
                                className="text-muted-foreground prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: html }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* ================= VISA TYPES ================= */}
            <section className="grid md:grid-cols-3 gap-6">
                {visaTypes.map((v) => (
                    <div
                        key={v.id}
                        className="border group relative overflow-hidden rounded-lg"
                    >
                        <Image
                            src={v.image}
                            alt={v.title}
                            width={400}
                            height={260}
                            className="w-full"
                        />

                        <div className="p-4">
                            <p className="text-sm">
                                {v.description}
                            </p>
                            <h5 className="mt-2 font-semibold">
                                {v.title}
                            </h5>
                        </div>

                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                            <Image
                                src={v.hover_image}
                                alt={v.title}
                                fill
                                className="object-cover"
                            />
                            <Link
                                href={v.link}
                                className="absolute bottom-4 right-4 bg-primary px-4 py-2 text-white text-sm rounded"
                            >
                                Read More →
                            </Link>
                        </div>
                    </div>
                ))}
            </section>

            {/* ================= PACKAGES ================= */}
            <section>
                <div className="mb-8">
                    <h2 className="text-2xl font-bold">
                        {packages.title}
                    </h2>
                    <p className="text-muted-foreground">
                        {packages.description}
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-5 space-y-3">
                        {packages.tabs.map((tab, index) => {
                            const isActive = activeTab
                                ? activeTab === tab.key
                                : index === 0

                            return (
                                <button
                                    key={tab.key}
                                    onClick={() =>
                                        setActiveTab(tab.key)
                                    }
                                    className={`w-full text-left p-4 border rounded-lg ${
                                        isActive
                                            ? "bg-primary text-white"
                                            : "bg-background"
                                    }`}
                                >
                                    <h6 className="font-semibold">
                                        {tab.title}
                                    </h6>
                                    <p className="text-sm">
                                        {tab.subtitle}
                                    </p>
                                </button>
                            )
                        })}
                    </div>

                    {packages.tabs.map((tab, index) => {
                        const isActive = activeTab
                            ? activeTab === tab.key
                            : index === 0

                        if (!isActive) return null

                        return (
                            <div
                                key={tab.key}
                                className="lg:col-span-7"
                            >
                                <h4 className="text-xl font-semibold mb-3">
                                    {tab.content.heading}
                                </h4>
                                <p className="mb-4">
                                    {tab.content.text}
                                </p>
                                <Image
                                    src={tab.content.image}
                                    alt={tab.content.heading}
                                    width={500}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* ================= REASONS ================= */}
            <section>
                <div className="mb-8">
                    <h2 className="text-2xl font-bold">
                        {reason.title}
                    </h2>
                    <p className="text-muted-foreground">
                        {reason.description}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {reason.items.map((item) => (
                        <div
                            key={item.title}
                            className="flex gap-4"
                        >
                            <Image
                                src={item.icon}
                                alt={item.title}
                                width={48}
                                height={48}
                            />
                            <div>
                                <h4 className="font-semibold">
                                    {item.title}
                                </h4>
                                <p className="text-sm">
                                    {item.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
