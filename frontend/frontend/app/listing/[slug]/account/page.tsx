"use client"

import { use, useEffect, useState } from "react"

import {
    getCompanyAccountBySlug,
    updateCompanyAccountCache,
} from "@/services/CompanyAccount"

import api from "@/lib/axios"

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
import Image from "next/image"
import { DataTable } from "@/components/data-table/DataTable"
import { reviewColumns } from "@/components/data-table/review-columns"

/* ------------------------------------------------------------------ */
/* Logo upload helper */
/* ------------------------------------------------------------------ */
async function updateCompanyLogo(
    slug: string,
    file: File
): Promise<string> {
    const formData = new FormData()
    formData.append("logo", file)

    const res = await api.patch(
        `/api/company/${slug}/logo/`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    )

    return res.data.logo
}

/* ------------------------------------------------------------------ */

export default function CompanyAccountPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = use(params)

    const [company, setCompany] =
        useState<CompanyAccount | null>(null)
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)

    /* ---------------- Fetch company account ---------------- */
    useEffect(() => {
        let alive = true

            ; (async () => {
                setLoading(true)
                try {
                    const account =
                        await getCompanyAccountBySlug(slug)
                    if (alive) setCompany(account)
                } finally {
                    setLoading(false)
                }
            })()

        return () => {
            alive = false
        }
    }, [slug])

    /* ---------------- Logo update ---------------- */
    async function onLogoChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        if (!e.target.files || !company) return

        const file = e.target.files[0]
        if (!file) return

        /* optimistic preview */
        const previewUrl = URL.createObjectURL(file)

        setCompany({
            ...company,
            logo: previewUrl,
        })

        try {
            setUploading(true)
            const logoUrl = await updateCompanyLogo(
                slug,
                file
            )

            setCompany(prev =>
                prev
                    ? {
                        ...prev,
                        logo: logoUrl,
                    }
                    : prev
            )
        } catch (err) {
            console.error("Logo update failed", err)
        } finally {
            setUploading(false)
        }
    }

    /* ---------------- BULK ACTION (approve / reject) ---------------- */
    async function bulkAction(
        ids: number[],
        action: "approve" | "reject"
    ) {
        if (!ids.length || !company) return

        /* ---------- optimistic UI ---------- */
        const optimisticUpdates = ids.map(id => ({
            id,
            is_approved: action === "approve",
            rating:
                company.reviews.find(r => r.id === id)
                    ?.rating ?? 0,
        }))

        const optimisticCompany =
            updateCompanyAccountCache(
                slug,
                optimisticUpdates
            ) ?? null

        setCompany(optimisticCompany)

        /* ---------- backend request ---------- */
        try {
            await api.post("/api/review/bulk-action/", {
                ids,
                action,
            })
        } catch (err) {
            console.error("Bulk action failed", err)
        }
    }

    /* ---------------- Loading ---------------- */
    if (loading || !company) {
        return <Skeleton className="h-64 w-full" />
    }

    /* ---------------- UI ---------------- */
    return (
        <Section>
            {/* ---------- Company Header ---------- */}
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    {/* Logo */}
                    <div className="relative">
                        {company.logo ? (
                        <Image
                            key={company.logo}
                            src={`${company.logo}`}
                            alt={company.name}
                            width={64}
                            height={64}
                            className="object-contain"
                            unoptimized
                        />

                        ) : (
                        <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                            No logo
                        </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <CardTitle>
                                {company.name}
                            </CardTitle>

                            {company.is_verified && (
                                <Badge variant="secondary">
                                    Verified
                                </Badge>
                            )}
                        </div>

                        <div className="text-sm text-muted-foreground mt-1">
                            ⭐ {company.rating_average} ·{" "}
                            {company.rating_count} reviews
                        </div>
                    </div>

                    {/* Upload */}
                    <div>
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={onLogoChange}
                                disabled={uploading}
                            />
                            <Badge variant="outline">
                                {uploading
                                    ? "Uploading..."
                                    : "Change logo"}
                            </Badge>
                        </label>
                    </div>
                </CardHeader>
            </Card>

            {/* ---------- Reviews Table ---------- */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        Customer Reviews
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <DataTable
                        data={company.reviews}
                        columns={reviewColumns(
                            (id, approved) => {
                                bulkAction(
                                    [id],
                                    approved
                                        ? "approve"
                                        : "reject"
                                )
                            }
                        )}
                        onBulkApprove={ids =>
                            bulkAction(ids, "approve")
                        }
                        onBulkReject={ids =>
                            bulkAction(ids, "reject")
                        }
                    />
                </CardContent>
            </Card>
        </Section>
    )
}
