"use client"

import { useState } from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

import {
    updateProfile,
    updateProfileImage,
    UserProfile,
} from "@/services/profile"

type Props = {
    profile: UserProfile
    onUpdated?: (profile: UserProfile) => void
}

const MAX_IMAGE_SIZE = 2 * 1024 * 1024 // 2MB

export default function ProfileForm({ profile, onUpdated }: Props) {
    const [username, setUsername] = useState(profile.username)
    const [mobile, setMobile] = useState(profile.mobile_number ?? "")
    const [image, setImage] = useState<File | null>(null)

    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)

    /* ---------------- Derived state ---------------- */

    const hasProfileChanges =
        username !== profile.username ||
        mobile !== (profile.mobile_number ?? "")

    /* ---------------- Save profile fields ---------------- */

    async function onSaveProfile() {
        setSaving(true)
        try {
            const updated = await updateProfile({
                username,
                mobile_number: mobile || null,
            })

            toast.success("Profile updated", {
                description: "Your profile details were saved successfully.",
            })

            onUpdated?.(updated)
        } catch (err) {
            console.error(err)
            toast.error("Update failed", {
                description: "Could not update profile. Please try again.",
            })
        } finally {
            setSaving(false)
        }
    }

    /* ---------------- Upload image ---------------- */

    async function onUploadImage() {
        if (!image) return

        if (image.size > MAX_IMAGE_SIZE) {
            toast.warning("Image too large", {
                description: "Please upload an image under 2MB.",
            })
            return
        }

        setUploading(true)
        try {
            const updated = await updateProfileImage(image)

            toast.success("Profile image updated", {
                description: "Your new profile picture is live.",
            })

            onUpdated?.(updated)
            setImage(null)
        } catch (err) {
            console.error(err)
            toast.error("Upload failed", {
                description: "Image upload failed. Please try again.",
            })
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* ================= Profile Image ================= */}
            <div className="flex items-center gap-6">
                {profile.profile_image_url ? (
                    <Image
                        src={profile.profile_image_url}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="rounded-full"
                        unoptimized
                    />
                ) : (
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-sm text-muted-foreground">
                        No Image
                    </div>
                )}

                <div className="space-y-2">
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setImage(e.target.files?.[0] ?? null)
                        }
                    />
                    <Button
                        size="sm"
                        onClick={onUploadImage}
                        disabled={!image || uploading}
                    >
                        {uploading ? "Uploading..." : "Upload Image"}
                    </Button>
                </div>
            </div>

            <Separator />

            {/* ================= Basic Info ================= */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <Label>Email</Label>
                    <Input value={profile.email} disabled />
                </div>

                <div className="space-y-1">
                    <Label>Username</Label>
                    <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="space-y-1">
                    <Label>Mobile number</Label>
                    <Input
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="+91XXXXXXXXXX"
                    />
                </div>

                <div className="space-y-1 text-sm">
                    <span className="font-medium">Account type:</span>{" "}
                    {profile.is_business ? "Business" : "Personal"}
                </div>

                <Button
                    onClick={onSaveProfile}
                    disabled={saving || !hasProfileChanges}
                    className="w-fit"
                >
                    {saving ? "Saving..." : "Save changes"}
                </Button>
            </div>

            {/* ================= Companies ================= */}
            {profile.companies?.length > 0 && (
                <>
                    <Separator />
                    <div className="space-y-3">
                        <p className="font-medium text-sm">Companies</p>
                        <ul className="space-y-2">
                            {profile.companies.map((company) => (
                                <li
                                    key={company.company_id}
                                    className="rounded-md border p-3 text-sm"
                                >
                                    <div className="font-medium">
                                        {company.company_name}
                                    </div>
                                    <div className="text-muted-foreground text-xs">
                                        Role: {company.role}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    )
}
