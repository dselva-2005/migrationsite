"use client";

import { VisaServiceCard } from "@/components/VisaServiceCard";

interface VisaService {
    index: string;
    title: string;
    description: string;
    image: string;
    items: string[];
    href: string;
}

const visaServices: VisaService[] = [
    {
        index: "01",
        title: "Student Visa",
        description: "Foresee the pain and trouble that are bound ensue.",
        image:
            "https://migrationreviews.com/1124/wp-content/uploads/2025/08/visa-1.jpg",
        items: ["F1 Student Visa", "J1 Exchange Visitor Visa", "Non-Academic Visa"],
        href: "/visas/student",
    },
    {
        index: "02",
        title: "Residence Visa",
        description: "Desire that they can foresee trouble bound ensue.",
        image:
            "https://migrationreviews.com/1124/wp-content/uploads/2025/08/visa-2.jpg",
        items: [
            "Permanent Visa",
            "Humanitarian Residence",
            "Temporary Visa",
        ],
        href: "/visas/residence",
    },
    {
        index: "03",
        title: "Business Visa",
        description: "Equally blame belongs those who fail in their duty.",
        image:
            "https://migrationreviews.com/1124/wp-content/uploads/2025/08/visa-3.jpg",
        items: ["Business Visa", "Employment Visa", "Project Visa"],
        href: "/visas/business",
    },
    {
        index: "04",
        title: "Tourist Visa",
        description: "Sponsoring and managing work Immigration and Visa.",
        image:
            "https://migrationreviews.com/1124/wp-content/uploads/2025/08/visa-4.jpg",
        items: [
            "Marketing Visa",
            "Documents Support Visa",
            "Logical Visa",
        ],
        href: "/visas/tourist",
    },
];

export function VisaServicesSection() {
    return (
        <section className="py-4 sm:py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-4">
                {/* Heading */}
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
                        Our Services
                    </p>

                    <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Visa Solutions Built for You
                    </h2>

                    <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                        Explore migration pathways tailored to your education, career,
                        business, and travel goals.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {visaServices.map((service) => (
                        <VisaServiceCard key={service.index} {...service} />
                    ))}
                </div>
            </div>
        </section>
    );
}
