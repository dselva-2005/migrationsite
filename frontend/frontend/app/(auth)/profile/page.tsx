"use client"

import { useEffect, useState } from "react"
import { getProfile, UserProfile } from "@/services/profile"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import ProfileForm from "./ProfileForm"
import { Section } from "@/components/Section"

/* ================= Skeleton ================= */

function ProfilePageSkeleton() {
    return (
        <Section>
            <Card className="max-w-xl">
                <CardHeader>
                    <Skeleton className="h-6 w-32 bg-muted/70" />
                </CardHeader>

                <CardContent className="space-y-8">
                    <div className="flex items-center gap-6">
                        <Skeleton className="h-24 w-24 rounded-full bg-muted/70" />
                        <div className="space-y-2">
                            <Skeleton className="h-9 w-64 bg-muted/70" />
                            <Skeleton className="h-9 w-32 bg-muted/70" />
                        </div>
                    </div>

                    <Skeleton className="h-px w-full bg-muted/70" />

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-20 bg-muted/70" />
                            <Skeleton className="h-9 w-full bg-muted/70" />
                        </div>

                        <div className="space-y-1">
                            <Skeleton className="h-4 w-24 bg-muted/70" />
                            <Skeleton className="h-9 w-full bg-muted/70" />
                        </div>

                        <div className="space-y-1">
                            <Skeleton className="h-4 w-32 bg-muted/70" />
                            <Skeleton className="h-9 w-full bg-muted/70" />
                        </div>

                        <Skeleton className="h-9 w-36 bg-muted/70" />
                    </div>
                </CardContent>
            </Card>
        </Section>
    )
}

/* ================= Page ================= */

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null)

    useEffect(() => {
        getProfile().then(setProfile)
    }, [])

    if (!profile) {
        return <ProfilePageSkeleton />
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
                        onUpdated={setProfile}
                    />
                </CardContent>
            </Card>
        </Section>
    )
}
