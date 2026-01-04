"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Link from "next/link"

import api from "@/lib/axios"
import { useAuth } from "@/providers/AuthProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface LoginFormProps {
    redirectPath?: string
}

interface ErrorResponse {
    detail?: string
}

export default function LoginForm({
    redirectPath = "/",
}: LoginFormProps) {
    const router = useRouter()
    const { refreshAuth } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const [forgotMode, setForgotMode] = useState(false)

    /* ---------------- Validation ---------------- */

    const validateEmail = (): boolean => {
        if (!email.trim()) {
            setError("Email is required")
            return false
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError("Enter a valid email address")
            return false
        }

        return true
    }

    const validateLogin = (): boolean => {
        if (!validateEmail()) return false

        if (!password || password.length < 8) {
            setError("Password must be at least 8 characters")
            return false
        }

        return true
    }

    /* ---------------- Login ---------------- */

    const onLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        if (!validateLogin()) return

        setLoading(true)

        try {
            await api.post("/api/auth/login/", {
                email,
                password,
            })

            await refreshAuth()
            router.replace(redirectPath)
        } catch (err) {
            if (axios.isAxiosError<ErrorResponse>(err)) {
                setError(
                    err.response?.data?.detail ??
                    "Invalid email or password"
                )
            } else {
                setError("Unexpected error occurred")
            }
        } finally {
            setLoading(false)
        }
    }

    /* ---------------- Forgot Password ---------------- */

    const onForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        if (!validateEmail()) return

        setLoading(true)

        try {
            await api.post("/api/auth/forgot-password/", { email })

            setSuccess(
                "If an account exists for this email, a reset link has been sent."
            )
        } catch {
            // Always generic for security
            setSuccess(
                "If an account exists for this email, a reset link has been sent."
            )
        } finally {
            setLoading(false)
        }
    }

    /* ---------------- UI ---------------- */

    return (
        <Card className="mx-auto w-full max-w-xl">
            <CardHeader>
                <CardTitle>
                    {forgotMode ? "Forgot Password" : "Login"}
                </CardTitle>
            </CardHeader>

            <CardContent>
                <form
                    noValidate
                    onSubmit={forgotMode ? onForgotPassword : onLogin}
                    className="space-y-6"
                >
                    {/* Email */}
                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* Password (only login mode) */}
                    {!forgotMode && (
                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                disabled={loading}
                            />
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    {/* Success */}
                    {success && (
                        <p className="text-sm text-green-600">{success}</p>
                    )}

                    {/* Links */}
                    <div className="flex justify-between text-sm">
                        {!forgotMode ? (
                            <>
                                <button
                                    type="button"
                                    className="text-primary hover:underline"
                                    onClick={() => {
                                        setForgotMode(true)
                                        setError(null)
                                        setSuccess(null)
                                    }}
                                >
                                    Forgot password?
                                </button>

                                <Link href="/register">
                                    Create new account
                                </Link>
                            </>
                        ) : (
                            <button
                                type="button"
                                className="text-primary hover:underline"
                                onClick={() => {
                                    setForgotMode(false)
                                    setError(null)
                                    setSuccess(null)
                                }}
                            >
                                Back to login
                            </button>
                        )}
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading
                            ? forgotMode
                                ? "Sending..."
                                : "Logging in..."
                            : forgotMode
                                ? "Send reset link"
                                : "Login"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
