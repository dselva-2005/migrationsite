"use client"

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react"
import api from "@/lib/axios"

/* ---------------- API Types ---------------- */

type MeCompanyResponse = {
    company_id: number
    company_slug: string
    company_name: string
    role: "OWNER" | "MANAGER" | "EMPLOYEE"
}

type MeResponse = {
    id: number
    username: string
    email?: string
    companies: MeCompanyResponse[]
}

/* ---------------- App Types ---------------- */

export type CompanyMembership = {
    companyId: number
    companySlug: string
    companyName: string
    role: "OWNER" | "MANAGER" | "EMPLOYEE"
}

export type AuthUser = {
    id: number
    username: string
    email?: string
    isBusiness: boolean
    companies: CompanyMembership[]
}

type AuthContextType = {
    user: AuthUser | null
    isLoggedIn: boolean
    loading: boolean
    refreshAuth: () => Promise<void>
    logout: () => Promise<void>
}

/* ---------------- Context ---------------- */

const AuthContext = createContext<AuthContextType | null>(null)

/* ---------------- Provider ---------------- */

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const refreshAuth = useCallback(async (): Promise<void> => {
        setLoading(true)

        try {
            const res = await api.get<MeResponse>("/api/auth/me/")
            const data = res.data

            const companies: CompanyMembership[] = data.companies.map(
                (c): CompanyMembership => ({
                    companyId: c.company_id,
                    companySlug: c.company_slug,
                    companyName: c.company_name,
                    role: c.role,
                })
            )

            setUser({
                id: data.id,
                username: data.username,
                email: data.email,
                isBusiness: companies.length > 0,
                companies,
            })
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [])

    const logout = async (): Promise<void> => {
        try {
            await api.post("/api/auth/logout/")
        } finally {
            setUser(null)
        }
    }

    useEffect(() => {
        refreshAuth()
    }, [refreshAuth])

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: Boolean(user),
                loading,
                refreshAuth,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

/* ---------------- Hook ---------------- */

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error("useAuth must be used inside AuthProvider")
    }
    return ctx
}
