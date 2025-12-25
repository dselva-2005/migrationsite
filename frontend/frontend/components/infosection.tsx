import { InfoCard } from "./allinonecard"
import { InfoCardCarousel } from "./infocardcarousel"
import { ShieldCheck, Globe, FileText } from "lucide-react"

export default function InfoSection() {
    return (
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
    )
}
