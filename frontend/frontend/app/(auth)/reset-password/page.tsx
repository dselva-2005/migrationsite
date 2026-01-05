import { Suspense } from "react"
import ResetPasswordClient from "./ResetPasswordClient"

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="mt-24 text-center">Loading…</div>}>
            <ResetPasswordClient />
        </Suspense>
    )
}
