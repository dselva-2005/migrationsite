"use server"

export type RegisterState = {
    error: string | null
    success: boolean
}

export async function registerAction(
    _: RegisterState,
    formData: FormData
): Promise<RegisterState> {
    const username = formData.get("username")
    const email = formData.get("email")
    const password = formData.get("password")

    if (
        typeof username !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        return { error: "Invalid form data", success: false }
    }

    if (username.length < 3) {
        return { error: "Username must be at least 3 characters", success: false }
    }

    if (password.length < 8) {
        return { error: "Password must be at least 8 characters", success: false }
    }

    try {
        const res = await fetch(
            "https://192.168.1.113:8000/api/auth/register/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
                cache: "no-store",
            }
        )

        const data = await res.json().catch(() => null)

        if (!res.ok) {
            return {
                error:
                    data?.detail ||
                    data?.username?.[0] ||
                    data?.email?.[0] ||
                    "Registration failed",
                success: false,
            }
        }

        return { error: null, success: true }
    } catch {
        return { error: "Network error", success: false }
    }
}
