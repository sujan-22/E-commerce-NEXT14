"use client";
import MaxWidthWrapper from "@/components/utility/MaxWidthWrapper";
import { useRouter } from "next/navigation";
import { getAllOrders, updateOrderStatus } from "./actions";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/utility/Loader";
import { ArrowLeft, ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Order, OrderStatus } from "@prisma/client";
// import { useToast } from "@/components/ui/use-toast";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@nextui-org/react";

const columns: ColumnDef<Order>[] = [
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
        accessorKey: "orderNumber",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Order Number <ArrowUpDown className="pl-1 w-5 h-5" />
            </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("orderNumber")}</div>,
        sortingFn: "alphanumeric",
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
        accessorKey: "isPaid",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Paid <ArrowUpDown className="pl-1 w-5 h-5" />
            </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("isPaid") ? "Yes" : "No"}</div>,
        sortingFn: (rowA, rowB, columnId) => {
            const a = rowA.getValue(columnId) ? 1 : 0;
            const b = rowB.getValue(columnId) ? 1 : 0;
            return a - b;
        },
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
            const orderId = row.original.id;
            const isPaid = row.original.isPaid;

            // Helper function to format status
            const formatStatus = (status: string) => {
                return status
                    .split("_")
                    .map(
                        (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                    )
                    .join(" ");
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="capitalize"
                            variant={"ghost"}
                            disabled={!isPaid}
                        >
                            {formatStatus(row.getValue("status"))}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                        {Object.keys(OrderStatus).map((key) => {
                            const status =
                                OrderStatus[key as keyof typeof OrderStatus];

                            return (
                                <DropdownMenuItem
                                    key={status}
                                    onClick={async () => {
                                        const response =
                                            await updateOrderStatus({
                                                orderId,
                                                newStatus: status,
                                            });
                                        if (response.success) {
                                            window.location.reload();
                                        } else {
                                            alert(`Error: ${response.message}`);
                                        }
                                    }}
                                >
                                    <div className="capitalize">
                                        {formatStatus(status)}
                                    </div>
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
];

const Page = () => {
    const router = useRouter();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    // const { toast } = useToast();
    const {
        data: orders,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["get-orders"],
        queryFn: async () => await getAllOrders(),
        retry: true,
        retryDelay: 500,
    });

    // const { mutate: requestAccess, isPending } = useMutation({
    //   mutationFn: updateOrderStatus,
    //   onSuccess: () => {
    //     toast({
    //       title: "Statuses updated",
    //       description: "The statuses have been updated successfully.",
    //     });
    //   },
    //   onError: () => {
    //     toast({
    //       title: "Error updating statuses",
    //       description: "Please try again later.",
    //       variant: "destructive",
    //     });
    //   },
    // });

    const table = useReactTable({
        data: orders?.requests || [],
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
        return <div>Error loading orders.</div>;
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
};

export default Page;
