"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Info, X } from "lucide-react"
import { toast } from "sonner"

import {
    PageContentProvider,
    usePageContent,
} from "@/providers/PageContentProvider"

/* =======================
   Types
======================= */

type FloatingButton = {
    href: string
    position?: "left" | "right"
}

type ContactField = {
    name: string
    type: "text" | "email" | "textarea"
    label: string
    required?: boolean
    max_length?: number
}

type ContactForm = {
    endpoint: string
    method: "POST" | "PUT"
    submit_label: string
    fields: ContactField[]
}

type ContactSection = {
    section_title: string
    heading: string
    description: string
    form: ContactForm
}

type ContactQuickContactBlock = {
    right: ContactSection
}

/* =======================
   Contact Modal
======================= */

function ContactModal({
    open,
    onClose,
    section,
}: {
    open: boolean
    onClose: () => void
    section: ContactSection
}) {
    const [submitting, setSubmitting] = useState(false)
    const mountedRef = useRef(true)

    /* Track mount */
    useEffect(() => {
        return () => {
            mountedRef.current = false
        }
    }, [])

    /* ✅ RESET state EVERY time modal opens */
    useEffect(() => {
        if (open) {
            setSubmitting(false)
        }
    }, [open])

    if (!open) return null

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault()
        if (submitting) return

        setSubmitting(true)

        const form = e.currentTarget
        const formData = new FormData(form)

        try {
            const res = await fetch(section.form.endpoint, {
                method: section.form.method,
                body: formData,
            })

            if (!res.ok) {
                throw new Error("Submission failed")
            }

            toast.success("Message sent successfully 🎉")

            form.reset()
            setSubmitting(false)
            onClose()
        } catch {
            if (mountedRef.current) {
                toast.error("Something went wrong", {
                    description: "Please try again later.",
                })
                setSubmitting(false)
            }
        }
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div className="relative w-full max-w-xl">
                    <div className="rounded-2xl p-10 shadow-sm bg-background">
                        <button
                            onClick={onClose}
                            className="absolute right-6 top-6 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Header */}
                        <div className="mb-6">
                            <h6 className="text-sm font-semibold text-primary mb-2">
                                {section.section_title}
                            </h6>
                            <h2 className="text-3xl font-bold mb-2">
                                {section.heading}
                            </h2>
                            <p className="text-muted-foreground">
                                {section.description}
                            </p>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            {section.form.fields.map((field) =>
                                field.type === "textarea" ? (
                                    <textarea
                                        key={field.name}
                                        name={field.name}
                                        placeholder={field.label}
                                        required={field.required}
                                        maxLength={field.max_length}
                                        className="border-input min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                                    />
                                ) : (
                                    <input
                                        key={field.name}
                                        name={field.name}
                                        type={field.type}
                                        placeholder={field.label}
                                        required={field.required}
                                        maxLength={field.max_length}
                                        className="border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
                                    />
                                )
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full h-9 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-60"
                            >
                                {submitting
                                    ? "Sending..."
                                    : section.form.submit_label}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

/* =======================
   Floating Button
======================= */

function FloatingButtonInner() {
    const { content, loading } = usePageContent()
    const [open, setOpen] = useState(false)

    if (loading || !content) return null

    const button =
        content["global.floating_button"] as
            | FloatingButton
            | undefined

    const contactBlock =
        content["contact.quick_contact"] as
            | ContactQuickContactBlock
            | undefined

    const contact = contactBlock?.right

    if (!button?.href || !contact) return null

    const side =
        button.position === "right" ? "right-6" : "left-6"

    return (
        <>
            <Link
                href={button.href}
                aria-label="Contact"
                onClick={(e) => {
                    e.preventDefault()
                    setOpen(true)
                }}
                className={`
                    fixed ${side} bottom-6 z-50
                    h-11 w-11 rounded-full
                    flex items-center justify-center
                    bg-background
                    shadow-lg
                    hover:shadow-xl
                    hover:bg-muted
                    transition
                `}
            >
                <Info className="h-5 w-5" />
            </Link>

            <ContactModal
                open={open}
                onClose={() => setOpen(false)}
                section={contact}
            />
        </>
    )
}

/* =======================
   Provider Wrapper
======================= */

export function FloatingActionButton() {
    return (
        <PageContentProvider page="global">
            <FloatingButtonInner />
        </PageContentProvider>
    )
}
