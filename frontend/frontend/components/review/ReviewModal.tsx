"use client"

import { useState } from "react"
import Image from "next/image"
import clsx from "clsx"
import { Star } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { Company } from "@/types/company"
import { useAuth } from "@/providers/AuthProvider"
import { createCompanyReview } from "@/services/review"

type Props = {
    open: boolean
    onClose: () => void
    company: Company
}

export function ReviewModal({ open, onClose, company }: Props) {
    const { isLoggedIn, loading } = useAuth()

    const [rating, setRating] = useState<number>(0)
    const [body, setBody] = useState<string>("")
    const [submitting, setSubmitting] = useState<boolean>(false)

    const submitReview = async (): Promise<void> => {
        if (!isLoggedIn) {
            window.location.href = "/login"
            return
        }

        try {
            setSubmitting(true)

            await createCompanyReview(company.slug, {
                rating,
                body,
            })

            setRating(0)
            setBody("")
            onClose()
        } catch {
            alert("Failed to submit review")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return null

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        {company.logo ? (
                            <Image
                                src={company.logo}
                                alt={company.name}
                                width={40}
                                height={40}
                                className="rounded object-contain"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs">
                                Logo
                            </div>
                        )}
                        <span>Review {company.name}</span>
                    </DialogTitle>
                </DialogHeader>

                {!isLoggedIn ? (
                    <div className="text-center space-y-4">
                        <p className="text-muted-foreground">
                            You must be logged in to write a review.
                        </p>
                        <Button asChild>
                            <a href="/login">Login</a>
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Rating */}
                        <div className="flex justify-center gap-1 py-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    size={30}
                                    onClick={() => setRating(i + 1)}
                                    className={clsx(
                                        "cursor-pointer transition",
                                        i < rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-muted-foreground"
                                    )}
                                />
                            ))}
                        </div>

                        {/* Review body */}
                        <Textarea
                            placeholder="Share your experience..."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="min-h-[120px]"
                        />

                        {/* Submit */}
                        <Button
                            onClick={submitReview}
                            disabled={
                                submitting ||
                                rating === 0 ||
                                body.trim().length < 10
                            }
                            className="w-full"
                        >
                            {submitting ? "Submitting..." : "Submit review"}
                        </Button>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
