import api from "@/lib/axios"

export interface UserProfile {
    id: number
    email: string
    username: string
    profile_image_url: string | null
    date_joined: string
}

export async function getProfile(): Promise<UserProfile> {
    const res = await api.get<UserProfile>("/api/auth/profile/")
    return res.data
}

export async function updateProfileImage(
    image: File
): Promise<UserProfile> {
    const formData = new FormData()
    formData.append("profile_image", image)

    const res = await api.patch<UserProfile>(
        "/api/auth/profile/",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    )

    return res.data
}
