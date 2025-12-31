import { Button } from "@/components/ui/button"

export function ReviewPagination({
    page,
    total,
    pageSize,
}: {
    page: number
    total: number
    pageSize: number
}) {
    const totalPages = Math.ceil(total / pageSize)

    return (
        <div className="flex justify-center gap-3 pt-6">
            <Button disabled={page === 1}>Previous</Button>

            <span className="text-sm self-center">
                Page {page} of {totalPages}
            </span>

            <Button disabled={page === totalPages}>Next</Button>
        </div>
    )
}
