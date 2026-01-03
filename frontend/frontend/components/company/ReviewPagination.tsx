import { Button } from "@/components/ui/button"

interface ReviewPaginationProps {
    page: number
    total: number
    pageSize: number
    onPageChange: (page: number) => void
}

export function ReviewPagination({
    page,
    total,
    pageSize,
    onPageChange,
}: ReviewPaginationProps) {
    const totalPages = Math.ceil(total / pageSize)

    if (totalPages <= 1) return null

    return (
        <div className="flex justify-center gap-3 pt-6">
            <Button
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
            >
                Previous
            </Button>

            <span className="text-sm self-center">
                Page {page} of {totalPages}
            </span>

            <Button
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
            >
                Next
            </Button>
        </div>
    )
}
