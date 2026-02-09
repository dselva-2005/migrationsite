"use client"

import { useState } from "react"
import { toast } from "sonner"

import { usePageContent } from "@/providers/PageContentProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ContactQuickContactContent } from "@/types/contact"

/* ---------------- Skeleton ---------------- */

function ContactQuickContactSkeleton() {
    return (
        <section className="bg-muted/30 animate-pulse">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* LEFT SECTION REMOVED */}

                    {/* FORM SECTION */}
                    <div className="bg-background rounded-2xl p-8 shadow-sm space-y-6">
                        <div className="space-y-3">
                            <div className="h-4 w-28 bg-muted rounded" />
                            <div className="h-7 w-3/4 bg-muted rounded" />
                            <div className="h-4 w-full bg-muted rounded" />
                        </div>

                        <div className="space-y-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-10 w-full bg-muted rounded" />
                            ))}
                            <div className="h-11 w-full bg-muted rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

/* ---------------- Main Component ---------------- */

export default function ContactQuickContactSection() {
    const { content, loading } = usePageContent()
    const [submitting, setSubmitting] = useState(false)

    if (loading) return <ContactQuickContactSkeleton />
    if (!content) return null

    const section =
        content["contact.quick_contact"] as ContactQuickContactContent | undefined

    if (!section) return null

    const { right } = section

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> {
        e.preventDefault()
        if (submitting) return

        setSubmitting(true)

        const form = e.currentTarget
        const formData = new FormData(form)

        try {
            const res = await fetch(right.form.endpoint, {
                method: right.form.method,
                body: formData,
            })

            if (!res.ok) {
                throw new Error("Submission failed")
            }

            toast.success("Your message has been sent successfully 🎉")
            form.reset()
        } catch (err) {
            console.error(err)
            toast.error("Something went wrong", {
                description: "Please try again later.",
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="max-w-8xl mx-auto px-4">
            {/* FORM CONTAINER */}
            <div className="rounded-2xl p-10 shadow-sm w-full max-w-5xl mx-auto">
                <div className="mb-6">
                    <h6 className="text-sm font-semibold text-primary mb-2">
                        {right.section_title}
                    </h6>
                    <h2 className="text-3xl font-bold mb-2">
                        {right.heading}
                    </h2>
                    <p className="text-muted-foreground">
                        {right.description}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {right.form.fields.map((field) =>
                        field.type === "textarea" ? (
                            <Textarea
                                key={field.name}
                                name={field.name}
                                placeholder={field.label}
                                required={field.required}
                                maxLength={field.max_length}
                            />
                        ) : (
                            <Input
                                key={field.name}
                                type={field.type}
                                name={field.name}
                                placeholder={field.label}
                                required={field.required}
                                maxLength={field.max_length}
                            />
                        )
                    )}

                    <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full"
                    >
                        {submitting ? "Sending..." : right.form.submit_label}
                    </Button>
                </form>
            </div>
        </div>
    )

}