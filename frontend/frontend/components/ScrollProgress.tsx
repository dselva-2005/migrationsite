"use client"

import { useEffect, useRef } from "react"
import { ArrowUp } from "lucide-react"

export function ScrollProgressCircle() {
    const ringRef = useRef<SVGCircleElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const radius = 49
    const circumference = 2 * Math.PI * radius

    useEffect(() => {
        let rafId: number

        const update = () => {
            const button = buttonRef.current
            const ring = ringRef.current
            if (!button) return

            const scrollTop = window.scrollY
            const docHeight =
                document.documentElement.scrollHeight -
                window.innerHeight

            const progress =
                docHeight > 0 ? scrollTop / docHeight : 0

            /* ---------- VISIBILITY ---------- */
            if (scrollTop > 100) {
                button.style.opacity = "1"
                button.style.pointerEvents = "auto"
            } else {
                button.style.opacity = "0"
                button.style.pointerEvents = "none"
            }

            /* ---------- JS FALLBACK ---------- */
            if (
                ring &&
                !CSS.supports("animation-timeline: scroll()")
            ) {
                ring.style.strokeDashoffset = String(
                    circumference * (1 - progress)
                )
            }

            rafId = requestAnimationFrame(update)
        }

        rafId = requestAnimationFrame(update)
        return () => cancelAnimationFrame(rafId)
    }, [circumference])

    return (
        <button
            ref={buttonRef}
            onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
            }
            aria-label="Scroll to top"
            className="
                fixed bottom-6 right-6 z-50
                h-11 w-11 rounded-full
                flex items-center justify-center
                transition-opacity duration-300
                opacity-0 pointer-events-none
            "
        >
            <svg
                viewBox="-4 -4 108 108"
                className="absolute h-full w-full -rotate-90 overflow-visible"
            >
                {/* Background ring */}
                <circle
                    cx="50"
                    cy="50"
                    r="49"
                    strokeWidth="6"
                    fill="none"
                />

                {/* Progress ring */}
                <circle
                    ref={ringRef}
                    cx="50"
                    cy="50"
                    r="49"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    className="
                        stroke-red-600
                        drop-shadow-[0_0_6px_rgba(220,38,38,0.6)]
                        progress-ring
                    "
                />
            </svg>

            <ArrowUp className="relative h-5 w-5 text-red-600" />
        </button>
    )
}
