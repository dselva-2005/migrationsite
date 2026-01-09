"use client"

import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function Footer() {
    return (
        <footer className="dark bg-[#13181c]">
            <div className="container mx-auto px-4 py-12 text-muted-foreground">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Logo */}
                    <Card className="bg-transparent border-none">
                        <Image
                            src="/logo-light.svg"
                            alt="Logo"
                            width={166}
                            height={39}
                        />
                    </Card>

                    {/* About Us */}
                    <Card className="bg-transparent border-none">
                        <h3 className="mb-4 text-sm font-semibold text-foreground">
                            About Us
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#">About Us</Link></li>
                            <li><Link href="#">Get Support</Link></li>
                            <li><Link href="#">Terms of Use</Link></li>
                            <li><Link href="#">FAQs</Link></li>
                            <li><Link href="#">Contact Us</Link></li>
                        </ul>
                    </Card>

                    {/* Get Support */}
                    <Card className="bg-transparent border-none">
                        <h3 className="mb-4 text-sm font-semibold text-foreground">
                            Get Support
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#">Documentation</Link></li>
                            <li><Link href="#">Knowledge Base</Link></li>
                            <li><Link href="#">Commenting</Link></li>
                            <li><Link href="#">Cookie Preferences</Link></li>
                            <li><Link href="#">Privacy Policy</Link></li>
                        </ul>
                    </Card>

                    {/* Subscribe */}
                    <Card className="bg-transparent border-none">
                        <h3 className="mb-4 text-sm font-semibold text-foreground">
                            Subscribe
                        </h3>
                        <p className="mb-4 text-sm">
                            Get all updates and notifications by subscribing to our newsletter.
                        </p>
                        <form
                            className="flex flex-col gap-3"
                            onSubmit={(e) => {
                                e.preventDefault()
                                // handle submit logic here
                            }}
                        >
                            <Input type="email" placeholder="Please enter your e-mail"/>
                            <Button type="submit">Subscribe</Button>
                        </form>
                    </Card>
                </div>
            </div>

            {/* Bottom area */}
            <div className="border-t border-border">
                <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
                    © 2026 Themigration. All Rights Reserved by{" "}
                    <Link href="#" className="underline">
                        Themigration
                    </Link>
                </div>
            </div>
        </footer>
    )
}
