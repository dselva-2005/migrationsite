"use client"

import Image from "next/image"
import Link from "next/link"

import { Company } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TrustpilotRating } from "../TrustpilotRating"
type Props = {
    company: Company
}

export function CompanyHeader({ company }: Props) {
    return (
        <section className="flex flex-col gap-6">
            {/* Top Row */}
            <div className="flex items-start gap-6">
                {/* Logo */}
                <Link href={company.websiteUrl} target="_blank">
                    <Image
                        src={company.logoUrl}
                        alt={`${company.name} logo`}
                        width={120}
                        height={90}
                        className="rounded-md border-0"
                    />
                </Link>

                {/* Company Meta */}
                <div className="flex flex-col gap-2 flex-1">
                    <h1 className="text-3xl font-bold">
                        {company.name}{" "}
                        <span className="text-muted-foreground text-lg font-normal">
                            Reviews {company.totalReviews}
                        </span>
                    </h1>
                    <TrustpilotRating
                        rating={company.rating}
                        reviewCount={company.totalReviews}
                        starsize={22}
                    />
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex gap-3">
                    <Button asChild>
                        <Link href={`/evaluate/${company.slug}`}>Write a review</Link>
                    </Button>

                    <Button variant="outline" asChild>
                        <Link href={company.websiteUrl} target="_blank">
                            Visit website
                        </Link>
                    </Button>
                </div>
            </div>

            <Separator />
        </section>
    )
}
