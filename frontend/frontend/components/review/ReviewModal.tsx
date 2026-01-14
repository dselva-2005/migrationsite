"use client"

import { useEffect, useState, useCallback } from "react"
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
import { Review, ReviewMedia } from "@/types/review"
import {
    createCompanyReview,
    updateCompanyReview,
    uploadReviewMedia,
} from "@/services/review"

type Props = {
    open: boolean
    onClose: () => void
    company: Company
    review: Review | null
}

const MAX_MEDIA = 5

export function ReviewModal({
    open,
    onClose,
    company,
    review,
}: Props) {
    const isEditMode = review !== null

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-700 border-green-200"
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200"
            case "rejected":
                return "bg-red-100 text-red-700 border-red-200"
            default:
                return "bg-muted text-muted-foreground border-border"
        }
    }

    const [rating, setRating] = useState(0)
    const [body, setBody] = useState("")

    const [existingMedia, setExistingMedia] = useState<
        ReviewMedia[]
    >([])
    const [deleteMediaIds, setDeleteMediaIds] = useState<
        number[]
    >([])
    const [newMedia, setNewMedia] = useState<File[]>([])

    const [submitting, setSubmitting] = useState(false)

    /* ---------------- Prefill ---------------- */

    useEffect(() => {
        if (!open) return

        if (review) {
            setRating(review.rating)
            setBody(review.body)
            setExistingMedia(review.media ?? [])
        } else {
            setRating(0)
            setBody("")
            setExistingMedia([])
        }

        setDeleteMediaIds([])
        setNewMedia([])
    }, [open, review])

    /* ---------------- Media handlers ---------------- */

    const onMediaChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files ?? [])

            const totalCount =
                existingMedia.length +
                newMedia.length +
                files.length

            if (totalCount > MAX_MEDIA) {
                toast.warning("Media limit reached", {
                    description:
                        "You can upload up to 5 files only.",
                })
                return
            }

            setNewMedia((prev) => [...prev, ...files])
        },
        [existingMedia.length, newMedia.length]
    )

    const removeExistingMedia = useCallback((mediaId: number) => {
        setExistingMedia((prev) =>
            prev.filter((m) => m.id !== mediaId)
        )
        setDeleteMediaIds((prev) => [...prev, mediaId])
    }, [])

    const removeNewMedia = useCallback((index: number) => {
        setNewMedia((prev) =>
            prev.filter((_, i) => i !== index)
        )
    }, [])

    /* ---------------- Submit ---------------- */

    const submitReview = useCallback(async () => {
        try {
            setSubmitting(true)

            const formData = new FormData()
            formData.append("rating", rating.toString())
            formData.append("body", body)

            deleteMediaIds.forEach((id) =>
                formData.append(
                    "delete_media_ids",
                    id.toString()
                )
            )

            const savedReview = isEditMode
                ? await updateCompanyReview(
                    company.slug,
                    formData
                )
                : await createCompanyReview(
                    company.slug,
                    formData
                )

            for (const file of newMedia) {
                await uploadReviewMedia(savedReview.id, file)
            }

            toast.success(
                isEditMode
                    ? "Review updated ✨"
                    : "Review submitted 🎉"
            )

            onClose()
        } catch (err) {
            console.error(err)
            toast.error("Submission failed", {
                description:
                    "Something went wrong. Please try again.",
            })
        } finally {
            setSubmitting(false)
        }
    }, [
        rating,
        body,
        deleteMediaIds,
        newMedia,
        isEditMode,
        company.slug,
        onClose,
    ])

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-4">
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
                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                Logo
                            </div>
                        )}

                        <div className="flex flex-col">
                            <span className="text-base font-semibold leading-tight">
                                {isEditMode ? "Edit your review" : `Review ${company.name}`}
                            </span>

                            {review?.moderation_status && (
                                <span
                                    className={`mt-1 inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusBadge(
                                        review.moderation_status
                                    )}`}
                                >
                                    {review.moderation_status}
                                </span>
                            )}
                        </div>
                    </DialogTitle>
                </DialogHeader>


                {/* Rating */}
                <div className="flex justify-center gap-1 py-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            size={30}
                            onClick={() =>
                                setRating(i + 1)
                            }
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
                    onChange={(e) =>
                        setBody(e.target.value)
                    }
                    className="min-h-[120px]"
                />

                {/* Media input */}
                <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={onMediaChange}
                />

                {/* Existing media */}
                {existingMedia.length > 0 && (
                    <div className="grid grid-cols-5 gap-2">
                        {existingMedia.map((m) => (
                            <div
                                key={m.id}
                                className="relative"
                            >
                                {m.media_type ===
                                    "image" ? (
                                    <img
                                        src={m.url}
                                        className="h-16 w-full object-cover rounded"
                                    />
                                ) : (
                                    <video
                                        src={m.url}
                                        className="h-16 w-full object-cover rounded"
                                    />
                                )}
                                <button
                                    type="button"
                                    onClick={() =>
                                        removeExistingMedia(
                                            m.id
                                        )
                                    }
                                    className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* New media */}
                {newMedia.length > 0 && (
                    <div className="grid grid-cols-5 gap-2">
                        {newMedia.map((file, i) => (
                            <div
                                key={i}
                                className="relative"
                            >
                                {file.type.startsWith(
                                    "image"
                                ) ? (
                                    <img
                                        src={URL.createObjectURL(
                                            file
                                        )}
                                        className="h-16 w-full object-cover rounded"
                                    />
                                ) : (
                                    <video
                                        src={URL.createObjectURL(
                                            file
                                        )}
                                        className="h-16 w-full object-cover rounded"
                                    />
                                )}
                                <button
                                    type="button"
                                    onClick={() =>
                                        removeNewMedia(i)
                                    }
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
                    {submitting
                        ? "Saving..."
                        : isEditMode
                            ? "Update review"
                            : "Submit review"}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
