"use client"

import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { usePageContent } from "@/providers/PageContentProvider"
import { Card, CardContent } from "@/components/ui/card"

type SidebarMenuItem = {
    label: string
    href: string
    active?: boolean
}

type SidebarMenu = {
    title: string
    items: SidebarMenuItem[]
}

type DownloadItem = {
    label: string
    href: string
    icon: string
    size: string
}

type DownloadsSection = {
    title: string
    items: DownloadItem[]
}

type SidebarBanner = {
    backgroundImage: string
    image: string
    eyebrow: string
    title: string
    features: string[]
    note?: string
    cta: {
        label: string
        href: string
    }
}

type CountriesSidebarData = {
    menu: SidebarMenu
    downloads: DownloadsSection
    banner: SidebarBanner
}

export default function CountriesSidebar() {
    const pathname = usePathname()
    const { content, loading } = usePageContent()

    const data = content?.["countries.sidebar"] as
        | CountriesSidebarData
        | undefined

    if (loading || !data) return (
        <div className="space-y-6">
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
            <div className="h-48 bg-muted animate-pulse rounded-lg" />
            <div className="h-72 bg-muted animate-pulse rounded-lg" />
        </div>
    )

    const { menu, downloads, banner } = data

    // Check if a menu item is active based on current URL path
    const isActive = (href: string) => {
        return pathname === href || pathname.startsWith(href + "/")
    }

    return (
        <div className="space-y-6">
            {/* Countries Menu */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">{menu.title}</h3>
                <div className="space-y-2">
                    {menu.items.map(item => {
                        const isActiveItem = isActive(item.href)
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`block p-3 rounded-lg transition-colors ${isActiveItem
                                        ? 'bg-primary text-primary-foreground font-medium'
                                        : 'hover:bg-accent'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Downloads */}
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold">{downloads.title}</h4>
                        <div className="space-y-3">
                            {downloads.items.map(item => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent transition-colors"
                                >
                                    <div className="relative w-10 h-10">
                                        <Image
                                            src={item.icon}
                                            alt={item.label}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">{item.label}</div>
                                        <div className="text-sm text-muted-foreground">{item.size}</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Banner */}
            <Card className="relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${banner.backgroundImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70" />

                <CardContent className="relative z-10 p-6 text-primary-foreground space-y-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <div className="text-sm font-medium opacity-90">{banner.eyebrow}</div>
                            <h3 className="text-xl font-bold">{banner.title}</h3>
                        </div>
                    </div>

                    <ul className="space-y-2">
                        {banner.features.map(f => (
                            <li key={f} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                                <span>{f}</span>
                            </li>
                        ))}
                    </ul>

                    {banner.note && (
                        <p className="text-sm opacity-90">{banner.note}</p>
                    )}

                    <Link
                        href={banner.cta.href}
                        className="inline-block bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors"
                    >
                        {banner.cta.label}
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}