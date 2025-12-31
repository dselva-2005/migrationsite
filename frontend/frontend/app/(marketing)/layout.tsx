import Hero from "@/components/Hero"

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Hero />
            <main>{children}</main>
        </>
    )
}
