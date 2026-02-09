import api from "@/lib/axios"

/* ---------- Types ---------- */

export type Company = {
    company_id: number
    company_slug: string
    company_name: string
    role: string
}

export type UserProfile = {
    id: number
    email: string
    username: string
    is_business: boolean
    mobile_number: string | null
    profile_image_url?: string | null
    companies: Company[]
}

/* ---------- Cache ---------- */

// key is fixed for now, but future-proof
const PROFILE_KEY = "me"

const profileCache = new Map<string, UserProfile>()
const profilePromise = new Map<string, Promise<UserProfile>>()

/* ---------- Get Profile ---------- */

export async function getProfile(
    forceRefresh: boolean = false
): Promise<UserProfile> {
    // ✅ Cached value
    if (!forceRefresh && profileCache.has(PROFILE_KEY)) {
        return profileCache.get(PROFILE_KEY)!
    }

    // ✅ Deduplicate parallel requests
    if (!forceRefresh && profilePromise.has(PROFILE_KEY)) {
        return profilePromise.get(PROFILE_KEY)!
    }

    const promise = api
        .get<UserProfile>("/api/auth/profile/")
        .then(res => {
            profileCache.set(PROFILE_KEY, res.data)
            return res.data
        })
        .finally(() => {
            profilePromise.delete(PROFILE_KEY)
        })

    profilePromise.set(PROFILE_KEY, promise)
    return promise
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

    // 🔁 Update cache
    profileCache.set(PROFILE_KEY, res.data)

    return res.data
}

/* ---------- Manual Invalidation ---------- */

export function clearProfileCache() {
    profileCache.clear()
    profilePromise.clear()
}

/* ---------- Update Profile (username / mobile) ---------- */

export async function updateProfile(
    data: Partial<Pick<UserProfile, "username" | "mobile_number">>
): Promise<UserProfile> {
    const res = await api.patch<UserProfile>(
        "/api/auth/profile/",
        data,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    )

    // 🔁 Update cache
    profileCache.set(PROFILE_KEY, res.data)

    return res.data
}
