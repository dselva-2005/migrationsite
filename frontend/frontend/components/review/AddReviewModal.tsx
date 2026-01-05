"use client"

import { useState } from "react"
import { createBlogReview } from "@/services/review"

type Props = {
    slug: string
    onClose: () => void
    onSuccess: () => void
}

export function AddReviewModal({ slug, onClose, onSuccess }: Props) {
    const [rating, setRating] = useState(5)
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit() {
        if (!body.trim()) {
            alert("Review body cannot be empty")
            return
        }

        const formData = new FormData()
        formData.append("rating", rating.toString())
        formData.append("title", title)
        formData.append("body", body)

        setLoading(true)
        try {
            await createBlogReview(slug, formData)
            onSuccess()
            onClose()
        } catch (err) {
            console.error(err)
            alert("Failed to submit review")
        } finally {
            setLoading(false)
        }
    }

    const StarInput = () => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                >
                    ★
                </button>
            ))}
        </div>
    )

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-background rounded-xl p-6 w-full max-w-md space-y-4">
                <h3 className="text-lg font-semibold">Add Review</h3>

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <span className="text-sm">Rating:</span>
                    <StarInput />
                </div>

                {/* Title */}
                <input
                    className="w-full border rounded-md p-2"
                    placeholder="Title (optional)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                />

                {/* Body */}
                <textarea
                    className="w-full border rounded-md p-2 min-h-[100px]"
                    placeholder="Your review"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    disabled={loading}
                />

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 border rounded-md py-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 bg-primary text-white rounded-md py-2"
                    >
                        {loading ? "Posting..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    )
}
