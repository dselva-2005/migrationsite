"use client"

import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function AboutSection() {
    return (
        <section
            id="about"
            className="mx-auto max-w-7xl px-4 py-6 sm:py-2 lg:py-4"
        >
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">

                {/* LEFT — IMAGE MOSAIC */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    {/* Image 1 */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                        <Image
                            src="https://migrationreviews.com/1123/wp-content/uploads/2022/02/about-1.jpg"
                            alt="Immigration consultation"
                            fill
                            priority
                            className="object-cover transition-all duration-1000 ease-in-out filter hover:grayscale-[40%] hover:brightness-90"
                        />
                    </div>

                    {/* Experience */}
                    <div className="flex aspect-[4/5] flex-col items-center justify-center rounded-2xl bg-muted text-center">
                        <span className="text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl">
                            14
                        </span>
                        <span className="mt-3 text-sm font-medium text-muted-foreground leading-tight">
                            Years of <br /> Experience
                        </span>
                    </div>

                    {/* Image 2 */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                        <Image
                            src="https://migrationreviews.com/1123/wp-content/uploads/2022/02/about-2.jpg"
                            alt="Client consultation"
                            fill
                            className="object-cover transition-all duration-1000 ease-in-out filter hover:grayscale-[40%] hover:brightness-90"
                        />
                    </div>

                    {/* Image 3 */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                        <Image
                            src="https://migrationreviews.com/1123/wp-content/uploads/2022/02/about-3.jpg"
                            alt="Immigration services"
                            fill
                            className="object-cover transition-all duration-1000 ease-in-out filter hover:grayscale-[40%] hover:brightness-90"
                        />
                    </div>
                </div>

                {/* RIGHT — CONTENT */}
                <div className="flex flex-col justify-center gap-8 lg:gap-10">
                    {/* Heading */}
                    <div className="space-y-3">
                        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                            About Immigo
                        </p>

                        <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                            Trusted Immigration <br className="hidden sm:block" />
                            Consulting Experts
                        </h2>
                    </div>

                    <Separator className="max-w-xs" />

                    {/* Highlight */}
                    <div className="flex items-start gap-4">
                        <Image
                            src="https://migrationreviews.com/1123/wp-content/themes/immigo/assets/images/icons/icon-4.png"
                            alt=""
                            width={48}
                            height={48}
                            className="shrink-0"
                        />
                        <div className="space-y-1">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                U.S. Based
                            </p>
                            <h3 className="text-lg font-semibold">
                                Immigration Consultant Agency
                            </h3>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                        All this mistaken idea of denouncing pleasure and praising pain was
                        born and will give you a complete account of the system, expound the
                        actual teachings of the great explorer of the truth, and the
                        master-builder of human happiness.
                    </p>

                    {/* CTA */}
                    <div>
                        <Button asChild size="lg" className="rounded-full px-8">
                            <Link href="/about">Learn More</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
