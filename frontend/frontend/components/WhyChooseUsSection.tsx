"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

type Feature = {
    title: string
    description: string
    icon: string
    href: string
}

const FEATURES: Feature[] = [
    {
        title: "Direct Interviews",
        description: "Expound actual teachings to the great explorers of truth.",
        icon: "https://migrationreviews.com/1123/wp-content/uploads/2022/03/job-interview-1.svg",
        href: "/about",
    },
    {
        title: "Faster Processing",
        description: "Give you a complete account of the system and procedures.",
        icon: "https://migrationreviews.com/1123/wp-content/uploads/2022/03/worldwide-1.svg",
        href: "/about",
    },
    {
        title: "Visa Assistance",
        description: "Professional visa guidance for individuals and businesses.",
        icon: "https://migrationreviews.com/1123/wp-content/uploads/2022/03/video-call-1.svg",
        href: "/about",
    },
    {
        title: "Cost-Effective",
        description: "Affordable solutions without compromising service quality.",
        icon: "https://migrationreviews.com/1123/wp-content/uploads/2022/03/receipt-1.svg",
        href: "/about",
    },
]

export default function WhyChooseUsSection() {
    return (
        <section className="py-2">
            <div className="mx-auto max-w-7xl px-4">
                {/* Section Title */}
                <div className="mb-14 text-center">
                    <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary/80">
                        Why Choose Us
                    </p>

                    <h2 className="mx-auto max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                        Offer Tailor-Made Services That{" "}
                        <span className="text-primary">Our Clients Require</span>
                    </h2>
                </div>

                {/* Cards */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {FEATURES.map((item) => (
                        <Card
                            key={item.title}
                            className="group h-full rounded-2xl border-0 transition"
                        >
                            <CardContent className="flex h-full flex-col p-6 text-center">
                                {/* Icon */}
                                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl">
                                    <Image
                                        src={item.icon}
                                        alt={item.title}
                                        width={32}
                                        height={32}
                                    />
                                </div>

                                <h4 className="text-lg font-semibold">{item.title}</h4>

                                <p className="mt-2 text-sm line-clamp-3">
                                    {item.description}
                                </p>

                                <div className="mt-auto pt-4">
                                    <Link
                                        href={item.href}
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        Read More →
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
