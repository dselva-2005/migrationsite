"use client"

import { useState, FormEvent, startTransition, JSX } from "react"
import { useActionState } from "react"
import { registerAction, RegisterState } from "@/app/(auth)/register/actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const initialState: RegisterState = { error: null, success: false }

export default function RegisterForm(): JSX.Element {
    const [state, formAction] = useActionState<RegisterState, FormData>(
        registerAction,
        initialState
    )

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState<string | null>(null)
    const [passwordError, setPasswordError] = useState<string | null>(null)

    function validate(): boolean {
        let valid = true
        setEmailError(null)
        setPasswordError(null)

        if (!email) {
            setEmailError("Email is required")
            valid = false
        } else if (!email.includes("@")) {
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

        return valid
    }

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
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
                    <div className="space-y-1">
                        <Label>Email</Label>
                        <Input
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={emailError ? "border-red-500" : ""}
                        />
                        {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label>Password</Label>
                        <Input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={passwordError ? "border-red-500" : ""}
                        />
                        {passwordError && (
                            <p className="text-sm text-red-500">{passwordError}</p>
                        )}
                    </div>

                    {state.error && (
                        <div className="rounded-md bg-red-50 p-3">
                            <p className="text-sm text-red-600">{state.error}</p>
                        </div>
                    )}

                    {state.success && (
                        <p className="text-sm text-green-600">
                            Account created successfully
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
