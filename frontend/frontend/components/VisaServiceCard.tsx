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
}: VisaServiceCardProps) {
    return (
        <Card
            className={cn(
                "group h-full overflow-hidden rounded-xl p-0 transition-shadow hover:shadow-lg",
                cardClassName
            )}
        >
            {/* Image wrapper */}
            <div
                className={cn(
                    "relative w-full aspect-[3/3] overflow-hidden",
                    imageClassName
                )}
            >
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                    className="
                        object-cover
                        transition-transform
                        duration-500
                        ease-out
                        group-hover:scale-110
                    "
                />

                {/* Optional subtle overlay */}
                <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/5" />
            </div>

            {/* Content */}
            <CardContent className="flex h-75 flex-col p-6">
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
                        Read More →
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
