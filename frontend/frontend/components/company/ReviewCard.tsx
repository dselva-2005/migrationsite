"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrustpilotRating } from "@/components/TrustpilotRating"
import { Review } from "@/types/review"

export function ReviewCard({ review }: { review: Review }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="cursor-pointer transition hover:shadow-md">
                    <CardHeader className="space-y-2">
                        <div className="flex items-center justify-between">
                            <TrustpilotRating
                                rating={review.rating}
                                starsize={16}
                            />
                            <Badge variant="secondary">
                                {review.author}
                            </Badge>
                        </div>

                        <h3 className="font-semibold line-clamp-1">
                            {review.title}
                        </h3>
                    </CardHeader>

                    <CardContent className="text-sm text-muted-foreground line-clamp-3">
                        {review.body}
                    </CardContent>
                </Card>
            </DialogTrigger>

            {/* Modal */}
            <DialogContent className="max-w-lg pt-10">
                {/* 👆 pt-10 reserves space for close button */}

                <DialogHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                        <TrustpilotRating
                            rating={review.rating}
                            starsize={18}
                        />
                        <Badge variant="secondary">
                            {review.author}
                        </Badge>
                    </div>

                    <DialogTitle className="text-lg">
                        {review.title}
                    </DialogTitle>
                </DialogHeader>

                <div className="text-sm text-muted-foreground leading-relaxed">
                    {review.body}
                </div>

                <div className="pt-4 text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                </div>
            </DialogContent>
        </Dialog>
    )
}