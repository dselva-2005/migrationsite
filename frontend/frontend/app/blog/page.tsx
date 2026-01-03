// app/blog/page.tsx
import { BlogList } from "@/components/blog/BlogList"
import { BlogSidebar } from "@/components/blog/BlogSidebar"
import { Section } from "@/components/Section"
import { getBlogPosts } from "@/services/blog"

export default async function BlogPage() {
    const data = await getBlogPosts(1)

    return (
        <Section tone="base">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-8">
                    <main className="space-y-10">
                        <BlogList posts={data.results} />
                    </main>
                </div>

                <div className="xl:col-span-4">
                    <BlogSidebar />
                </div>
            </div>
        </Section>
    )
}
