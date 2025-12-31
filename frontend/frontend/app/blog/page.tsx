// app/blog/page.tsx
import { blogs } from "@/lib/blog"
import { BlogList } from "@/components/blog/BlogList"
import { BlogSidebar } from "@/components/blog/BlogSidebar"
import { Section } from "@/components/Section"

export default function BlogPage() {
    return (
        <Section tone="base">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-8">
                    <main className="space-y-10">
                        <BlogList posts={blogs} />
                    </main>
                </div>
                <div className="xl:col-span-4">
                    <BlogSidebar />
                </div>
            </div>
        </Section>
    )
}
