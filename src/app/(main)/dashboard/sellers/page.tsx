"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowLeft, ArrowUpDown, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import MaxWidthWrapper from "@/components/utility/MaxWidthWrapper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllSellerRequests, updateSellerRequestStatus } from "./actions";
import Loader from "@/components/utility/Loader";
import { RequestStatus } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface SellerRequest {
    name: string;
    email: string;
    id: string;
    status: RequestStatus;
    createdAt: Date;
    userId: string;
    denialReason: string | null;
    approvedAt: Date | null;
    updatedAt: Date;
}

const columns: ColumnDef<SellerRequest>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Name <ArrowUpDown className="pl-1 w-5 h-5" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
        ),
        sortingFn: "alphanumeric",
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Email <ArrowUpDown className="pl-1 w-5 h-5" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue("email")}</div>
        ),
        sortingFn: "alphanumeric",
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Status <ArrowUpDown className="pl-1 w-5 h-5" />
            </Button>
        ),
        cell: ({ row }) => {
            const currentStatus = row.original.status;
            const sellerRequestId = row.original.id;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className=" capitalize" variant={"ghost"}>
                            {row.getValue("status")}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                        {Object.keys(RequestStatus).map((key) => {
                            const status =
                                RequestStatus[
                                    key as keyof typeof RequestStatus
                                ];

                            return (
                                <DropdownMenuItem
                                    key={status}
                                    onClick={async () => {
                                        const response =
                                            await updateSellerRequestStatus({
                                                sellerRequestId,
                                                newStatus: status,
                                            });
                                        if (response.success) {
                                            alert(
                                                `Status updated to ${status}`
                                            );
                                        } else {
                                            alert(`Error: ${response.message}`);
                                        }
                                    }}
                                >
                                    <div className=" capitalize">{status}</div>
                                    {currentStatus?.toLowerCase() ===
                                        status.toLowerCase() && (
                                        <span className="ml-2">✔</span>
                                    )}
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        sortingFn: "alphanumeric",
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Created At <ArrowUpDown className="pl-1 w-5 h-5" />
            </Button>
        ),
        cell: ({ row }) => {
            const createdAt = new Date(row.getValue("createdAt"));
            return (
                <div>
                    {createdAt.toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })}
                </div>
            );
        },
        sortingFn: "datetime",
    },
    {
        accessorKey: "approvedAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Approved At <ArrowUpDown className="pl-1 w-5 h-5" />
            </Button>
        ),
        cell: ({ row }) => {
            const approvedAt = row.getValue("approvedAt");
            if (!approvedAt) {
                return <div className="">-</div>;
            }
            const createdAt = new Date(row.getValue("approvedAt"));
            return (
                <div>
                    {createdAt.toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })}
                </div>
            );
        },
        sortingFn: "datetime",
    },
];

export default function Sellers() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const { toast } = useToast();
    const router = useRouter();

    const {
        data: sellerRequests,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["get-seller-requests"],
        queryFn: async () => await getAllSellerRequests(),
        retry: true,
        retryDelay: 500,
    });

    const { mutate: requestAccess, isPending } = useMutation({
        mutationFn: updateSellerRequestStatus,
        onSuccess: () => {
            toast({
                title: "Statuses updated",
                description: "The statuses have been updated successfully.",
            });
        },
        onError: () => {
            toast({
                title: "Error updating statuses",
                description: "Please try again later.",
                variant: "destructive",
            });
        },
    });

    function handleBulkUpdate(status: RequestStatus) {
        const selectedRows = table.getSelectedRowModel().rows;
        const selectedIds = selectedRows.map((row) => row.original.id);

        selectedIds.forEach((id) =>
            requestAccess({
                sellerRequestId: id,
                newStatus: status,
            })
        );
    }

    const table = useReactTable({
        data: sellerRequests?.requests || [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    if (isLoading) {
        return (
            <div className="w-full mt-24 flex justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader />
                    <h3 className="font-semibold text-xl">Loading data...</h3>
                    <p>This won&apos;t take too long!</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return <div>Error loading seller requests.</div>;
    }

    return (
        <MaxWidthWrapper>
            <Button
                className="flex items-center mt-4 space-x-2 cursor-pointer"
                onClick={() => router.back()}
                variant={"ghost"}
            >
                <ArrowLeft /> <span>Go back</span>
            </Button>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter by email..."
                    value={
                        (table
                            .getColumn("email")
                            ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("email")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Button
                    onClick={() => handleBulkUpdate(RequestStatus.approved)}
                    disabled={
                        isPending ||
                        table.getFilteredSelectedRowModel().rows.length === 0
                    }
                    className="ml-2"
                    variant={"outline"}
                >
                    Approve Selected
                </Button>
                <Button
                    onClick={() => handleBulkUpdate(RequestStatus.denied)}
                    disabled={
                        isPending ||
                        table.getFilteredSelectedRowModel().rows.length === 0
                    }
                    className="ml-2"
                    variant={"outline"}
                >
                    Deny Selected
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </MaxWidthWrapper>
    );
}
