import api from "@/lib/axios"

/* ---------- Types ---------- */

export interface UserProfile {
    id: number
    email: string
    username: string
    profile_image_url: string | null
    date_joined: string
}

/* ---------- Cache ---------- */

let profileCache: UserProfile | null = null
let profilePromise: Promise<UserProfile> | null = null

/* ---------- Get Profile ---------- */

export async function getProfile(
    forceRefresh: boolean = false
): Promise<UserProfile> {
    // ✅ Return cached data
    if (profileCache && !forceRefresh) {
        return profileCache
    }

    // ✅ Deduplicate parallel requests
    if (profilePromise && !forceRefresh) {
        return profilePromise
    }

    profilePromise = api
        .get<UserProfile>("/api/auth/profile/")
        .then((res) => {
            profileCache = res.data
            return res.data
        })
        .finally(() => {
            profilePromise = null
        })

    return profilePromise
}

/* ---------- Update Profile Image ---------- */

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

    // 🔁 Invalidate + update cache
    profileCache = res.data

    return res.data
}

/* ---------- Optional Manual Invalidation ---------- */

export function clearProfileCache() {
    profileCache = null
}
