"use client"

import Image from "next/image"
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
                    <div>
                        <div className="mb-8 space-y-3">
                            <div className="h-4 w-32 bg-muted rounded" />
                            <div className="h-8 w-3/4 bg-muted rounded" />
                            <div className="h-4 w-full bg-muted rounded" />
                            <div className="h-4 w-5/6 bg-muted rounded" />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-background rounded-xl p-6 shadow-sm space-y-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded bg-muted" />
                                        <div className="h-5 w-32 bg-muted rounded" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-3 w-full bg-muted rounded" />
                                        <div className="h-3 w-5/6 bg-muted rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

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

    const { left, right } = section

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
        <section className="bg-muted/30">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12">

                    {/* LEFT COLUMN */}
                    <div>
                        <div className="mb-8">
                            <h6 className="text-sm font-semibold text-primary mb-2">
                                {left.section_title}
                            </h6>
                            <h2 className="text-3xl font-bold mb-4">
                                {left.heading}
                            </h2>
                            <p className="text-muted-foreground">
                                {left.description}
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {left.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-background rounded-xl p-6 shadow-sm"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <Image
                                            src={item.icon.url}
                                            alt={item.icon.alt ?? item.title}
                                            width={40}
                                            height={40}
                                        />
                                        <h4 className="font-semibold text-lg">
                                            {item.title}
                                        </h4>
                                    </div>

                                    {item.content_type === "text" && (
                                        <p className="text-sm text-muted-foreground">
                                            {item.content}
                                        </p>
                                    )}

                                    {item.content_type === "list" && (
                                        <ul className="space-y-2">
                                            {item.content.map((row, i) => (
                                                <li key={i} className="text-sm">
                                                    <span className="font-medium">
                                                        {row.label}:
                                                    </span>{" "}
                                                    {row.href ? (
                                                        <a
                                                            href={row.href}
                                                            className="text-primary hover:underline"
                                                        >
                                                            {row.value}
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            {row.value}
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN – FORM */}
                    <div className="bg-background rounded-2xl p-8 shadow-sm">
                        <div className="mb-6">
                            <h6 className="text-sm font-semibold text-primary mb-2">
                                {right.section_title}
                            </h6>
                            <h2 className="text-2xl font-bold mb-2">
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
            </div>
        </section>
    )
}
