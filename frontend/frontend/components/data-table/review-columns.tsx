"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CompanyReview } from "@/types/review"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import api from "@/lib/axios"
import { useState } from "react"
import { MediaCell } from "./mediaCell"

/* ---------------- Reply Cell ---------------- */

function ReplyCell({ review }: { review: CompanyReview }) {
    const [body, setBody] = useState(review.reply?.body ?? "")
    const [loading, setLoading] = useState(false)

    async function onSave() {
        if (!body.trim()) return

        setLoading(true)
        try {
            await api.post(`/api/review/${review.id}/reply/`, { body })
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

/* ---------------- Columns ---------------- */

export const reviewColumns = (
    onStatusChange: (id: number, approved: boolean) => void
): ColumnDef<CompanyReview>[] => [
    {
        accessorKey: "author_name",
        header: "User",
        cell: ({ row }) => (
            <div className="font-medium">
                {row.original.author_name || "Anonymous"}
            </div>
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
            <MediaCell media={row.original.media} />
        ),
    },
    {
        accessorKey: "is_approved",
        header: "Status",
        cell: ({ row }) => (
            <Badge
                variant={
                    row.original.is_approved
                        ? "secondary"
                        : "outline"
                }
            >
                {row.original.is_approved ? "Approved" : "Pending"}
            </Badge>
        ),
    },
    {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }) =>
            new Date(row.original.created_at).toLocaleDateString(),
    },
    {
        id: "reply",
        header: "Reply",
        cell: ({ row }) => (
            <ReplyCell review={row.original} />
        ),
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            const review = row.original

            async function handle() {
                if (review.is_approved) {
                    await api.patch(`/api/review/${review.id}/reject/`)
                    onStatusChange(review.id, false)
                } else {
                    await api.patch(`/api/review/${review.id}/approve/`)
                    onStatusChange(review.id, true)
                }
            }

            return (
                <Button
                    size="sm"
                    variant={
                        review.is_approved ? "destructive" : "default"
                    }
                    onClick={handle}
                >
                    {review.is_approved ? "Unapprove" : "Approve"}
                </Button>
            )
        },
    },
]
