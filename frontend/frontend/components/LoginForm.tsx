"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

import api from "@/lib/axios"
import { useAuth } from "@/app/providers/AuthProvider"
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

    function validate(): boolean {
        if (!email) {
            setError("Email is required")
            return false
        }
        if (!email.includes("@")) {
            setError("Enter a valid email")
            return false
        }
        if (!password || password.length < 8) {
            setError("Password must be at least 8 characters")
            return false
        }
        return true
    }

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
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
        } catch (err: unknown) {
            if (axios.isAxiosError<LoginErrorResponse>(err)) {
                setError(
                    err.response?.data?.detail ??
                    "Invalid email or password"
                )
            } else {
                setError("Something went wrong")
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
                            autoComplete="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    <div>
                        <Link className="text-sm" href="/register">
                            Create new account?
                        </Link>
                    </div>

                    {/* Submit */}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
