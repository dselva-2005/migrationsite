// app/(marketing)/countries/[slug]/ClientPageWrapper.tsx
"use client";

import PageHero from "./hero";
import CountryServicesTabs from "./CountryServicesTabs";
import VisaPackageSection from "./VisaPackageSection";
import CountriesSidebar from "./CountriesSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ClientPageWrapperProps {
    countryName: string;
}

export default function ClientPageWrapper({ countryName }: ClientPageWrapperProps) {
    return (
        <div className="min-h-screen bg-background">
            {/* HERO with dynamic title */}
            <PageHero title={countryName} />

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* SIDEBAR - Left Column */}
                    <aside className="lg:w-1/3">
                        <Card className="border-0 shadow-0 top-6">
                            <CardContent className="p-6">
                                <CountriesSidebar />
                            </CardContent>
                        </Card>
                    </aside>

                    {/* MAIN CONTENT - Right Column */}
                    <main className="lg:w-2/3 space-y-12">
                        <section className="w-full">
                            <CountryServicesTabs />
                        </section>

                        <Separator className="my-8" />

                        <section className="w-full">
                            <VisaPackageSection />
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
}