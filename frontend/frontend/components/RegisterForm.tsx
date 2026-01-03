"use client"

import { useState, FormEvent, startTransition, JSX } from "react"
import { useActionState } from "react"
import { registerAction, RegisterState } from "@/app/(auth)/register/actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const initialState: RegisterState = {
    error: null,
    success: false,
}

export default function RegisterForm(): JSX.Element {
    const [state, formAction] = useActionState<RegisterState, FormData>(
        registerAction,
        initialState
    )

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [usernameError, setUsernameError] = useState<string | null>(null)
    const [emailError, setEmailError] = useState<string | null>(null)
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [confirmError, setConfirmError] = useState<string | null>(null)

    const validate = (): boolean => {
        let valid = true

        setUsernameError(null)
        setEmailError(null)
        setPasswordError(null)
        setConfirmError(null)

        if (!username.trim()) {
            setUsernameError("Username is required")
            valid = false
        } else if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
            setUsernameError(
                "Username must be 3–30 characters and contain only letters, numbers, or underscores"
            )
            valid = false
        }

        if (!email.trim()) {
            setEmailError("Email is required")
            valid = false
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            setEmailError("Enter a valid email address")
            valid = false
        }

        if (!password) {
            setPasswordError("Password is required")
            valid = false
        } else if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters")
            valid = false
        }

        if (confirmPassword !== password) {
            setConfirmError("Passwords do not match")
            valid = false
        }

        return valid
    }

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!validate()) return

        const formData = new FormData(e.currentTarget)

        startTransition(() => {
            formAction(formData)
        })
    }

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
                            name="username"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={usernameError ? "border-red-500" : ""}
                        />
                        {usernameError && (
                            <p className="text-sm text-red-500">
                                {usernameError}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={emailError ? "border-red-500" : ""}
                        />
                        {emailError && (
                            <p className="text-sm text-red-500">
                                {emailError}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={passwordError ? "border-red-500" : ""}
                        />
                        {passwordError && (
                            <p className="text-sm text-red-500">
                                {passwordError}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                        <Label htmlFor="confirmPassword">
                            Confirm Password
                        </Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            className={confirmError ? "border-red-500" : ""}
                        />
                        {confirmError && (
                            <p className="text-sm text-red-500">
                                {confirmError}
                            </p>
                        )}
                    </div>

                    {/* Server error */}
                    {state.error && (
                        <div className="rounded-md bg-red-50 p-3">
                            <p className="text-sm text-red-600">
                                {state.error}
                            </p>
                        </div>
                    )}

                    {/* Success */}
                    {state.success && (
                        <p className="text-sm text-green-600">
                            Account created successfully. You can now log in.
                        </p>
                    )}

                    <Button type="submit" className="w-full">
                        Register
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
