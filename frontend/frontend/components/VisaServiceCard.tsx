"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface VisaServiceCardProps {
    index: string
    title: string
    description: string
    image: string
    items: string[]
    href: string
    cta?: string

    /** Controlled by parent */
    imageClassName?: string
    cardClassName?: string
}

export function VisaServiceCard({
    index,
    title,
    description,
    image,
    items,
    href,
    imageClassName,
    cardClassName,
    cta
}: VisaServiceCardProps) {
    return (
        <Card
            className={cn(
                "group h-full overflow-hidden rounded-xl !p-0 transition-shadow hover:shadow-lg",
                cardClassName
            )}
        >
            {/* Image wrapper */}
            <div className="relative w-full">
                <Image
                    src={image}
                    alt={title}
                    width={600}
                    height={400}
                    className="w-full h-auto"
                />
            </div>


            {/* Content */}
            <CardContent className="flex h-75 flex-col pb-6">
                <span className="text-2xl font-bold text-primary">
                    {index}
                </span>

                <h3 className="mt-2 text-xl font-semibold leading-snug">
                    {title}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {description}
                </p>

                <ul className="mt-4 space-y-2 text-sm">
                    {items.map((item, i) => (
                        <li key={i} className="flex gap-2">
                            <span className="text-primary">→</span>
                            {item}
                        </li>
                    ))}
                </ul>

                <div className="mt-auto pt-6">
                    <Link
                        href={href}
                        className="
                            inline-flex items-center gap-2
                            text-sm font-medium text-primary
                            transition-colors hover:text-primary/80
                        "
                    >
                        {cta}
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
