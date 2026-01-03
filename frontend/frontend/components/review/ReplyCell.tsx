"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { replyToReview } from "@/services/review"
import { DashboardReview } from "@/types/review"

export function ReplyCell({ review }: { review: DashboardReview }) {
    const [body, setBody] = useState(review.reply?.body ?? "")
    const [loading, setLoading] = useState(false)

    async function onSave() {
        setLoading(true)
        try {
            await replyToReview(review.id, body)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-2">
            <Textarea
                placeholder="Reply to this review..."
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={3}
            />

            <Button
                size="sm"
                onClick={onSave}
                disabled={!body || loading}
            >
                {review.reply ? "Update Reply" : "Reply"}
            </Button>
        </div>
    )
}
