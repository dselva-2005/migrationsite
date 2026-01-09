"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Company } from "@/types/company"
import { Review } from "@/types/review"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TrustpilotRating } from "../TrustpilotRating"
import { ReviewModal } from "@/components/review/ReviewModal"
import { useAuth } from "@/providers/AuthProvider"

type Props = {
    company: Company
    myReview: Review | null
}

export function CompanyHeader({ company, myReview }: Props) {
    const [open, setOpen] = useState(false)
    const { isLoggedIn, loading } = useAuth()
    const router = useRouter()

    const handleReviewAction = () => {
        if (loading) return

        if (!isLoggedIn) {
            router.push("/login")
            return
        }

        setOpen(true)
    }

    const reviewButtonLabel = myReview
        ? "Edit your review"
        : "Write a review"

    return (
        <>
            <section className="flex flex-col gap-6">
                <div className="flex items-start gap-6">
                    {/* Logo */}
                    {company.logo ? (
                        <Link href={company.website} target="_blank">
                            <Image
                                src={company.logo}
                                alt={`${company.name} logo`}
                                width={120}
                                height={90}
                                className="rounded-md object-contain"
                                unoptimized
                            />
                        </Link>
                    ) : (
                        <div className="w-[120px] h-[90px] bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">
                            No logo
                        </div>
                    )}

                    {/* Meta */}
                    <div className="flex flex-col gap-2 flex-1">
                        <h1 className="text-3xl font-bold">
                            {company.name}{" "}
                            <span className="text-muted-foreground text-lg font-normal">
                                ({company.rating_count} reviews)
                            </span>
                        </h1>

                        <TrustpilotRating
                            rating={Number(company.rating_average)}
                            reviewCount={company.rating_count}
                            starsize={22}
                            ratingFontWeight="text-xl font-bold"
                        />

                        {company.tagline && (
                            <p className="text-muted-foreground">
                                {company.tagline}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex gap-3">
                        <Button onClick={handleReviewAction}>
                            {reviewButtonLabel}
                        </Button>

                        <Button variant="outline" asChild>
                            <Link
                                href={company.website}
                                target="_blank"
                            >
                                Visit website
                            </Link>
                        </Button>
                    </div>
                </div>

                <Separator />
            </section>

            <ReviewModal
                open={open}
                onClose={() => setOpen(false)}
                company={company}
                review={myReview}
            />
        </>
    )
}
