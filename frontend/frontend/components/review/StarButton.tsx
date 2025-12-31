import { TrustpilotStar } from "../TrustpilotStar"
import { memo } from "react"

interface StarButtonProps {
    value: number
    active: boolean
    onHover: (value: number) => void
    onLeave: () => void
    onSelect: (value: number) => void
}

export const StarButton = memo(function StarButton({
    value,
    active,
    onHover,
    onLeave,
    onSelect,
}: StarButtonProps) {
    return (
        <button
            type="button"
            onMouseEnter={() => onHover(value)}
            onMouseLeave={onLeave}
            onClick={() => onSelect(value)}
            className="focus:outline-none"
            aria-label={`${value} stars`}
        >
            <TrustpilotStar
                fillPercent={active ? 1 : 0}
                color="#00B67A"
            />
        </button>
    )
})
