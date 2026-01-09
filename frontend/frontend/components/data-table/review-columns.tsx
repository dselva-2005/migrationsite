"use client"

import { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { useState } from "react"

import {
    CompanyReview,
    ReviewModerationStatus,
} from "@/types/review"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import api from "@/lib/axios"
import { MediaCell } from "./mediaCell"

/* ============================================================
   Helpers
============================================================ */

function statusBadgeVariant(status: ReviewModerationStatus) {
    switch (status) {
        case "approved":
            return "secondary"
        case "rejected":
            return "destructive"
        default:
            return "outline"
    }
}

function statusLabel(status: ReviewModerationStatus) {
    switch (status) {
        case "approved":
            return "Approved"
        case "rejected":
            return "Rejected"
        default:
            return "Pending"
    }
}

/* ============================================================
   Rating Cell
============================================================ */

function RatingCell({ rating }: { rating: number }) {
    return (
        <div className="font-medium text-sm">
            {rating} / 5
        </div>
    )
}

/* ============================================================
   Reply Cell
============================================================ */

function ReplyCell({
    review,
    onUpdated,
}: {
    review: CompanyReview
    onUpdated: () => void
}) {
    const [body, setBody] = useState(
        review.reply?.body ?? ""
    )
    const [loading, setLoading] = useState(false)

    async function onSave() {
        if (!body.trim() || loading) return

        setLoading(true)
        try {
            await api.post(
                `/api/review/${review.id}/reply/`,
                { body }
            )
            toast.success("Reply saved")
            onUpdated()
        } catch {
            toast.error("Failed to save reply")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-2 max-w-md">
            <Textarea
                placeholder="Reply as company..."
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={3}
            />

            <Button
                size="sm"
                onClick={onSave}
                disabled={loading || !body.trim()}
            >
                {review.reply ? "Update Reply" : "Reply"}
            </Button>
        </div>
    )
}

/* ============================================================
   Actions Cell
============================================================ */

function ReviewActions({
    review,
    onUpdated,
}: {
    review: CompanyReview
    onUpdated: () => void
}) {
    const [loading, setLoading] = useState(false)

    async function mutate(
        action: "approve" | "reject"
    ) {
        if (loading) return

        setLoading(true)
        try {
            await api.patch(
                `/api/review/${review.id}/${action}/`
            )
            toast.success(
                action === "approve"
                    ? "Review approved"
                    : "Review rejected"
            )
            onUpdated()
        } catch {
            toast.error("Action failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex gap-2">
            <Button
                size="sm"
                disabled={
                    loading ||
                    review.moderation_status ===
                        "approved"
                }
                onClick={() => mutate("approve")}
            >
                Approve
            </Button>

            <Button
                size="sm"
                variant="destructive"
                disabled={
                    loading ||
                    review.moderation_status ===
                        "rejected"
                }
                onClick={() => mutate("reject")}
            >
                Reject
            </Button>
        </div>
    )
}

/* ============================================================
   Column Factory
============================================================ */

export function reviewColumns(
    onRowUpdated: () => void
): ColumnDef<CompanyReview>[] {
    return [
        {
            accessorKey: "author_name",
            header: "User",
            cell: ({ row }) => (
                <div className="font-medium">
                    {row.original.author_name ||
                        "Anonymous"}
                </div>
            ),
        },

        // ⭐ RATING (FIXED)
        {
            accessorKey: "rating",
            header: "Rating",
            cell: ({ row }) => (
                <RatingCell
                    rating={row.original.rating}
                />
            ),
        },

        {
            accessorKey: "body",
            header: "Review",
            cell: ({ row }) => (
                <div className="max-w-xl whitespace-pre-wrap text-sm">
                    {row.original.body}
                </div>
            ),
        },

        {
            id: "media",
            header: "Media",
            cell: ({ row }) => (
                <MediaCell
                    media={row.original.media}
                />
            ),
        },

        {
            accessorKey: "moderation_status",
            header: "Status",
            cell: ({ row }) => (
                <Badge
                    variant={statusBadgeVariant(
                        row.original.moderation_status
                    )}
                >
                    {statusLabel(
                        row.original.moderation_status
                    )}
                </Badge>
            ),
        },

        {
            accessorKey: "created_at",
            header: "Date",
            cell: ({ row }) =>
                new Date(
                    row.original.created_at
                ).toLocaleDateString(),
        },

        {
            id: "reply",
            header: "Reply",
            cell: ({ row }) => (
                <ReplyCell
                    review={row.original}
                    onUpdated={onRowUpdated}
                />
            ),
        },

        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <ReviewActions
                    review={row.original}
                    onUpdated={onRowUpdated}
                />
            ),
        },
    ]
}
