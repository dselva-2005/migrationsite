"use server"

export type RegisterState = {
    error: string | null
    success: boolean
}

export async function registerAction(
    prevState: RegisterState,
    formData: FormData
): Promise<RegisterState> {
    const email = formData.get("email")
    const password = formData.get("password")

    if (!email || !password) {
        return { error: "Invalid form data", success: false }
    }

    try {
        const res = await fetch("https://192.168.1.113:8000/api/auth/register/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            cache: "no-store",
        })

        if (!res.ok) {
            const data = await res.json()
            return { error: data?.detail || "Registration failed", success: false }
        }

        return { error: null, success: true }
    } catch {
        return { error: "Network error", success: false }
    }
}
