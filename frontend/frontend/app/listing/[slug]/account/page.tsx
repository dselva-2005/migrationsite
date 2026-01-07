"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"

import api from "@/lib/axios"
import { CompanyAccount } from "@/types/company"
import { CompanyReview } from "@/types/review"

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

/* ============================================================
   TYPES
============================================================ */

type PaginatedReviewsResponse = {
    count: number
    results: CompanyReview[]
}

/* ============================================================
   API helpers
============================================================ */

async function fetchCompany(slug: string): Promise<CompanyAccount> {
    const res = await api.get(`/api/company/${slug}/account/`)
    return {
        ...res.data,
        rating_average: Number(
            Number(res.data.rating_average).toFixed(1)
        ),
        rating_count: Number(res.data.rating_count),
    }
}

async function fetchReviews(
    slug: string,
    page: number,
    pageSize: number,
    search?: string
): Promise<PaginatedReviewsResponse> {
    const res = await api.get(
        `/api/company/${slug}/dashboard/reviews/`,
        {
            params: {
                page,
                page_size: pageSize,
                search,
            },
        }
    )
    return res.data
}

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

/* ============================================================
   PAGE
============================================================ */

export default function CompanyAccountPage() {
    const { slug } = useParams<{ slug: string }>()

    /* ---------------- State ---------------- */

    const [company, setCompany] =
        useState<CompanyAccount | null>(null)

    const [reviews, setReviews] =
        useState<CompanyReview[]>([])
    const [total, setTotal] = useState(0)

    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] =
        useState("")

    const [loadingCompany, setLoadingCompany] =
        useState(true)
    const [loadingReviews, setLoadingReviews] =
        useState(true)

    const [uploading, setUploading] =
        useState(false)

    const [logoError, setLogoError] =
        useState<string | null>(null)

    /* ---------------- Fetch company ---------------- */

    useEffect(() => {
        let alive = true

        ;(async () => {
            setLoadingCompany(true)
            try {
                const data = await fetchCompany(slug)
                if (alive) setCompany(data)
            } finally {
                if (alive) setLoadingCompany(false)
            }
        })()

        return () => {
            alive = false
        }
    }, [slug])

    /* ---------------- Debounce search ---------------- */

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search)
            setPage(1)
        }, 400)

        return () => clearTimeout(t)
    }, [search])

    /* ---------------- Fetch reviews ---------------- */

    const refetchReviews = useCallback(async () => {
        setLoadingReviews(true)
        try {
            const res = await fetchReviews(
                slug,
                page,
                pageSize,
                debouncedSearch
            )
            setReviews(res.results)
            setTotal(res.count)
        } finally {
            setLoadingReviews(false)
        }
    }, [slug, page, pageSize, debouncedSearch])

    useEffect(() => {
        refetchReviews()
    }, [refetchReviews])

    /* ---------------- Logo update (2MB enforced) ---------------- */

    async function onLogoChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        if (!e.target.files?.[0] || !company) return

        const file = e.target.files[0]
        const MAX_SIZE = 2 * 1024 * 1024 // 2MB

        if (file.size > MAX_SIZE) {
            setLogoError("Logo must be less than 2 MB")
            e.target.value = ""
            return
        }

        setLogoError(null)

        const previewUrl = URL.createObjectURL(file)
        setCompany({ ...company, logo: previewUrl })

        try {
            setUploading(true)
            const logoUrl = await updateCompanyLogo(slug, file)
            setCompany(prev =>
                prev ? { ...prev, logo: logoUrl } : prev
            )
        } finally {
            setUploading(false)
        }
    }

    /* ---------------- Table columns ---------------- */

    const columns = useMemo(
        () => reviewColumns(refetchReviews),
        [refetchReviews]
    )

    /* ---------------- Loading ---------------- */

    if (loadingCompany || !company) {
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
                                src={company.logo}
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
                </CardHeader>

                {logoError && (
                    <div className="px-6 pb-4 text-sm text-red-500">
                        {logoError}
                    </div>
                )}
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
                        data={reviews}
                        columns={columns}
                        page={page}
                        pageSize={pageSize}
                        total={total}
                        loading={loadingReviews}
                        onPageChange={setPage}
                        onPageSizeChange={(size) => {
                            setPageSize(size)
                            setPage(1)
                        }}
                        onSearch={setSearch}
                    />
                </CardContent>
            </Card>
        </Section>
    )
}
