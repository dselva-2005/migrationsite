// app/(marketing)/countries/[slug]/page.tsx
import { notFound } from "next/navigation";

// Extract valid slugs
const VALID_COUNTRY_SLUGS = [
    "united-states",
    "australia",
    "canada",
    "uae",
    "uk",
    "south-africa",
    "bahamas",
    "new-zealand",
    "germany",
    "ierland",
    "portugal",
    "spain",
    "slovenia",
    "romania",
];

// Map slugs to display names
const COUNTRY_DISPLAY_NAMES: Record<string, string> = {
    "united-states": "United States",
    "australia": "Australia",
    "canada": "Canada",
    "uae": "United Arab Emirates",
    "uk": "United Kingdom",
    "south-africa": "South Africa",
    "bahamas": "The Bahamas",
    "new-zealand": "New Zealand",
    "germany": "Germany",
    "ierland": "Ierland",
    "portugal": "Portugal",
    "spain": "Spain",
    "slovenia": "Slovenia",
    "romania": "Romania",
};

function getCountryName(slug: string): string {
    return COUNTRY_DISPLAY_NAMES[slug] || slug
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

// Make this an async function and await params
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    // Await the params promise
    const { slug } = await params;
    
    console.log("DEBUG - Slug:", slug);
    
    if (!VALID_COUNTRY_SLUGS.includes(slug)) {
        console.log("DEBUG - Slug not in valid list:", slug);
        notFound();
    }
    
    const countryName = getCountryName(slug);
    console.log("DEBUG - Country name:", countryName);

    // Now import the client components dynamically
    const PageContentProvider = (await import("@/providers/PageContentProvider")).PageContentProvider;
    const ClientPageWrapper = (await import("./ClientPageWrapper")).default;

    return (
        <PageContentProvider page="countries" country={slug}>
            <ClientPageWrapper countryName={countryName} />
        </PageContentProvider>
    );
}