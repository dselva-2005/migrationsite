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
    const clamped = Math.max(0, Math.min(1, fillPercent))
    const boxSize = 24
    const scale = size / boxSize
    const width = clamped * boxSize

    const clipId = `clip-${width}-${size}`

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            aria-hidden
            className="shrink-0"
        >
            {/* Empty background */}
            <rect
                x="0"
                y="0"
                width="24"
                height="24"
                rx="2"
                fill="#E5E7EB"
            />

            {/* Clip */}
            <defs>
                <clipPath id={clipId}>
                    <rect x="0" y="0" width={width} height="24" />
                </clipPath>
            </defs>

            {/* Filled background */}
            <rect
                x="0"
                y="0"
                width="24"
                height="24"
                rx="2"
                fill={color}
                clipPath={`url(#${clipId})`}
            />

            {/* White star */}
            <path
                d="M12 17.3L16.9 20.3L15.6 14.7L20 10.9L14.2 10.4L12 5L9.8 10.4L4 10.9L8.4 14.7L7.1 20.3Z"
                fill="#FFFFFF"
            />
        </svg>
    )
}
