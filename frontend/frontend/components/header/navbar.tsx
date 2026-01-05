"use client"

import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/AuthProvider"
import { GlobalSearch } from "@/components/GlobalSearch"

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
            {/* Top row: Brand + Hamburger */}
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                <Link href="/" className="text-lg font-semibold">
                    Migration Reviews
                </Link>

                {/* Desktop */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLinks />
                    <div className="w-72">
                        <GlobalSearch />
                    </div>
                </div>

                {/* Mobile hamburger only */}
                <div className="md:hidden">
                    <MobileNav />
                </div>
            </div>

            {/* Mobile search bar full width, below top row */}
            <div className="md:hidden border-t border-gray-200 px-4 py-2 bg-background">
                <GlobalSearch />
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
    const dashboardHref =
        companies.length === 1
            ? `/listing/${companies[0].companySlug}/account`
            : "/listing"

    return (
        <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/review">Write a Review</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/listing">Listing</Link>

            {!isLoggedIn && (
                <>
                    <Link href="/login">Login</Link>
                    <Link href="/register">Register</Link>
                </>
            )}

            {isLoggedIn && !isBusinessUser && (
                <>
                    <Link href="/business-login">Become a Business</Link>
                    <button onClick={logout}>Logout</button>
                </>
            )}

            {isLoggedIn && isBusinessUser && (
                <>
                    <Link href={dashboardHref}>Dashboard</Link>
                    <button onClick={logout}>Logout</button>
                </>
            )}

            {isLoggedIn && <Link href="/profile">Profile</Link>}
        </nav>
    )
}

/* ---------------------------------- */
/* Mobile Nav (Hamburger) */
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

            <SheetContent side="right" className="w-80 p-6">
                <SheetTitle className="text-lg font-semibold mb-4">Menu</SheetTitle>
                <SheetDescription className="sr-only">
                    Mobile navigation menu
                </SheetDescription>

                {loading ? null : (
                    <nav className="flex flex-col gap-4 text-base font-medium">
                        <Link href="/review" className="py-2 px-2 rounded hover:bg-gray-100">
                            Write a Review
                        </Link>
                        <Link href="/blog" className="py-2 px-2 rounded hover:bg-gray-100">
                            Blog
                        </Link>
                        <Link href="/listing" className="py-2 px-2 rounded hover:bg-gray-100">
                            Listing
                        </Link>

                        {!isLoggedIn && (
                            <>
                                <Link href="/login" className="py-2 px-2 rounded hover:bg-gray-100">
                                    Login
                                </Link>
                                <Link href="/register" className="py-2 px-2 rounded hover:bg-gray-100">
                                    Register
                                </Link>
                            </>
                        )}

                        {isLoggedIn && !isBusinessUser && (
                            <>
                                <Link href="/business-login" className="py-2 px-2 rounded hover:bg-gray-100">
                                    Become a Business
                                </Link>
                                <button
                                    onClick={logout}
                                    className="py-2 px-2 text-left rounded hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                        {isLoggedIn && isBusinessUser && (
                            <>
                                <Link href={dashboardHref} className="py-2 px-2 rounded hover:bg-gray-100">
                                    Dashboard
                                </Link>
                                <button
                                    onClick={logout}
                                    className="py-2 px-2 text-left rounded hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                        {isLoggedIn && !isBusinessUser && (
                            <Link href="/profile" className="py-2 px-2 rounded hover:bg-gray-100">
                                Profile
                            </Link>
                        )}
                    </nav>
                )}
            </SheetContent>
        </Sheet>
    )
}
