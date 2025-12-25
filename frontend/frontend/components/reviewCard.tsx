import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { StarRating } from "./star-rating";

type ReviewCardProps = {
    reviewerName: string;
    reviewerAvatar?: string; // optional, fallback will be initials
    rating: number;
    reviewText: string;
    businessName: string;
    businessLogo?: string;
    businessLink: string;
    businessWebsite?: string;
};

export function ReviewCard({
    reviewerName,
    reviewerAvatar,
    rating,
    reviewText,
    businessName,
    businessLogo,
    businessLink,
    businessWebsite,
}: ReviewCardProps) {
    // derive initials for fallback safely
    const initials = reviewerName
        ? reviewerName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "NA"; // fallback initials if name is missing

    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="flex flex-row items-start gap-3">
                <Avatar className="h-9 w-9">
                    {reviewerAvatar ? (
                        <AvatarImage src={reviewerAvatar} />
                    ) : (
                        <AvatarFallback>{initials}</AvatarFallback>
                    )}
                </Avatar>

                <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold">{reviewerName || "Anonymous"}</p>
                    <StarRating value={rating || 0} />
                </div>
            </CardHeader>

            <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {reviewText || "No review provided."}
            </CardContent>

            <CardFooter className="flex items-center gap-3 border-t pt-4">
                {businessLogo && (
                    <Image
                        src={businessLogo}
                        alt={businessName || "Business"}
                        width={32}
                        height={24}
                        className="rounded-sm"
                    />
                )}

                <div className="flex flex-col">
                    <Link href={businessLink || "#"} className="text-sm font-medium hover:underline">
                        {businessName || "Unknown Business"}
                    </Link>
                    {businessWebsite && (
                        <span className="text-xs text-muted-foreground">{businessWebsite}</span>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
