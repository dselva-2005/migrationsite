"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
    return (
        <section className="w-full bg-muted">
            <div className="mx-auto max-w-7xl px-6 py-20">
                <div className="max-w-2xl space-y-6">
                    {/* Heading */}
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        Study In Recognized Universities!...
                    </h1>

                    {/* Description */}
                    <p className="text-muted-foreground text-base sm:text-lg">
                        We are trusted immigration consultants who can handle your case and
                        our professional registered agents will assist you with.
                    </p>

                    {/* CTA */}
                    <Button size="lg" className="gap-2">
                        More Details
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </section>
    )
}
