"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { BlogCategory } from "@/services/blog"

type Props = {
    categories: BlogCategory[]
}

export function BlogSidebar({ categories }: Props) {
    return (
        <aside className="space-y-8 sticky top-24">
            <Card className="p-5 space-y-3">
                <h3 className="font-semibold">Categories</h3>

                <ul className="space-y-2 text-sm text-muted-foreground">
                    {categories.map((cat) => (
                        <li key={cat.id}>
                            <Link
                                href={`#`}
                                className="flex justify-between hover:text-foreground"
                            >
                                <span>{cat.name}</span>
                                <span className="text-xs">
                                    {cat.post_count}
                                </span>
                            </Link>
                        </li>
                    ))}

                    {categories.length === 0 && (
                        <li className="text-xs text-muted-foreground">
                            No categories
                        </li>
                    )}
                </ul>
            </Card>
        </aside>
    )
}
