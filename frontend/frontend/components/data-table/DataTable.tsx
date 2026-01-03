"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import { useState } from "react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onBulkApprove?: (ids: number[]) => void
    onBulkReject?: (ids: number[]) => void
}

export function DataTable<TData extends { id: number }, TValue>({
    columns,
    data,
    onBulkApprove,
    onBulkReject,
}: DataTableProps<TData, TValue>) {
    const [globalFilter, setGlobalFilter] = useState("")
    const [rowSelection, setRowSelection] = useState({})
    const [selectAllGlobal, setSelectAllGlobal] = useState(false)

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            rowSelection,
        },
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    /** ✅ THE KEY FIX */
    const selectedIds = selectAllGlobal
        ? data.map(row => row.id) // ALL rows
        : table.getSelectedRowModel().rows.map(r => r.original.id)

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center gap-2 flex-wrap">
                <Input
                    placeholder="Search reviews..."
                    value={globalFilter ?? ""}
                    onChange={e => {
                        setGlobalFilter(e.target.value)
                        setSelectAllGlobal(false)
                    }}
                    className="max-w-sm"
                />

                <select
                    className="border rounded px-2 py-1 text-sm"
                    value={table.getState().pagination.pageSize}
                    onChange={e => table.setPageSize(Number(e.target.value))}
                >
                    {[10, 20, 50, 100].map(size => (
                        <option key={size} value={size}>
                            Show {size}
                        </option>
                    ))}
                </select>

                {selectedIds.length > 0 && (
                    <>
                        <Button onClick={() => onBulkApprove?.(selectedIds)}>
                            Bulk Approve ({selectedIds.length})
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => onBulkReject?.(selectedIds)}
                        >
                            Bulk Reject ({selectedIds.length})
                        </Button>
                    </>
                )}
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {/* GLOBAL SELECT */}
                            <TableHead className="w-10">
                                <Checkbox
                                    checked={selectAllGlobal}
                                    onCheckedChange={v => {
                                        const checked = !!v
                                        setSelectAllGlobal(checked)

                                        if (!checked) {
                                            table.resetRowSelection()
                                        }
                                    }}
                                />
                            </TableHead>

                            {headerGroup.headers.map(header => (
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
                    {table.getRowModel().rows.map(row => (
                        <TableRow key={row.id}>
                            <TableCell>
                                <Checkbox
                                    disabled={selectAllGlobal}
                                    checked={selectAllGlobal || row.getIsSelected()}
                                    onCheckedChange={v => {
                                        if (!selectAllGlobal) {
                                            row.toggleSelected(!!v)
                                        }
                                    }}
                                />

                            </TableCell>

                            {row.getVisibleCells().map(cell => (
                                <TableCell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </div>

                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
