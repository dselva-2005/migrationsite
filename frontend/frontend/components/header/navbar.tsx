"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, ChevronRight } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/AuthProvider"
import { GlobalSearch } from "@/components/GlobalSearch"
import { usePageContent } from "@/providers/PageContentProvider"

import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"

/* ---------------------------------- */
/* Data */
/* ---------------------------------- */

// const COUNTRIES = [
//     {
//         href: "/countries/united-states",
//         label: "United States"
//     },
//     {
//         href: "/countries/australia",
//         label: "Australia"
//     },
//     {
//         href: "/countries/canada",
//         label: "Canada"
//     },
//     {
//         href: "/countries/uae",
//         label: "United Arab Emirates"
//     },
//     {
//         href: "/countries/uk",
//         label: "United Kingdom"
//     },
//     {
//         href: "/countries/south-africa",
//         label: "South Africa"
//     },
//     {
//         href: "/countries/bahamas",
//         label: "The Bahamas"
//     }
// ]

const VISAS = [
    {
        slug: "student-visa",
        label: "Student Visa"
    },
    {
        slug: "residence-visa",
        label: "Residence Visa"
    },
    {
        slug: "business-visa",
        label: "Business Visa"
    },
    {
        slug: "tourist-visa",
        label: "Tourist Visa"
    },
    {
        slug: "conference-visa",
        label: "Conference Visa"
    },
    {
        slug: "medical-visa",
        label: "Medical Visa"
    }
]

/* ---------------------------------- */
/* Types */
/* ---------------------------------- */

interface BrandData {
    href: string;
    logo?: string;
    name?: string;
}

/* ---------------------------------- */
/* Mobile Nav (Hamburger) - Fixed Version */
/* ---------------------------------- */

function MobileNav() {
    const { user, isLoggedIn, loading, logout } = useAuth()
    const [openSection, setOpenSection] = useState<string | null>(null)

    const companies = user?.companies ?? []
    const isBusinessUser = companies.length > 0
    const dashboardHref =
        companies.length === 1
            ? `/listing/${companies[0].companySlug}/account`
            : "/listing"

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section)
    }

    return (
        <Sheet>
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
                        <Link href="/" className="py-3 px-6 border-b hover:bg-gray-50">
                            Home
                        </Link>
                        <Link href="/about" className="py-3 px-6 border-b hover:bg-gray-50">
                            About
                        </Link>
                        <Link href="/contact" className="py-3 px-6 border-b hover:bg-gray-50">
                            Contact
                        </Link>
                        <Link href="/review" className="py-3 px-6 border-b hover:bg-gray-50">
                            review
                        </Link>
                        <Link href="/blog" className="py-3 px-6 border-b hover:bg-gray-50">
                            Blog
                        </Link>
                        <Link href="/listing" className="py-3 px-6 border-b hover:bg-gray-50">
                            Listing
                        </Link>

                        {/* Countries Expandable Section */}
                        {/* <div className="border-b">
                            <button
                                onClick={() => toggleSection('countries')}
                                className="flex items-center justify-between w-full py-3 px-6 hover:bg-gray-50"
                            >
                                <span className="font-medium">Countries</span>
                                <ChevronRight
                                    className={`h-4 w-4 transition-transform ${openSection === 'countries' ? 'rotate-90' : ''}`}
                                />
                            </button>

                            {openSection === 'countries' && (
                                <div className="bg-gray-50">
                                    {COUNTRIES.map((country) => (
                                        <Link
                                            key={country.href}
                                            href={country.href}
                                            className="block py-2 px-10 hover:bg-gray-100 text-gray-700"
                                        >
                                            {country.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div> */}

                        {/* Visa Expandable Section */}
                        <div className="border-b">
                            <button
                                onClick={() => toggleSection('visa')}
                                className="flex items-center justify-between w-full py-3 px-6 hover:bg-gray-50"
                            >
                                <span className="font-medium">Visa Types</span>
                                <ChevronRight
                                    className={`h-4 w-4 transition-transform ${openSection === 'visa' ? 'rotate-90' : ''}`}
                                />
                            </button>

                            {openSection === 'visa' && (
                                <div className="bg-gray-50">
                                    {VISAS.map((visa) => (
                                        <Link
                                            key={visa.slug}
                                            href={`/visa/${visa.slug}`}
                                            className="block py-2 px-10 hover:bg-gray-100 text-gray-700"
                                        >
                                            {visa.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Auth Links */}
                        <div className="mt-4 px-6">
                            {!isLoggedIn ? (
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href="/login"
                                        className="py-2 px-4 rounded border text-center hover:bg-gray-50"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="py-2 px-4 rounded bg-primary text-white text-center hover:bg-primary/90"
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
                                                className="py-2 px-4 rounded border text-center hover:bg-gray-50"
                                            >
                                                Become a Business
                                            </Link>
                                            <Link
                                                href="/profile"
                                                className="py-2 px-4 rounded border text-center hover:bg-gray-50"
                                            >
                                                Profile
                                            </Link>
                                            <button
                                                onClick={logout}
                                                className="py-2 px-4 rounded border text-center hover:bg-gray-50"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <Link
                                                href={dashboardHref}
                                                className="py-2 px-4 rounded border text-center hover:bg-gray-50"
                                            >
                                                Dashboard
                                            </Link>
                                            <Link
                                                href="/profile"
                                                className="py-2 px-4 rounded border text-center hover:bg-gray-50"
                                            >
                                                Profile
                                            </Link>
                                            <button
                                                onClick={logout}
                                                className="py-2 px-4 rounded border text-center hover:bg-gray-50"
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
                <div className="relative h-8 w-40">
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
/* Navbar (Main Component) */
/* ---------------------------------- */

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b bg-background">
            <div className="mx-auto max-w-8xl flex h-16 lg:px-10 xl:px-14 items-center px-4 gap-4">

                {/* Brand - Now gets data from context */}
                <Brand />

                {/* Desktop Nav (ONLY on large screens) */}
                <div className="hidden lg:flex flex-1 justify-center">
                    <NavLinks />
                </div>

                {/* Desktop Search */}
                <div className="hidden md:flex items-center gap-3 ml-auto">
                    <div className="w-56 xl:w-72">
                        <GlobalSearch />
                    </div>

                    {/* Tablet hamburger */}
                    <div className="lg:hidden">
                        <MobileNav />
                    </div>
                </div>

                {/* Mobile hamburger */}
                <div className="md:hidden ml-auto">
                    <MobileNav />
                </div>
            </div>

            {/* Mobile search */}
            <div className="md:hidden border-t px-4 py-2 bg-background">
                <GlobalSearch />
            </div>
        </header>
    )
}

/* ---------------------------------- */
/* Desktop Links (Unchanged from previous) */
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
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/review">review</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/listing">Listing</Link>

            {/* Countries Hover Dropdown */}
            {/* <div className="relative group">
                <button className="flex items-center hover:text-primary transition-colors py-2">
                    Countries
                    <svg
                        className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <div className="absolute left-0 top-full hidden group-hover:block bg-white border rounded-md shadow-lg min-w-[200px] pt-2 z-50">
                    <div className="py-1">
                        {COUNTRIES.map((country) => (
                            <Link
                                key={country.href}
                                href={country.href}
                                className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                            >
                                {country.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div> */}

            {/* Visa Hover Dropdown */}
            <div className="relative group">
                <button className="flex items-center hover:text-primary transition-colors py-2">
                    Visa
                    <svg
                        className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <div className="absolute left-0 top-full hidden group-hover:block bg-white border rounded-md shadow-lg min-w-[180px] pt-2 z-50">
                    <div className="py-1">
                        {VISAS.map((visa) => (
                            <Link
                                key={visa.slug}
                                href={`/visa/${visa.slug}`}
                                className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                            >
                                {visa.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

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