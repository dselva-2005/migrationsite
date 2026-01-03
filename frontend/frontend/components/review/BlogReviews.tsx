"use client"

import { useEffect, useState } from "react"
import { Review } from "@/types/review"
import { getBlogReviews } from "@/services/review"
import { AddReviewModal } from "./AddReviewModal"

type Props = {
    slug: string
}

export function BlogReviews({ slug }: Props) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    /* ---------------- Fetch reviews on slug change ---------------- */

    useEffect(() => {
        let cancelled = false

        async function fetchReviews() {
            try {
                setLoading(true)
                const data = await getBlogReviews(slug)

                if (!cancelled) {
                    // show only top 4 reviews
                    setReviews(data.results.slice(0, 4))
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        fetchReviews()

        return () => {
            cancelled = true
        }
    }, [slug])

    /* ---------------- Revalidate after adding review ---------------- */

    async function reloadReviews() {
        const data = await getBlogReviews(slug)
        setReviews(data.results.slice(0, 4))
    }

    /* ---------------- UI ---------------- */

    return (
        <aside className="space-y-4 sticky top-24">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">Reviews</h3>

                <button
                    onClick={() => setOpen(true)}
                    className="text-sm text-primary hover:underline"
                >
                    Add review
                </button>
            </div>

            {loading && (
                <p className="text-sm text-muted-foreground">
                    Loading reviews...
                </p>
            )}

            {!loading && reviews.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    No reviews yet
                </p>
            )}

            {!loading &&
                reviews.map((r) => (
                    <div
                        key={r.id}
                        className="border rounded-lg p-3 space-y-1"
                    >
                        <div className="font-medium">{r.title}</div>

                        <p className="text-sm text-muted-foreground">
                            {r.body}
                        </p>

                        <div className="text-xs text-muted-foreground">
                            {r.author} ·{" "}
                            {new Date(r.created_at).toLocaleDateString()}
                        </div>
                    </div>
                ))}

            {open && (
                <AddReviewModal
                    slug={slug}
                    onClose={() => setOpen(false)}
                    onSuccess={() => {
                        reloadReviews()
                        setOpen(false)
                    }}
                />
            )}
        </aside>
    )
}
