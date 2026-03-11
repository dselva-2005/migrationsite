"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type SectionProps = {
  children: React.ReactNode
  tone?: "base" | "soft" | "neutral"
}

export function Section({ children, tone = "base" }: SectionProps) {
  const ref = React.useRef<HTMLElement>(null)
  const [active, setActive] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Activate when any part is visible
        if (entry.isIntersecting) {
          setActive(true)
        } else {
          setActive(false)
        }
      },
      {
        threshold: 0, // Any visibility triggers
        // Optional: Add a small rootMargin to trigger slightly before entering
        // rootMargin: "0px 0px -10px 0px"
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className={cn(
        "relative py-5 sm:py-5",
        tone === "base" && "bg-background",
        tone === "soft" && "bg-muted/30",
        tone === "neutral" && "bg-muted/50",

        // 🔒 Default hidden
        "opacity-0 translate-y-16",

        // 🎬 Smooth, premium motion
        "transition-[opacity,transform] duration-[2000ms] ease-[cubic-bezier(0.22,1,0.36,1)]",

        // ✅ Visible
        active && "opacity-100 translate-y-0"
      )}
    >
      <div className="mx-auto max-w-7xl px-4">
        {children}
      </div>
    </section>
  )
}