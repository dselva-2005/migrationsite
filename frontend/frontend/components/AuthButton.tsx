"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type AuthState = "loading" | "authenticated" | "unauthenticated"

export default function AuthButton() {
    const router = useRouter()
    const [authState, setAuthState] = useState<AuthState>("loading")

    // Check auth status
    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch("https://192.168.1.113:8000/api/auth/me/", {
                    credentials: "include",
                    cache: "no-store",
                })

                setAuthState(res.ok ? "authenticated" : "unauthenticated")
            } catch {
                setAuthState("unauthenticated")
            }
        }

        checkAuth()
    }, [])

    async function handleLogout() {
        try {
            await fetch("https://192.168.1.113:8000/api/auth/logout/", {
                method: "POST",
                credentials: "include",
            })
        } finally {
            setAuthState("unauthenticated")
            router.push("/login")
            router.refresh()
        }
    }

    if (authState === "loading") {
        return (
            <Button variant="ghost" disabled>
                Loading…
            </Button>
        )
    }

    if (authState === "authenticated") {
        return (
            <Button variant="destructive" onClick={handleLogout}>
                Logout
            </Button>
        )
    }

    return (
        <Button onClick={() => router.push("/login")}>
            Login
        </Button>
    )
}
