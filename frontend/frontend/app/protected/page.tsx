"use client"

import { JSX, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ProtectedPage(): JSX.Element {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<string | null>(null)

    useEffect(() => {
        async function checkAuth() {
            try {
                // Call protected API endpoint with cookies
                const res = await fetch("https://192.168.1.113:8000/api/auth/protected/", {
                    method: "GET",
                    credentials: "include", // important: sends HttpOnly cookies
                })

                if (res.status === 401) {
                    router.replace("/login") // not authenticated
                    return
                }

                if (!res.ok) {
                    throw new Error("Failed to fetch protected data")
                }

                const result = await res.json()
                setData(result.message || "You have access to protected data")
            } catch {
                setError("Failed to verify authentication")
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [router])

    if (loading) return <p className="p-4">Checking authentication...</p>
    if (error) return <p className="p-4 text-red-600">{error}</p>

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-xl text-center">
                <h1 className="text-2xl font-bold mb-4">Protected Page</h1>
                <p>{data}</p>
            </div>
        </div>
    )
}
