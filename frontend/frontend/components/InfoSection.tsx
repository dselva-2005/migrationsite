import { InfoCard } from "./InfoCard"
import { InfoCardCarousel } from "./InfoCardCarousel"
import { ShieldCheck, Globe, FileText } from "lucide-react"

export default function InfoSection() {
    return (
        <div className="py-4">

            <div className="mb-12 text-center">
                {/* Eyebrow / Subtitle */}
                <p className="mb-3 text-sm font-medium tracking-widest text-primary/80 uppercase">
                    Welcome to Immigo
                </p>

                {/* Main Heading */}
                <h2 className="mx-auto max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-4xl">
                    A One-Stop Solution For All{" "}
                    <span className="text-primary">Your Visa Needs</span>
                </h2>
            </div>

            <InfoCardCarousel>
                <InfoCard
                    icon={<ShieldCheck className="h-8 w-8 text-red-500" />}
                    title="Visa Expiring or Expired"
                    description="Understand your options and next steps."
                    buttonText="Online Services"
                    buttonLink="#"
                />

                <InfoCard
                    icon={<Globe className="h-8 w-8 text-blue-500" />}
                    title="Immigration Support"
                    description="Guidance from registered professionals."
                    buttonText="Get Help"
                    buttonLink="#"
                />

                <InfoCard
                    icon={<FileText className="h-8 w-8 text-green-500" />}
                    title="Document Review"
                    description="Ensure your paperwork is correct."
                    buttonText="Start Review"
                    buttonLink="#"
                />

                <InfoCard
                    icon={<ShieldCheck className="h-8 w-8 text-purple-500" />}
                    title="Legal Compliance"
                    description="Stay compliant with current laws."
                    buttonText="Learn More"
                    buttonLink="#"
                />
            </InfoCardCarousel>
        </div>
    )
}
