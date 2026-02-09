"use client"

import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import {
    PageContentProvider,
    usePageContent,
} from "@/providers/PageContentProvider"

/* =====================================================
   TYPES
===================================================== */
type FooterLink = {
    label: string
    href: string
}

type SubscribeContent = {
    title: string
    description: string
    placeholder: string
    button_label: string
}

type FooterBottom = {
    text: string
    brand_label: string
    brand_href: string
}

/* =====================================================
   SKELETON
===================================================== */
function FooterSkeleton() {
    return (
        <footer className="dark bg-[#13181c]">
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 animate-pulse">

                    <div className="h-10 w-40 rounded bg-muted" />

                    <div className="space-y-3">
                        <div className="h-4 w-24 rounded bg-muted" />
                        <div className="h-3 w-full rounded bg-muted" />
                        <div className="h-3 w-5/6 rounded bg-muted" />
                    </div>

                    {[1, 2].map((i) => (
                        <div key={i} className="space-y-3">
                            <div className="h-4 w-24 rounded bg-muted" />
                            {[1, 2, 3, 4].map((j) => (
                                <div
                                    key={j}
                                    className="h-3 w-full rounded bg-muted"
                                />
                            ))}
                        </div>
                    ))}

                    <div className="space-y-3">
                        <div className="h-4 w-24 rounded bg-muted" />
                        <div className="h-3 w-full rounded bg-muted" />
                        <div className="h-10 w-full rounded bg-muted" />
                        <div className="h-10 w-32 rounded bg-muted" />
                    </div>
                </div>
            </div>

            <div className="border-t border-border">
                <div className="container mx-auto px-4 py-6">
                    <div className="h-3 w-64 mx-auto rounded bg-muted animate-pulse" />
                </div>
            </div>
        </footer>
    )
}

/* =====================================================
   INNER FOOTER
===================================================== */
function FooterInner() {
    const { content, loading } = usePageContent()

    if (loading || !content) return <FooterSkeleton />

    const logo = content["footer.brand.logo"] as string | undefined
    const logoAlt = content["footer.brand.alt"] as string | undefined

    const aboutTitle =
        content["footer.about.title"] as string | undefined

    const aboutText =
        content["footer.about.text"] as string | undefined

    const aboutLinks =
        content["footer.about.links"] as FooterLink[] | undefined

    const supportLinks =
        content["footer.support.links"] as FooterLink[] | undefined

    const subscribe =
        content["footer.subscribe"] as SubscribeContent | undefined

    const bottom =
        content["footer.bottom"] as FooterBottom | undefined

    if (!logo || !aboutLinks || !supportLinks || !subscribe || !bottom) {
        return <FooterSkeleton />
    }

    return (
        <footer className="dark bg-[#13181c]">
            <div className="container mx-auto px-4 py-12 text-muted-foreground">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">

                    {/* Brand */}
                    <Card className="bg-transparent border-none">
                        <Image
                            src={logo}
                            alt={logoAlt ?? "Logo"}
                            width={166}
                            height={39}
                        />
                    </Card>

                    {/* About Text */}
                    {aboutText && (
                        <Card className="bg-transparent border-none">
                            {aboutTitle && (
                                <h3 className="mb-4 text-sm font-semibold text-foreground">
                                    {aboutTitle}
                                </h3>
                            )}
                            <p className="text-sm leading-relaxed">
                                {aboutText}
                            </p>
                        </Card>
                    )}

                    {/* About Links */}
                    <Card className="bg-transparent border-none">
                        <h3 className="mb-4 text-sm font-semibold text-foreground">
                            About Us
                        </h3>
                        <ul className="space-y-2 text-sm">
                            {aboutLinks.map((l, i) => (
                                <li key={i}>
                                    <Link href={l.href}>{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {/* Support */}
                    <Card className="bg-transparent border-none">
                        <h3 className="mb-4 text-sm font-semibold text-foreground">
                            Get Support
                        </h3>
                        <ul className="space-y-2 text-sm">
                            {supportLinks.map((l, i) => (
                                <li key={i}>
                                    <Link href={l.href}>{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {/* Subscribe */}
                    <Card className="bg-transparent border-none">
                        <h3 className="mb-4 text-sm font-semibold text-foreground">
                            {subscribe.title}
                        </h3>
                        <p className="mb-4 text-sm">
                            {subscribe.description}
                        </p>
                        <form
                            className="flex flex-col gap-3"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <Input placeholder={subscribe.placeholder} />
                            <Button>{subscribe.button_label}</Button>
                        </form>
                    </Card>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-border">
                <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
                    {bottom.text}{" "}
                    <Link href={bottom.brand_href} className="underline">
                        {bottom.brand_label}
                    </Link>
                </div>
            </div>
        </footer>
    )
}

/* =====================================================
   PUBLIC FOOTER
===================================================== */
export function Footer() {
    return (
        <PageContentProvider page="footer">
            <FooterInner />
        </PageContentProvider>
    )
}
