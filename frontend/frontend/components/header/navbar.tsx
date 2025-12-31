"use client"

import Link from "next/link"
import { Menu, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/providers/AuthProvider"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="text-lg font-semibold">
          Migration Reviews
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <NavLinks />

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="h-9 w-56 pl-8"
            />
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  )
}


function NavLinks() {
  const { isLoggedIn, logout } = useAuth()

  return (
    <nav className="flex items-center gap-6 text-sm font-medium">
      <Link href="/review" className="hover:text-primary">
        Write a Review
      </Link>

      <Link href="/blog" className="hover:text-primary">
        Blog
      </Link>

      {!isLoggedIn ? (
        <>
          <Link href="/login" className="hover:text-primary">
            Login
          </Link>
          <Link href="/business-login" className="hover:text-primary">
            Business Login
          </Link>
        </>
      ) : (
        <button
          onClick={logout}
          className="text-sm font-medium hover:text-primary"
        >
          Logout
        </button>
      )}
    </nav>
  )
}

function MobileNav() {
  const { isLoggedIn, logout } = useAuth()

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

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="pl-8" />
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-4 text-base font-medium">
          <Link href="/review">Write a Review</Link>
          <Link href="/blog">Blog</Link>

          {!isLoggedIn ? (
            <>
              <Link href="/login">Login</Link>
              <Link href="/business-login">Business Login</Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="text-left font-medium"
            >
              Logout
            </button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
