"use client"

import { useState } from "react";
import Image from "next/image";
import { usePageContent } from "@/providers/PageContentProvider";

import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* =======================
   TYPES
======================= */

type ServiceItem = {
    id: string;
    label: string;
    image: string;
    link: string;
};

type ServicesIncluded = {
    title: string;
    description: string;
    services: ServiceItem[];
};

type VisaPackageContent = {
    heading: string;
    description: string;
    image: string;
};

type VisaPackageTab = {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
    content: VisaPackageContent;
};

type VisaPackage = {
    title: string;
    description: string;
    tabs: VisaPackageTab[];
};

type PageContentShape = {
    visa_package?: VisaPackage;
    services_included?: ServicesIncluded;
};

/* =======================
   COMPONENT
======================= */

export default function VisaPackageSection() {
    // Always call hooks at the top level, before any conditionals
    const [activeTab, setActiveTab] = useState<string>("");
    
    const { content } = usePageContent() as {
        content: PageContentShape | null;
        loading?: boolean;
        error?: Error;
    };

    // Handle loading or missing content
    if (!content) {
        return (
            <div className="space-y-16 px-4 sm:px-6">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="h-10 w-64 bg-muted animate-pulse rounded" />
                        <div className="h-6 w-full bg-muted animate-pulse rounded" />
                    </div>
                </div>
            </div>
        );
    }

    const visaPackage = content?.visa_package;
    const servicesIncluded = content?.services_included;
    const tabs = visaPackage?.tabs || [];

    // Update activeTab if it's empty and tabs exist
    if (activeTab === "" && tabs.length > 0) {
        setActiveTab(tabs[0].id);
    }

    // Show loading state if data is not available
    if (!visaPackage || !servicesIncluded) {
        return (
            <div className="space-y-16 px-4 sm:px-6">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="h-10 w-64 bg-muted animate-pulse rounded" />
                        <div className="h-6 w-full bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-64 bg-muted animate-pulse rounded-lg" />
                </div>
            </div>
        );
    }

    // If no tabs, show a message
    if (tabs.length === 0) {
        return (
            <div className="space-y-16 px-4 sm:px-6">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-2xl sm:text-3xl font-bold">{visaPackage.title}</h2>
                        <p className="text-base sm:text-lg text-muted-foreground">
                            {visaPackage.description}
                        </p>
                    </div>
                    <p className="text-muted-foreground">No visa packages available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-16 px-4 sm:px-6">

            {/* VISA PACKAGE */}
            <div className="space-y-8">
                <div className="space-y-4">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{visaPackage.title}</h2>
                    <p className="text-base sm:text-lg text-muted-foreground">
                        {visaPackage.description}
                    </p>
                </div>

                <Tabs 
                    value={activeTab} 
                    onValueChange={setActiveTab} 
                    className="w-full"
                >
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        
                        {/* LEFT — TABS */}
                        <div className="w-full lg:w-1/3">
                            <TabsList className="flex flex-wrap sm:flex-nowrap lg:flex-col gap-2 p-2 bg-background border rounded-lg w-full h-fit">
                                {tabs.map((tab) => (
                                    <TabsTrigger
                                        key={tab.id}
                                        value={tab.id}
                                        className="flex-1 lg:flex-none justify-start gap-2 p-3 lg:p-4 text-left data-[state=active]:bg-accent min-w-0"
                                    >
                                        <div className="flex items-center gap-2 lg:gap-3 w-full">
                                            <i className={`${tab.icon} text-sm lg:text-base flex-shrink-0`} />
                                            <div className="text-left flex-1 min-w-0">
                                                <div className="font-medium text-xs sm:text-sm lg:text-base truncate">
                                                    {tab.title}
                                                </div>
                                                <div className="text-xs lg:text-sm text-muted-foreground truncate">
                                                    {tab.subtitle}
                                                </div>
                                            </div>
                                        </div>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        {/* RIGHT — CONTENT */}
                        <div className="w-full lg:w-2/3">
                            {tabs.map((tab) => (
                                <TabsContent 
                                    key={tab.id} 
                                    value={tab.id} 
                                    className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in"
                                >
                                    <Card className="overflow-hidden p-0">
                                        <div className="relative h-48 sm:h-56 md:h-64 w-full">
                                            <Image
                                                src={tab.content.image}
                                                alt={tab.content.heading}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
                                            />
                                        </div>
                                        <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                                            <h3 className="text-xl sm:text-2xl font-bold">
                                                {tab.content.heading}
                                            </h3>
                                            <p className="text-sm sm:text-base text-muted-foreground">
                                                {tab.content.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            ))}
                        </div>
                    </div>
                </Tabs>
            </div>

            {/* SERVICES INCLUDED */}
            <div className="space-y-8">
                <div className="space-y-4">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{servicesIncluded.title}</h2>
                    <p className="text-base sm:text-lg text-muted-foreground">
                        {servicesIncluded.description}
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    {servicesIncluded.services.map((service) => (
                        <Card 
                            key={service.id} 
                            className="text-center hover:shadow-md transition-shadow duration-200"
                        >
                            <CardContent>
                                <div className="flex justify-center mb-2 sm:mb-3">
                                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
                                        <Image
                                            src={service.image}
                                            alt={service.label}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                                <h6 className="font-semibold text-xs sm:text-sm md:text-base mb-2">{service.label}</h6>
                                <Button 
                                    asChild 
                                    variant="ghost" 
                                    size="sm" 
                                    className="w-full text-xs sm:text-sm h-7 sm:h-8"
                                >
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

        </div>
    );
}