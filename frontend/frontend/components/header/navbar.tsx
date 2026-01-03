"use client"

import Link from "next/link"
import { Menu, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/AuthProvider"

import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"

/* ---------------------------------- */
/* Navbar */
/* ---------------------------------- */

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b bg-background">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                {/* Brand */}
                <Link href="/" className="text-lg font-semibold">
                    Migration Reviews
                </Link>

                {/* Desktop */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLinks />

                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="h-9 w-56 pl-8"
                        />
                    </div>
                </div>

                {/* Mobile */}
                <div className="md:hidden">
                    <MobileNav />
                </div>
            </div>
        </header>
    )
}

/* ---------------------------------- */
/* Desktop Links */
/* ---------------------------------- */

function NavLinks() {
    const { user, isLoggedIn, loading, logout } = useAuth()

    if (loading) return null

    const companies = user?.companies ?? []
    const isBusinessUser = companies.length > 0

    // If exactly one company → direct dashboard
    const dashboardHref =
        companies.length === 1
            ? `/listing/${companies[0].companySlug}/account`
            : "/listing"

    return (
        <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/review">Write a Review</Link>
            <Link href="/blog">Blog</Link>

            {/* Logged out */}
            {!isLoggedIn && (
                <>
                    <Link href="/login">Login</Link>
                    <Link href="/register">Register</Link>
                </>
            )}

            {/* Logged in – no company */}
            {isLoggedIn && !isBusinessUser && (
                <>
                    <Link href="/business-login">Become a Business</Link>
                    <button onClick={logout}>Logout</button>
                </>
            )}

            {/* Logged in – business user */}
            {isLoggedIn && isBusinessUser && (
                <>
                    <Link href={dashboardHref}>Dashboard</Link>
                    <button onClick={logout}>Logout</button>
                </>
            )}
        </nav>
    )
}

/* ---------------------------------- */
/* Mobile Nav */
/* ---------------------------------- */

function MobileNav() {
    const { user, isLoggedIn, loading, logout } = useAuth()

    const companies = user?.companies ?? []
    const isBusinessUser = companies.length > 0

    const dashboardHref =
        companies.length === 1
            ? `/listing/${companies[0].companySlug}/account`
            : "/listing"

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu />
                </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-80">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SheetDescription className="sr-only">
                    Mobile navigation menu
                </SheetDescription>

                <div className="relative mb-6">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-8"
                    />
                </div>

                {loading ? null : (
                    <nav className="flex flex-col gap-4 text-base font-medium">
                        <Link href="/review">Write a Review</Link>
                        <Link href="/blog">Blog</Link>

                        {!isLoggedIn && (
                            <>
                                <Link href="/login">Login</Link>
                                <Link href="/register">Register</Link>
                            </>
                        )}

                        {isLoggedIn && !isBusinessUser && (
                            <>
                                <Link href="/business-login">
                                    Become a Business
                                </Link>
                                <button
                                    onClick={logout}
                                    className="text-left"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                        {isLoggedIn && isBusinessUser && (
                            <>
                                <Link href={dashboardHref}>Dashboard</Link>
                                <button
                                    onClick={logout}
                                    className="text-left"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </nav>
                )}
            </SheetContent>
        </Sheet>
    )
}
