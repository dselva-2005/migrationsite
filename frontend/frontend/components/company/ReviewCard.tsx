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
import { ImageIcon } from "lucide-react"

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

    const media = review.media ?? []
    const mediaCount = media.length
    const hasMedia = mediaCount > 0

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md p-3 space-y-2">
                    {/* Header */}
                    <div className="flex justify-between items-start">
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

                        {/* Date + Media count */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
                            {hasMedia && (
                                <span className="flex items-center gap-1">
                                    <ImageIcon size={14} />
                                    {mediaCount}
                                </span>
                            )}
                            <span>{formattedDate}</span>
                        </div>
                    </div>

                    {/* Review body */}
                    <CardContent className="p-0 text-sm leading-snug">
                        {review.body}
                    </CardContent>

                    {/* Company reply (CARD) */}
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
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        <VisuallyHidden>
                            Review by {review.author}
                        </VisuallyHidden>
                    </DialogTitle>

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

                {/* Review */}
                <div className="space-y-3 mt-4">
                    <TrustpilotRating rating={review.rating} starsize={16} />
                    <p className="text-sm leading-relaxed">
                        {review.body}
                    </p>
                </div>

                {/* Media */}
                {hasMedia && (
                    <div className="mt-6 space-y-3">
                        <p className="text-xs font-semibold text-muted-foreground">
                            Media
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            {media.map(m => (
                                <div
                                    key={m.id}
                                    className="rounded-md overflow-hidden border bg-black"
                                >
                                    {m.media_type === "image" ? (
                                        <Image
                                            src={m.url}
                                            alt="Review media"
                                            width={600}
                                            height={600}
                                            className="object-cover w-full h-full"
                                            unoptimized
                                        />
                                    ) : (
                                        <video
                                            src={m.url}
                                            controls
                                            className="w-full h-full max-h-[320px]"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Company reply */}
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
