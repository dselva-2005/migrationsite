"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/AuthProvider"
import { usePageContent } from "@/providers/PageContentProvider"

import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"

/* ---------------------------------- */
/* Types */
/* ---------------------------------- */

interface BrandData {
    href: string;
    logo?: string;
    name?: string;
}

/* ---------------------------------- */
/* Styling Constants */
/* ---------------------------------- */

const navLinkStyles = "text-sm font-medium hover:text-gray-900 transition-colors"
const reviewButtonStyles = "text-sm font-medium text-white bg-primary hover:bg-primary/90 py-2 px-4 rounded-md transition-colors"

/* ---------------------------------- */
/* Mobile Nav (Hamburger) - Fixed Version */
/* ---------------------------------- */

function MobileNav() {
    const { user, isLoggedIn, loading, logout } = useAuth()
    const [openSection, setOpenSection] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const companies = user?.companies ?? []
    const isBusinessUser = companies.length > 0
    const dashboardHref =
        companies.length === 1
            ? `/listing/${companies[0].companySlug}/account`
            : "/listing"

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section)
    }

    const handleLinkClick = () => {
        setIsOpen(false)
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu />
                </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-80 p-0 overflow-y-auto">
                <div className="p-6">
                    <SheetTitle className="text-lg font-semibold mb-4">Menu</SheetTitle>
                    <SheetDescription className="sr-only">
                        Mobile navigation menu
                    </SheetDescription>
                </div>

                {loading ? null : (
                    <nav className="flex flex-col">
                        {/* Main Navigation Items */}
                        <Link href="/" className="py-3 px-6 border-b hover:bg-gray-50 text-sm font-medium" onClick={handleLinkClick}>
                            Home
                        </Link>
                        <Link href="/about" className="py-3 px-6 border-b hover:bg-gray-50 text-sm font-medium" onClick={handleLinkClick}>
                            About
                        </Link>
                        <Link href="/contact" className="py-3 px-6 border-b hover:bg-gray-50 text-sm font-medium" onClick={handleLinkClick}>
                            Contact
                        </Link>
                        <Link href="/review" className="py-3 px-6 border-b hover:bg-gray-50 font-medium text-primary" onClick={handleLinkClick}>
                            Write a Review
                        </Link>
                        <Link href="/blog" className="py-3 px-6 border-b hover:bg-gray-50 text-sm font-medium" onClick={handleLinkClick}>
                            Blog
                        </Link>
                        <Link
                            href="/register-a-business" className="py-3 px-6 border-b hover:bg-gray-50 text-sm font-medium" onClick={handleLinkClick}>
                            Register a Business
                        </Link>

                        {/* Auth Links */}
                        <div className="mt-4 px-6">
                            {!isLoggedIn ? (
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href="/login"
                                        className="py-2 px-4 rounded border text-center hover:bg-gray-50 text-sm font-medium"
                                        onClick={handleLinkClick}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="py-2 px-4 rounded bg-primary text-white text-center hover:bg-primary/90 text-sm font-medium"
                                        onClick={handleLinkClick}
                                    >
                                        Register
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    {!isBusinessUser ? (
                                        <div className="flex flex-col gap-3">
                                            <Link
                                                href="/business-login"
                                                className="py-2 px-4 rounded border text-center hover:bg-gray-50 text-sm font-medium"
                                                onClick={handleLinkClick}
                                            >
                                                Become a Business
                                            </Link>
                                            <Link
                                                href="/profile"
                                                className="py-2 px-4 rounded border text-center hover:bg-gray-50 text-sm font-medium"
                                                onClick={handleLinkClick}
                                            >
                                                Profile
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    logout()
                                                    handleLinkClick()
                                                }}
                                                className="py-2 px-4 rounded border text-center hover:bg-gray-50 text-sm font-medium"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <Link
                                                href={dashboardHref}
                                                className="py-2 px-4 rounded border text-center hover:bg-gray-50 text-sm font-medium"
                                                onClick={handleLinkClick}
                                            >
                                                Dashboard
                                            </Link>
                                            <Link
                                                href="/profile"
                                                className="py-2 px-4 rounded border text-center hover:bg-gray-50 text-sm font-medium"
                                                onClick={handleLinkClick}
                                            >
                                                Profile
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    logout()
                                                    handleLinkClick()
                                                }}
                                                className="py-2 px-4 rounded border text-center hover:bg-gray-50 text-sm font-medium"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>
                )}
            </SheetContent>
        </Sheet>
    )
}

/* ---------------------------------- */
/* Brand Logo/Name Component */
/* ---------------------------------- */

function Brand() {
    // Get content from PageContentProvider context
    const { content, loading } = usePageContent()

    // Extract brand data from content
    const brandData = content?.["navbar.brand"] as BrandData | undefined

    if (loading) {
        // Show loading skeleton
        return (
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
        )
    }

    const defaultBrand: BrandData = {
        href: "/",
        name: "Migration Reviews"
    }

    const brand = brandData || defaultBrand

    return (
        <Link href={brand.href} className="flex items-center shrink-0">
            {brand.logo ? (
                <div className="relative h-20 w-70">
                    <Image
                        src={brand.logo}
                        alt={brand.name || "Brand Logo"}
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            ) : brand.name ? (
                <span className="text-lg font-semibold">
                    {brand.name}
                </span>
            ) : (
                <span className="text-lg font-semibold">
                    Migration Reviews
                </span>
            )}
        </Link>
    )
}

/* ---------------------------------- */
/* Auth Actions Component (Desktop) */
/* ---------------------------------- */

function AuthActions() {
    const { user, isLoggedIn, logout } = useAuth()

    const companies = user?.companies ?? []
    const isBusinessUser = companies.length > 0
    const dashboardHref =
        companies.length === 1
            ? `/listing/${companies[0].companySlug}/account`
            : "/listing"

    if (!isLoggedIn) {
        return (
            <div className="flex items-center gap-3">
                <Link
                    href="/login"
                    className={navLinkStyles}
                >
                    Login
                </Link>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-3">
            {!isBusinessUser ? (
                <Link
                    href="/business-login"
                    className={navLinkStyles}
                >
                    Become a Business
                </Link>
            ) : (
                <Link
                    href={dashboardHref}
                    className={navLinkStyles}
                >
                    Dashboard
                </Link>
            )}
            <button
                onClick={logout}
                className={`${navLinkStyles} cursor-pointer`}
            >
                Logout
            </button>
        </div>
    )
}

/* ---------------------------------- */
/* Desktop Links (Simplified) */
/* ---------------------------------- */

function NavLinks() {
    return (
        <nav className="flex items-center gap-6">
            <Link href="/" className={navLinkStyles}>Home</Link>
            <Link href="/about" className={navLinkStyles}>About</Link>
            <Link href="/contact" className={navLinkStyles}>Contact</Link>
            <Link href="/blog" className={navLinkStyles}>Blog</Link>
            <Link href="/register-a-business" className={navLinkStyles}>Register a Business</Link>
        </nav>
    )
}

/* ---------------------------------- */
/* Navbar (Main Component) */
/* ---------------------------------- */

export default function Navbar() {
    const { isLoggedIn } = useAuth()

    return (
        <header className="sticky top-0 z-50 border-b bg-background">
            <div className="mx-auto max-w-8xl flex h-16 lg:px-10 xl:px-14 items-center px-4 gap-4">

                {/* Brand - Now gets data from context */}
                <Brand />

                {/* Desktop Nav (ONLY on large screens) */}
                <div className="hidden lg:flex flex-1 justify-center">
                    <NavLinks />
                </div>

                {/* Right side actions - Desktop */}
                <div className="hidden lg:flex items-center gap-4 ml-auto">
                    {/* Review button always visible on desktop */}
                    <Link
                        href="/review"
                        className={reviewButtonStyles}
                    >
                        Write a Review
                    </Link>

                    {/* Auth buttons/actions */}
                    <AuthActions />

                    {/* Profile link if logged in */}
                    {isLoggedIn && (
                        <Link href="/profile" className={navLinkStyles}>
                            Profile
                        </Link>
                    )}
                </div>

                {/* Tablet/Mobile hamburger */}
                <div className="lg:hidden ml-auto">
                    <MobileNav />
                </div>
            </div>

        </header>
    )
}