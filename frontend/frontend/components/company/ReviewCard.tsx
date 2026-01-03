"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { TrustpilotRating } from "@/components/TrustpilotRating"
import { Review } from "@/types/review"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import Image from "next/image"

function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .map(n => n[0].toUpperCase())
        .join("")
        .slice(0, 2)
}

export function ReviewCard({ review }: { review: Review }) {
    const formattedDate = new Date(review.created_at).toLocaleDateString()

    return (
        <Dialog>
            {/* ================= CARD ================= */}
            <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md p-3">
                    <div className="flex justify-between">
                        <div className="flex gap-3">
                            {/* Avatar */}
                            <div className="h-9 w-9 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center font-semibold text-xs">
                                {review.author_profile_image_url ? (
                                    <Image
                                        src={review.author_profile_image_url}
                                        alt={review.author}
                                        width={36}
                                        height={36}
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    getInitials(review.author)
                                )}
                            </div>

                            <div className="leading-tight">
                                <div className="font-semibold text-sm">
                                    {review.author}
                                </div>
                                <TrustpilotRating
                                    rating={review.rating}
                                    starsize={13}
                                />
                            </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                            {formattedDate}
                        </div>
                    </div>

                    {/* Review body — closer to username */}
                    <CardContent className="p-0 text-sm leading-snug">
                        {review.body}
                    </CardContent>

                    {/* ✅ Company reply (no date, compact) */}
                    {review.reply && (
                        <div className="mt-2 border-l-2 border-primary pl-2">
                            <p className="text-xs font-semibold text-primary">
                                Company response
                            </p>
                            <p className="text-xs text-muted-foreground leading-snug">
                                {review.reply.body}
                            </p>
                        </div>
                    )}
                </Card>
            </DialogTrigger>

            {/* ================= MODAL ================= */}
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        <VisuallyHidden>
                            Review by {review.author}
                        </VisuallyHidden>
                    </DialogTitle>

                    {/* User info */}
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center font-semibold text-sm">
                            {review.author_profile_image_url ? (
                                <Image
                                    src={review.author_profile_image_url}
                                    alt={review.author}
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                getInitials(review.author)
                            )}
                        </div>

                        <div>
                            <p className="font-semibold text-sm">
                                {review.author}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formattedDate}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                {/* ---------- REVIEW CONTENT ---------- */}
                <div className="space-y-3 mt-4">
                    <TrustpilotRating rating={review.rating} starsize={16} />
                    <p className="text-sm leading-relaxed">
                        {review.body}
                    </p>
                </div>

                {/* ---------- SPACING BETWEEN REVIEW & REPLY ---------- */}
                {review.reply && (
                    <div className="mt-6 pt-4 border-t space-y-2">
                        <p className="text-xs font-semibold text-primary">
                            Company response
                        </p>

                        <p className="text-sm text-muted-foreground">
                            {review.reply.body}
                        </p>

                        <p className="text-xs text-muted-foreground">
                            {new Date(
                                review.reply.created_at
                            ).toLocaleDateString()}
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
