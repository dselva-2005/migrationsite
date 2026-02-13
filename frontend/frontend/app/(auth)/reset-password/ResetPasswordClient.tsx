"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Section } from "@/components/Section"
import publicApi from "@/lib/publicApi" // your axios instance
import { toast } from "sonner"
import axios, { AxiosError } from "axios"

type ResetPasswordErrorResponse = {
    detail?: string
}

/* ---------------- Component ---------------- */

export default function ResetPasswordClient() {
    const params = useSearchParams()

    const uid = params.get("uid")
    const token = params.get("token")

    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function submit() {
        if (!password || password.length < 8) {
            setError("Password must be at least 8 characters")
            return
        }

        if (!uid || !token) {
            setError("Invalid or expired reset link")
            return
        }

        setLoading(true)
        setError(null)

        try {
            await publicApi.post("/api/auth/reset-password/", {
                uid,
                token,
                password,
            })

            setDone(true)
        } catch (err) {
            if (axios.isAxiosError<ResetPasswordErrorResponse>(err)) {
                const data = err.response?.data
                setError(data?.detail || "Reset link is invalid or expired")
                toast.error("Reset failed", {
                    description: data?.detail || "Reset link is invalid or expired",
                })
            } else {
                setError("Unexpected error occurred")
                toast.error("Reset failed", {
                    description: "Unexpected error occurred",
                })
            }
        } finally {
            setLoading(false)
        }
    }

    if (done) {
        return (
            <div className="max-w-md mx-auto mt-24 p-6 text-center space-y-4">
                <h1 className="text-xl font-semibold">Password updated ✅</h1>
                <p className="text-muted-foreground">
                    You can now log in with your new password.
                </p>
            </div>
        )
    }

    return (
        <Section>
            <div className="max-w-md mx-auto mt-24 p-6 space-y-6">
                <h1 className="text-2xl font-semibold text-center">Reset Password</h1>

                <div className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New password"
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring"
                    />

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <button
                        onClick={submit}
                        disabled={loading}
                        className="w-full bg-black text-white py-2 rounded-md disabled:opacity-50"
                    >
                        {loading ? "Updating…" : "Set New Password"}
                    </button>
                </div>
            </div>
        </Section>
    )
}
