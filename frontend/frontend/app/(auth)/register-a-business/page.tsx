import { Metadata } from "next"
import RegisterBusinessForm from "@/components/RegisterBusinessForm"

export const metadata: Metadata = {
    title: "Register Your Business",
    description: "Submit your company details to get listed on Migration Reviews.",
}

export default function RegisterBusinessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <RegisterBusinessForm />
        </div>
    )
}
