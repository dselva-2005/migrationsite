"use client"

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"
import api from "@/lib/axios"

type AuthContextType = {
    isLoggedIn: boolean
    loading: boolean
    refreshAuth: () => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)

    const refreshAuth = async () => {
        try {
            await api.get("/api/auth/me/")
            setIsLoggedIn(true)
        } catch {
            setIsLoggedIn(false)
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            await api.post("/api/auth/logout/")
        } finally {
            setIsLoggedIn(false)
        }
    }

    useEffect(() => {
        refreshAuth()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                loading,
                refreshAuth,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
    return ctx
}
