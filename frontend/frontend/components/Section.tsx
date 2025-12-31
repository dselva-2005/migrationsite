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
        // ✅ ENTER (from top OR bottom)
        if (entry.intersectionRatio > 0.15) {
          setActive(true)
        }

        // ✅ FULL EXIT (top OR bottom)
        if (entry.intersectionRatio === 0) {
          setActive(false)
        }
      },
      {
        threshold: [0, 0.15],
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className={cn(
        "relative py-20 sm:py-24",
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
