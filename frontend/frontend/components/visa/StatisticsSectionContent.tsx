"use client"

import Image from "next/image"
import { usePageContent } from "@/providers/PageContentProvider"

/* -----------------------------
   Content shape from backend
-------------------------------- */
export type StatisticsSectionContent = {
    images: {
        primary: string
        secondary?: string
        badge_icon?: string
        badge_text?: string
    }
    header: {
        eyebrow: string
        title: string
        description: string
    }
    skills: Array<{
        label: string
        value: number
        suffix: string
    }>
    download: {
        label: string
        title: string
        url: string
    }
}

export default function StatisticsSection() {
    const { content, loading } = usePageContent()

    if (loading || !content) return null

    const data = content["visa.statistics"] as StatisticsSectionContent | undefined

    if (!data) return null

    return (
        <section>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Image column */}
                    <div className="relative">
                        <div className="relative w-full h-[420px] rounded-2xl overflow-hidden">
                            <Image
                                src={data.images.primary}
                                alt={data.header.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {data.images.secondary && (
                            <div className="absolute bottom-[-40px] right-[-40px] w-48 h-48">
                                <Image
                                    src={data.images.secondary}
                                    alt=""
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}

                        {data.images.badge_text && (
                            <div className="absolute top-6 left-6 flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow">
                                {data.images.badge_icon && (
                                    <Image
                                        src={data.images.badge_icon}
                                        alt=""
                                        width={24}
                                        height={24}
                                    />
                                )}
                                <span className="text-xs font-semibold">
                                    {data.images.badge_text}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content column */}
                    <div>
                        <div className="mb-8">
                            <h6 className="text-sm font-semibold uppercase tracking-wide text-primary">
                                {data.header.eyebrow}
                            </h6>
                            <h2 className="mt-2 text-3xl md:text-4xl font-bold leading-snug">
                                {data.header.title}
                            </h2>
                            <p className="mt-4 text-muted-foreground">
                                {data.header.description}
                            </p>
                        </div>

                        {/* Progress bars */}
                        <div className="space-y-5 mb-10">
                            {data.skills.map((skill, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-1 text-sm font-medium">
                                        <span>{skill.label}</span>
                                        <span>
                                            {skill.value}
                                            {skill.suffix}
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className="h-full bg-primary"
                                            style={{ width: `${skill.value}${skill.suffix}` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Download */}
                        <div className="flex items-center gap-4 border rounded-xl p-4">
                            <div className="text-primary text-2xl">📄</div>
                            <div>
                                <a
                                    href={data.download.url}
                                    className="text-sm font-semibold hover:underline"
                                >
                                    {data.download.label}
                                </a>
                                <p className="text-sm text-muted-foreground">
                                    {data.download.title}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
