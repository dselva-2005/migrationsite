"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import AuthButton from "@/components/AuthButton"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"


import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

        {/* Brand */}
        <Link href="/" className="text-lg font-semibold">
          Migration Reviews
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <DesktopNav />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

/* =========================
   Desktop (NavigationMenu)
   ========================= */

function DesktopNav() {
  return (
    <div className="flex flex-1 items-center">
      {/* LEFT: Navigation */}
      <NavigationMenu>
        <NavigationMenuList className="flex-1">

          <NavItem label="Home">
            <NavLink href="/">Default Home</NavLink>
            <NavLink href="/">Listing Home</NavLink>
            <NavLink href="/">Hosting Home</NavLink>
            <NavLink href="/">WooCommerce Home</NavLink>
          </NavItem>

          <NavItem label="Listings">
            <NavLink href="/listings">Listing List</NavLink>
            <NavLink href="/listings?view=grid">Listing Grid</NavLink>
            <NavLink href="/listing-map">Listing Map</NavLink>
            <NavLink href="/my-account">My Account</NavLink>
          </NavItem>

          <NavItem label="Hosting">
            <NavLink href="/hosting">Hosting Archive</NavLink>
            <NavLink href="/hosting/details">Hosting Details</NavLink>
          </NavItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Pages</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[700px] grid-cols-4 gap-6 p-6">
                <NavColumn title="Column 01">
                  <NavLink href="/about">About</NavLink>
                  <NavLink href="/author">Author</NavLink>
                  <NavLink href="/affiliate-product">Affiliate Product</NavLink>
                </NavColumn>
                <NavColumn title="Column 02">
                  <NavLink href="/listings">Listings</NavLink>
                  <NavLink href="/listing-map">Listing Map</NavLink>
                  <NavLink href="/my-account">My Account</NavLink>
                </NavColumn>
                <NavColumn title="Column 03">
                  <NavLink href="/team-layout-01">Team Layout 01</NavLink>
                  <NavLink href="/team-layout-02">Team Layout 02</NavLink>
                  <NavLink href="/team">Team Archive</NavLink>
                </NavColumn>
                <NavColumn title="Column 04">
                  <NavLink href="/shop">Shop</NavLink>
                  <NavLink href="/cart">Cart</NavLink>
                  <NavLink href="/my-account">My Account</NavLink>
                </NavColumn>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavItem label="Blog">
            <NavLink href="/blog-01">Blog Layout 01</NavLink>
            <NavLink href="/blog-02">Blog Layout 02</NavLink>
            <NavLink href="/blog-03">Blog Layout 03</NavLink>
          </NavItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/contact">Contact</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>

      {/* RIGHT: Search */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="relative ml-20 hidden shrink-0 lg:block"
      >
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="h-9 w-56 pl-8"
        />
      </form>
      <AuthButton />
    </div>
  )
}


/* =========================
   Mobile (Sheet)
   ========================= */

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80">
        <SheetTitle className="sr-only">
          Navigation Menu
        </SheetTitle>

        <SheetDescription className="sr-only">
          Mobile navigation links
        </SheetDescription>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mb-6"
        >
          <Input type="search" placeholder="Search..." />
        </form>
        <AuthButton />

        <nav className="mt-6 flex flex-col gap-4">
          <MobileLink href="/">Home</MobileLink>
          <MobileLink href="/listings">Listings</MobileLink>
          <MobileLink href="/hosting">Hosting</MobileLink>
          <MobileLink href="/blog">Blog</MobileLink>
          <MobileLink href="/contact">Contact</MobileLink>
        </nav>
      </SheetContent>


    </Sheet>
  )
}

/* =========================
   Helpers
   ========================= */

function NavItem({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{label}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="flex w-56 flex-col gap-1 p-4">
          {children}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}

function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className="rounded-md px-2 py-1 text-sm hover:bg-accent"
      >
        {children}
      </Link>
    </NavigationMenuLink>
  )
}

function NavColumn({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-semibold">{title}</div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  )
}

function MobileLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="text-base font-medium"
    >
      {children}
    </Link>
  )
}
