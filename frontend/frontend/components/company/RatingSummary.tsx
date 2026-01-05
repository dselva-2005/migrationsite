import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TrustpilotRating } from "@/components/TrustpilotRating"
import { Company } from "@/types/company"
import {
    Globe,
    Mail,
    Phone,
    MapPin,
    Calendar,
    BadgeCheck,
} from "lucide-react"

function Label({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {children}
        </p>
    )
}

export function RatingSummary({ company }: { company: Company }) {
    return (
        <aside className="lg:sticky lg:top-24 h-fit space-y-6">
            {/* ⭐ Rating Summary */}
            <Card>
                <CardHeader className="font-semibold">
                    Rating Summary
                </CardHeader>

                <CardContent className="space-y-5">
                    <TrustpilotRating
                        rating={company.rating_average}
                        reviewCount={company.rating_count}
                        starsize={22}
                    />

                    <p className="text-sm text-muted-foreground">
                        Based on {company.rating_count} reviews
                    </p>
                </CardContent>
            </Card>

            {/* 🏢 Company Details */}
            <Card>
                <CardHeader className="font-semibold flex items-center gap-2">
                    Company Details
                    {company.is_verified && (
                        <BadgeCheck className="h-4 w-4 text-green-600" />
                    )}
                </CardHeader>

                <CardContent className="space-y-4 text-sm">
                    {/* Tagline */}
                    {company.tagline && (
                        <div>
                            <Label>Tagline</Label>
                            <p className="italic text-muted-foreground">
                                {company.tagline}
                            </p>
                        </div>
                    )}

                    {/* Description */}
                    {company.description && (
                        <div>
                            <Label>About</Label>
                            <p className="leading-relaxed">
                                {company.description}
                            </p>
                        </div>
                    )}

                    {/* Address */}
                    {(company.address_line_1 || company.city) && (
                        <div>
                            <Label>Address</Label>
                            <div className="flex gap-2">
                                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                <div className="space-y-0.5">
                                    {company.address_line_1 && (
                                        <p>{company.address_line_1}</p>
                                    )}
                                    {company.address_line_2 && (
                                        <p>{company.address_line_2}</p>
                                    )}
                                    <p>
                                        {[company.city, company.state]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </p>
                                    <p>
                                        {company.postal_code}, {company.country}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Phone */}
                    {company.phone && (
                        <div>
                            <Label>Phone</Label>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{company.phone}</span>
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    {company.email && (
                        <div>
                            <Label>Email</Label>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <a
                                    href={`mailto:${company.email}`}
                                    className="hover:underline"
                                >
                                    {company.email}
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Website */}
                    {company.website && (
                        <div>
                            <Label>Website</Label>
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline truncate"
                                >
                                    {company.website.replace(/^https?:\/\//, "")}
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Joined */}
                    {company.created_at && (
                        <div>
                            <Label>Joined</Label>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    {new Date(
                                        company.created_at
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </aside>
    )
}
