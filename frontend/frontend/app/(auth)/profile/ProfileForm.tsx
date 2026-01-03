"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateProfileImage, UserProfile } from "@/services/profile"

type Props = {
    profile: UserProfile
    onUpdated?: (profile: UserProfile) => void
}

export default function ProfileForm({ profile, onUpdated }: Props) {
    const [image, setImage] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    async function onSave() {
        if (!image) return

        setLoading(true)
        try {
            const updated = await updateProfileImage(image)
            onUpdated?.(updated)   // ✅ SAFE
            setImage(null)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            {profile.profile_image_url && (
                <Image
                    src={profile.profile_image_url}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="rounded-full"
                    unoptimized
                />
            )}

            <Input
                type="file"
                accept="image/*"
                onChange={e =>
                    setImage(e.target.files?.[0] ?? null)
                }
            />

            <Button
                onClick={onSave}
                disabled={!image || loading}
            >
                {loading ? "Uploading..." : "Upload Image"}
            </Button>
        </div>
    )
}
