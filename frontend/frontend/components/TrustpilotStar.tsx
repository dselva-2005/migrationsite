import { useId } from "react"
interface TrustpilotStarProps {
    fillPercent: number // 0 → 1
    color: string
    size?: number // px
}

export function TrustpilotStar({
    fillPercent,
    color,
    size = 18,
}: TrustpilotStarProps) {
    const id = useId() // ✅ unique per component
    const clamped = Math.max(0, Math.min(1, fillPercent))
    const width = clamped * 24

    const clipId = `clip-${id}`

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            aria-hidden
            className="shrink-0"
        >
            <rect
                x="0"
                y="0"
                width="24"
                height="24"
                rx="2"
                fill="#E5E7EB"
            />

            <defs>
                <clipPath id={clipId}>
                    <rect x="0" y="0" width={width} height="24" />
                </clipPath>
            </defs>

            <rect
                x="0"
                y="0"
                width="24"
                height="24"
                rx="2"
                fill={color}
                clipPath={`url(#${clipId})`}
            />

            <path
                d="M12 17.3L16.9 20.3L15.6 14.7L20 10.9L14.2 10.4L12 5L9.8 10.4L4 10.9L8.4 14.7L7.1 20.3Z"
                fill="#FFFFFF"
            />
        </svg>
    )
}
