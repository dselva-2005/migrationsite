"use client"
import { Card } from "@/components/ui/card"

export function BlogSidebar() {
    return (
        <aside className="space-y-8 sticky top-24">

            <Card className="p-5 space-y-3">
                <h3 className="font-semibold">Categories</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Burgers</li>
                    <li>Pizza</li>
                    <li>Sandwich</li>
                    <li>Health</li>
                </ul>
            </Card>
        </aside>
    )
}
