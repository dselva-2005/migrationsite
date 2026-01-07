"use client"

import { useState } from "react"
import Image from "next/image"
import clsx from "clsx"
import { Star, X } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

import { Company } from "@/types/company"
import { useAuth } from "@/providers/AuthProvider"
import {
    createCompanyReview,
    uploadReviewMedia,
} from "@/services/review"

type Props = {
    open: boolean
    onClose: () => void
    company: Company
}

const MAX_MEDIA = 5

export function ReviewModal({ open, onClose, company }: Props) {
    const { isLoggedIn, loading } = useAuth()

    const [rating, setRating] = useState(0)
    const [body, setBody] = useState("")
    const [media, setMedia] = useState<File[]>([])
    const [submitting, setSubmitting] = useState(false)

    const onMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])

        if (media.length + files.length > MAX_MEDIA) {
            toast.warning("Media limit reached", {
                description: "You can upload up to 5 files only.",
            })
            return
        }

        setMedia((prev) => [...prev, ...files])
    }

    const removeMedia = (index: number) => {
        setMedia((prev) => prev.filter((_, i) => i !== index))
    }

    const submitReview = async () => {
        if (!isLoggedIn) {
            window.location.href = "/login"
            return
        }

        try {
            setSubmitting(true)

            const reviewData = new FormData()
            reviewData.append("rating", rating.toString())
            reviewData.append("body", body)

            const review = await createCompanyReview(
                company.slug,
                reviewData
            )

            for (const file of media) {
                await uploadReviewMedia(review.id, file)
            }

            toast.success("Review submitted 🎉", {
                description: "Thank you for sharing your experience.",
            })

            setRating(0)
            setBody("")
            setMedia([])
            onClose()
        } catch (err) {
            console.error(err)

            toast.error("Submission failed", {
                description: "Something went wrong. Please try again.",
            })
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
                                unoptimized
                            />
                        ) : (
                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs">
                                Logo
                            </div>
                        )}
                        <span>Review {company.name}</span>
                    </DialogTitle>
                </DialogHeader>

                {/* Rating */}
                <div className="flex justify-center gap-1 py-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            size={30}
                            onClick={() => setRating(i + 1)}
                            className={clsx(
                                "cursor-pointer",
                                i < rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                            )}
                        />
                    ))}
                </div>

                {/* Body */}
                <Textarea
                    placeholder="Share your experience..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="min-h-[120px]"
                />

                {/* Media */}
                <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={onMediaChange}
                    disabled={media.length >= MAX_MEDIA}
                />

                {media.length > 0 && (
                    <div className="grid grid-cols-5 gap-2">
                        {media.map((file, i) => (
                            <div key={i} className="relative">
                                {file.type.startsWith("image") ? (
                                    <img
                                        src={URL.createObjectURL(file)}
                                        className="h-16 w-full object-cover rounded"
                                    />
                                ) : (
                                    <video
                                        src={URL.createObjectURL(file)}
                                        className="h-16 w-full object-cover rounded"
                                    />
                                )}
                                <button
                                    onClick={() => removeMedia(i)}
                                    className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

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
            </DialogContent>
        </Dialog>
    )
}
