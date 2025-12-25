"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollProgressCircle() {
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;

            const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

            setProgress(scrollPercent);
            setVisible(scrollTop > 100); // show only after scrolling
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const radius = 49;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - progress * circumference;

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!visible) return null;

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-6 right-6 z-50 h-10 w-10 rounded-full bg-background shadow-lg flex items-center justify-center hover:scale-105 transition"
        >
            <svg
                viewBox="-1 -1 102 102"
                className="absolute h-full w-full rotate-[-90deg]"
            >
                {/* background ring */}
                <path
                    d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
                    className="stroke-muted"
                    strokeWidth="5"
                    fill="none"
                />

                {/* progress ring */}
                <path
                    d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
                    stroke="currentColor"
                    strokeWidth="5"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="text-primary transition-[stroke-dashoffset] duration-75 ease-linear"
                />
            </svg>

            {/* center arrow */}
            <ArrowUp className="relative h-5 w-5 text-primary" />
        </button>
    );
}
