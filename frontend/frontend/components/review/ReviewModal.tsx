"use client"

import { useEffect, useState } from "react"
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
import { useAuth } from "@/providers/AuthProvider"
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
    const { isLoggedIn, loading } = useAuth()

    const isEditMode = review !== null

    const [rating, setRating] = useState<number>(0)
    const [body, setBody] = useState<string>("")

    // 🔹 existing media from backend
    const [existingMedia, setExistingMedia] = useState<
        ReviewMedia[]
    >([])

    // 🔹 ids to delete
    const [deleteMediaIds, setDeleteMediaIds] = useState<
        number[]
    >([])

    // 🔹 newly added files
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

    const onMediaChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(e.target.files ?? [])

        const totalCount =
            existingMedia.length +
            newMedia.length +
            files.length

        if (totalCount > MAX_MEDIA) {
            toast.warning("Media limit reached", {
                description: "You can upload up to 5 files only.",
            })
            return
        }

        setNewMedia((prev) => [...prev, ...files])
    }

    const removeExistingMedia = (mediaId: number) => {
        setExistingMedia((prev) =>
            prev.filter((m) => m.id !== mediaId)
        )
        setDeleteMediaIds((prev) => [...prev, mediaId])
    }

    const removeNewMedia = (index: number) => {
        setNewMedia((prev) =>
            prev.filter((_, i) => i !== index)
        )
    }

    /* ---------------- Submit ---------------- */

    const submitReview = async () => {
        if (!isLoggedIn) {
            window.location.href = "/login"
            return
        }

        try {
            setSubmitting(true)

            const formData = new FormData()
            formData.append("rating", rating.toString())
            formData.append("body", body)

            // 🔹 send delete ids
            deleteMediaIds.forEach((id) =>
                formData.append("delete_media_ids", id.toString())
            )

            let savedReview: Review

            if (isEditMode) {
                savedReview = await updateCompanyReview(
                    company.slug,
                    formData
                )
            } else {
                savedReview = await createCompanyReview(
                    company.slug,
                    formData
                )
            }

            // 🔹 upload new media
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
                        <span>
                            {isEditMode
                                ? "Edit your review"
                                : `Review ${company.name}`}
                        </span>
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
                            <div key={i} className="relative">
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
