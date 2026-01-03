"use client"

import { useEffect, useState } from "react"
import { getProfile, UserProfile } from "@/services/profile"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import ProfileForm from "./ProfileForm"
import { Section } from "@/components/Section"

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null)

    useEffect(() => {
        getProfile().then(setProfile)
    }, [])

    if (!profile) {
        return <Skeleton className="h-48 w-full" />
    }

    return (
        <Section>
            <Card className="max-w-xl">
                <CardHeader>
                    <CardTitle>User Profile</CardTitle>
                </CardHeader>

                <CardContent>
                    <ProfileForm
                        profile={profile}
                        onUpdated={(updatedProfile) => {
                            setProfile(updatedProfile)
                        }}
                    />
                </CardContent>
            </Card>
        </Section>
    )
}
