"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { usePageContent } from "@/providers/PageContentProvider"
import { cn } from "@/lib/utils"
import {
    VisaMenuItem,
    VisaDownload,
    VisaSidebarBanner,
} from "@/types/visa"

export default function LeftSidebar() {
    const { content } = usePageContent()
    const pathname = usePathname()

    const menu = content?.["visa.sidebar.menu"] as VisaMenuItem[] ?? []
    const downloads = content?.["visa.sidebar.downloads"] as VisaDownload[] ?? []
    const banner = content?.["visa.sidebar.banner"] as VisaSidebarBanner | undefined

    return (
        <div className="space-y-8">
            {/* MENU */}
            <div className="bg-muted p-6 rounded-xl">
                <ul className="space-y-2">
                    {menu.map((item) => {
                        const href = `/visa/${item.slug}`
                        const active = pathname === href
                        return (
                            <li key={item.slug}>
                                <Link
                                    href={href}
                                    className={cn(
                                        "block px-4 py-3 font-medium transition rounded-lg",
                                        active
                                            ? "bg-primary text-white"
                                            : "bg-background hover:bg-muted"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* DOWNLOADS */}
            {downloads.length > 0 && (
                <div className="bg-muted p-6 rounded-xl">
                    <h4 className="mb-4 text-lg font-semibold">Downloads</h4>
                    <ul className="grid grid-cols-2 gap-4">
                        {downloads.map((file) => (
                            <li key={file.url}>
                                <a
                                    href={file.url}
                                    className="flex flex-col items-center bg-background p-4 text-center hover:bg-muted rounded-lg transition"
                                >
                                    <Image src={file.icon} alt={file.title} width={46} height={46} />
                                    <h6 className="mt-2 text-sm font-medium">{file.title}</h6>
                                    <span className="text-xs text-muted-foreground">{file.size}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* BANNER */}
            {banner && (
                <div className="relative overflow-hidden rounded-xl">
                    <Image src={banner.background} alt="" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="relative z-10 p-6 text-white">
                        <h6 className="text-sm opacity-80">{banner.heading_small}</h6>
                        <h3 className="mt-1 text-2xl font-bold">{banner.heading_main}</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            {banner.points.map((p, i) => (
                                <li key={i}>• {p}</li>
                            ))}
                        </ul>
                        <Link
                            href={banner.cta.url}
                            className="mt-6 inline-block bg-primary px-5 py-3 text-sm font-medium rounded-lg"
                        >
                            {banner.cta.label}
                        </Link>
                    </div>

                </div>
            )}
        </div>
    )
}
