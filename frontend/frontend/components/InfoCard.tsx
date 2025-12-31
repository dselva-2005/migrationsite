"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type InfoCardProps = {
    icon: React.ReactNode;
    title: string;
    description?: string;
    buttonText: string;
    buttonLink: string;
};

export function InfoCard({
    icon,
    title,
    description,
    buttonText,
    buttonLink,
}: InfoCardProps) {
    return (
        <Card className="w-full h-full">
            <CardHeader className="flex items-start gap-4">
                <div className="flex-shrink-0">{icon}</div>

                <CardContent className="p-0">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    )}
                    <Button asChild variant="outline" size="sm" className="mt-3">
                        <a href={buttonLink}>{buttonText} →</a>
                    </Button>
                </CardContent>
            </CardHeader>
        </Card>
    );
}
