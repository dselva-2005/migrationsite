"use client"

import { useState, FormEvent, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"

import { useAuth } from "@/providers/AuthProvider"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    registerBusiness,
    RegisterBusinessPayload,
} from "@/services/companyRegister"

interface ErrorResponse {
    detail?: string
}

export default function RegisterBusinessForm() {
    const { user, isLoggedIn } = useAuth()

    const [form, setForm] = useState<RegisterBusinessPayload>({
        company_name: "",
        website: "",
        email: "",
        phone_number: "",
        message: "",
    })

    const [loading, setLoading] = useState(false)

    /* ---------------- Prefill Email If Logged In ---------------- */

    useEffect(() => {
        if (isLoggedIn && user?.email) {
            setForm(prev => ({
                ...prev,
                email: user.email ?? "",
            }))
        }
    }, [isLoggedIn, user])

    /* ---------------- Validation ---------------- */

    const validate = (): boolean => {
        if (!form.company_name.trim()) {
            toast.error("Company name is required")
            return false
        }

        if (!form.email.trim()) {
            toast.error("Email is required")
            return false
        }

        if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            toast.error("Enter a valid email address")
            return false
        }

        if (!form.phone_number.trim()) {
            toast.error("Phone number is required")
            return false
        }

        if (!form.message.trim()) {
            toast.error("Message is required")
            return false
        }

        return true
    }

    /* ---------------- Submit ---------------- */

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validate()) return

        setLoading(true)

        try {
            await registerBusiness({
                company_name: form.company_name.trim(),
                website: form.website.trim(),
                email: form.email.trim(),
                phone_number: form.phone_number.trim(),
                message: form.message.trim(),
            })

            toast.success("Company suggestion submitted successfully")

            setForm({
                company_name: "",
                website: "",
                email: isLoggedIn && user?.email ? user.email : "",
                phone_number: "",
                message: "",
            })
        } catch (err) {
            if (axios.isAxiosError<ErrorResponse>(err)) {
                toast.error(
                    err.response?.data?.detail ??
                        "Failed to submit request"
                )
            } else {
                toast.error("Unexpected error occurred")
            }
        } finally {
            setLoading(false)
        }
    }

    /* ---------------- UI ---------------- */

    return (
        <Card className="mx-auto w-full max-w-xl">
            <CardHeader>
                <CardTitle>Suggest a Company</CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={onSubmit} className="space-y-6" noValidate>
                    <div className="space-y-1">
                        <Label htmlFor="company_name">Company Name</Label>
                        <Input
                            id="company_name"
                            value={form.company_name}
                            onChange={(e) =>
                                setForm({ ...form, company_name: e.target.value })
                            }
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="website">Website (Optional)</Label>
                        <Input
                            id="website"
                            value={form.website}
                            onChange={(e) =>
                                setForm({ ...form, website: e.target.value })
                            }
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="email">
                            Contact Email
                            {isLoggedIn && (
                                <span className="text-xs text-muted-foreground ml-2">
                                    (auto-filled from your account)
                                </span>
                            )}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <Input
                            id="phone_number"
                            value={form.phone_number}
                            onChange={(e) =>
                                setForm({ ...form, phone_number: e.target.value })
                            }
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            rows={4}
                            value={form.message}
                            onChange={(e) =>
                                setForm({ ...form, message: e.target.value })
                            }
                            disabled={loading}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
