"use client"

import { use, useEffect, useState } from "react"
import {
    getCompanyAccountBySlug,
    updateCompanyAccountCache,
} from "@/services/CompanyAccount"
import { CompanyAccount } from "@/types/company"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Section } from "@/components/Section"

import { DataTable } from "@/components/data-table/DataTable"
import { reviewColumns } from "@/components/data-table/review-columns"

export default function CompanyAccountPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = use(params)

    const [company, setCompany] = useState<CompanyAccount | null>(null)
    const [loading, setLoading] = useState(true)

    /* ---------------- Fetch company account ---------------- */
    useEffect(() => {
        let alive = true

        ;(async () => {
            setLoading(true)
            const account = await getCompanyAccountBySlug(slug)
            if (alive) setCompany(account)
            setLoading(false)
        })()

        return () => {
            alive = false
        }
    }, [slug])

    /* ---------------- BULK ACTION ---------------- */
async function bulkAction(
    ids: number[],
    action: "approve" | "reject"
) {
    if (!ids.length || !company) return

    // optimistic UI: update cache first
    const optimisticUpdates = ids.map(id => ({
        id,
        is_approved: action === "approve",
        rating:
            company.reviews.find(r => r.id === id)?.rating || 0,
    }))

    // fallback to null if undefined
    const updatedAccount = updateCompanyAccountCache(slug, optimisticUpdates) ?? null
    setCompany(updatedAccount)

    // call backend
    await fetch("/api/review/bulk-action/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids, action }),
    })
}


    if (loading || !company) return <Skeleton className="h-64 w-full" />

    /* ---------------- UI ---------------- */
    return (
        <Section>
            {/* Company header */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{company.name}</CardTitle>

                    {company.is_verified && (
                        <Badge variant="secondary">Verified</Badge>
                    )}
                </CardHeader>

                <CardContent className="text-sm text-muted-foreground">
                    ⭐ {company.rating_average} · {company.rating_count} reviews
                </CardContent>
            </Card>

            {/* Reviews table */}
            <Card>
                <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>

                <CardContent>
                    <DataTable
                        data={company.reviews}
                        columns={reviewColumns(
                            (id, approved) => {
                                // single row update
                                bulkAction([id], approved ? "approve" : "reject")
                            }
                        )}
                        onBulkApprove={ids => bulkAction(ids, "approve")}
                        onBulkReject={ids => bulkAction(ids, "reject")}
                    />
                </CardContent>
            </Card>
        </Section>
    )
}
