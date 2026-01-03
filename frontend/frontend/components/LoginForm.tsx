"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

import api from "@/lib/axios"
import { useAuth } from "@/providers/AuthProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface LoginFormProps {
    redirectPath?: string
}

interface LoginErrorResponse {
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
    const [loading, setLoading] = useState(false)

    const validate = (): boolean => {
        if (!email.trim()) {
            setError("Email is required")
            return false
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError("Enter a valid email address")
            return false
        }

        if (!password || password.length < 8) {
            setError("Password must be at least 8 characters")
            return false
        }

        return true
    }

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        if (!validate()) return
        setLoading(true)

        try {
            await api.post("/api/auth/login/", {
                email,
                password,
            })

            await refreshAuth()
            router.replace(redirectPath)
        } catch (err) {
            if (axios.isAxiosError<LoginErrorResponse>(err)) {
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

    return (
        <Card className="mx-auto w-full max-w-xl">
            <CardHeader>
                <CardTitle>Login</CardTitle>
            </CardHeader>

            <CardContent>
                <form noValidate onSubmit={onSubmit} className="space-y-6">
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

                    {/* Password */}
                    <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    <div className="flex justify-between text-sm">
                        <Link href="/register">Create new account</Link>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
