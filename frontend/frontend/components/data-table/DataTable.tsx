"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { useEffect, useState } from "react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

/* =====================================================
   TYPES
===================================================== */

interface DataTableProps<TData> {
    columns: ColumnDef<TData, unknown>[]
    data: TData[]

    /** server pagination */
    page: number
    pageSize: number
    total: number

    /** callbacks */
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
    onSearch: (query: string) => void

    loading?: boolean
}

/* =====================================================
   COMPONENT
===================================================== */

export function DataTable<TData>({
    columns,
    data,
    page,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
    onSearch,
    loading = false,
}: DataTableProps<TData>) {
    const [search, setSearch] = useState("")

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    })

    /* 🔍 debounce server search */
    useEffect(() => {
        const t = setTimeout(() => {
            onSearch(search)
        }, 400)
        return () => clearTimeout(t)
    }, [search, onSearch])

    const totalPages = Math.max(1, Math.ceil(total / pageSize))

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <Input
                    placeholder="Search reviews..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="max-w-sm"
                />

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Rows
                    </span>
                    <Select
                        value={String(pageSize)}
                        onValueChange={v => {
                            onPageSizeChange(Number(v))
                        }}
                    >
                        <SelectTrigger className="w-[80px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 20, 50, 100].map(n => (
                                <SelectItem key={n} value={String(n)}>
                                    {n}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map(hg => (
                        <TableRow key={hg.id}>
                            {hg.headers.map(header => (
                                <TableHead key={header.id}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="text-center"
                            >
                                Loading…
                            </TableCell>
                        </TableRow>
                    ) : data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="text-center text-muted-foreground"
                            >
                                No results found
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row, i) => {
                            const tableRow = table.getRowModel().rows[i]
                            return (
                                <TableRow key={tableRow.id}>
                                    {tableRow
                                        .getVisibleCells()
                                        .map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between text-sm">
                <div className="text-muted-foreground">
                    Page {page} of {totalPages} · {total} results
                </div>

                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={page <= 1}
                        onClick={() => onPageChange(page - 1)}
                    >
                        Previous
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={page >= totalPages}
                        onClick={() => onPageChange(page + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
