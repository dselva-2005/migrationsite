"use client"

import { useRouter } from "next/navigation"
import { useState, FormEvent, JSX } from "react"
import axios, { AxiosError } from "axios"
import publicApi from "@/lib/publicApi"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


/* ---------------- Types ---------------- */

type RegisterFormState = {
    username: string
    email: string
    password: string
    confirmPassword: string
}

type FieldErrors = Partial<
    Record<"username" | "email" | "password" | "confirm", string>
>

type ApiErrorResponse = {
    detail?: string
    username?: string[]
    email?: string[]
}

/* -------------- Component -------------- */

export default function RegisterForm(): JSX.Element {
    const [form, setForm] = useState<RegisterFormState>({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const router = useRouter()
    const [errors, setErrors] = useState<FieldErrors>({})
    const [serverError, setServerError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    /* ------------ Validation ------------ */

    const validate = (): boolean => {
        const nextErrors: FieldErrors = {}

        if (!form.username.trim()) {
            nextErrors.username = "Username is required"
        } else if (!/^[a-zA-Z0-9_]{3,30}$/.test(form.username)) {
            nextErrors.username =
                "Username must be 3–30 characters and contain only letters, numbers, or underscores"
        }

        if (!form.email.trim()) {
            nextErrors.email = "Email is required"
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            nextErrors.email = "Enter a valid email address"
        }

        if (!form.password) {
            nextErrors.password = "Password is required"
        } else if (form.password.length < 8) {
            nextErrors.password = "Password must be at least 8 characters"
        }

        if (form.confirmPassword !== form.password) {
            nextErrors.confirm = "Passwords do not match"
        }

        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    /* -------------- Submit -------------- */

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setServerError(null)

        if (!validate()) return

        setLoading(true)

        try {
            await publicApi.post("/api/auth/register/", {
                username: form.username,
                email: form.email,
                password: form.password,
            })

            setForm({
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
            })
            router.push("/login");
        } catch (error: unknown) {
            if (axios.isAxiosError<ApiErrorResponse>(error)) {
                const data = error.response?.data

                setServerError(
                    data?.detail ??
                    data?.username?.[0] ??
                    data?.email?.[0] ??
                    "Registration failed"
                )
            } else {
                setServerError("Registration failed")
            }
        } finally {
            setLoading(false)
        }
    }

    /* -------------- Render -------------- */

    return (
        <Card className="w-full max-w-xl sm:max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Create account</CardTitle>
            </CardHeader>

            <CardContent className="px-6 sm:px-10">
                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Username */}
                    <div className="space-y-1">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={form.username}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    username: e.target.value,
                                })
                            }
                            className={errors.username ? "border-red-500" : ""}
                        />
                        {errors.username && (
                            <p className="text-sm text-red-500">
                                {errors.username}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                            className={errors.password ? "border-red-500" : ""}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                        <Label htmlFor="confirm">Confirm Password</Label>
                        <Input
                            id="confirm"
                            type="password"
                            value={form.confirmPassword}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    confirmPassword: e.target.value,
                                })
                            }
                            className={errors.confirm ? "border-red-500" : ""}
                        />
                        {errors.confirm && (
                            <p className="text-sm text-red-500">
                                {errors.confirm}
                            </p>
                        )}
                    </div>

                    {serverError && (
                        <div className="rounded-md bg-red-50 p-3">
                            <p className="text-sm text-red-600">
                                {serverError}
                            </p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Creating account…" : "Register"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
