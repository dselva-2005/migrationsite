"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { useAuth } from "@/providers/AuthProvider"

export default function AuthToasts() {
    const {
        justLoggedIn,
        consumeJustLoggedIn,
        justLoggedOut,
        consumeJustLoggedOut,
    } = useAuth()

    useEffect(() => {
        if (justLoggedIn) {
            toast.success("Logged in successfully")
            consumeJustLoggedIn()
        }
    }, [justLoggedIn, consumeJustLoggedIn])

    useEffect(() => {
        if (justLoggedOut) {
            toast.info("Logged out successfully")
            consumeJustLoggedOut()
        }
    }, [justLoggedOut, consumeJustLoggedOut])

    return null
}
