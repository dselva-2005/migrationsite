"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePageContent } from "@/providers/PageContentProvider"
import { Card, CardContent } from "@/components/ui/card"

type CTA = {
    label: string
    href: string
}

type ServiceItem = {
    title: string
    image: string
    description: string
    cta: CTA
}

type TabHeader = {
    title: string
    description: string[]
}

type ServiceTab = {
    id: string
    label: string
    icon: string
    header: TabHeader
    items: ServiceItem[]
}

type ServicesTabsData = {
    tabs: ServiceTab[]
}


export default function CountryServicesTabs() {
    const { content, loading } = usePageContent()

    const data = content?.["country.services_tabs"] as
        | ServicesTabsData
        | undefined

    const [activeTab, setActiveTab] = useState<string | null>(
        data?.tabs?.[0]?.id ?? null
    )

    if (loading || !data) return (
        <div className="space-y-6 px-4 sm:px-6">
            <div className="h-10 sm:h-12 bg-muted animate-pulse rounded-lg" />
            <div className="h-56 sm:h-64 bg-muted animate-pulse rounded-lg" />
        </div>
    )

    const currentTab = activeTab ? data.tabs.find(t => t.id === activeTab) : data.tabs[0]

    if (!currentTab) return null

    return (
        <div className="space-y-8 px-4 sm:px-6">
            {/* TAB BUTTONS */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 border-0">
                {data.tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 font-medium transition-colors rounded-lg ${
                            tab.id === (activeTab || data.tabs[0].id)
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        }`}
                    >
                        <span className="flex items-center gap-1.5 sm:gap-2">
                            <i className={`${tab.icon} text-sm sm:text-base`} />
                            <span className="text-sm sm:text-base">{tab.label}</span>
                        </span>
                    </button>
                ))}
            </div>

            {/* TAB CONTENT */}
            <div className="space-y-6 sm:space-y-8">
                {/* Header Text */}
                <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center sm:text-left">
                        {currentTab.header.title}
                    </h2>
                    <div className="space-y-2 sm:space-y-3">
                        {currentTab.header.description.map((p, i) => (
                            <p key={i} className="text-base sm:text-lg text-muted-foreground text-center sm:text-left">
                                {p}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Service Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                    {currentTab.items.map(item => (
                        <Card 
                            key={item.title} 
                            className="overflow-hidden p-0 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                        >
                            <div className="relative h-40 sm:h-44 md:h-48 w-full flex-shrink-0">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                            </div>
                            <CardContent className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 flex-grow flex flex-col">
                                <h3 className="text-lg sm:text-xl font-semibold">
                                    {item.title}
                                </h3>
                                <p className="text-sm sm:text-base text-muted-foreground flex-grow">
                                    {item.description}
                                </p>
                                <div className="pt-2">
                                    <Link
                                        href={item.cta.href}
                                        className="inline-flex items-center text-primary hover:underline font-medium text-sm sm:text-base"
                                    >
                                        {item.cta.label}
                                        <i className="ml-1.5 sm:ml-2">→</i>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}