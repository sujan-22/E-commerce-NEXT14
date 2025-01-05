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
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/utility/Loader";
import { useRouter } from "next/navigation";
import { deleteUsers, getAllUsers } from "./actions";
import { MdDeleteOutline } from "react-icons/md";
import { IUser } from "auth-client";
const columns: ColumnDef<IUser>[] = [
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
        accessorKey: "role",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Role <ArrowUpDown className="pl-1 w-5 h-5" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("role")}</div>
        ),
        sortingFn: "alphanumeric",
    },
    {
        accessorKey: "delete",
        header: () => <div></div>, // Empty header for the column

        cell: ({ row }) => (
            <div className="capitalize">
                {row.getValue("role") === "admin" ? (
                    <div className="h-8 w-8"></div>
                ) : (
                    <Button
                        onClick={() => deleteUsers(row.original.id)}
                        className="bg-transparent text-red-500 hover:bg-transparent hover:text-red-700"
                    >
                        <MdDeleteOutline className="h-6 w-6" />
                    </Button>
                )}
            </div>
        ),
        sortingFn: "alphanumeric",
    },
];

export default function Customers() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const router = useRouter();

    const {
        data: usersData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["get-all-users"],
        queryFn: async () => await getAllUsers(),
        retry: true,
        retryDelay: 500,
    });

    const users = usersData?.success ? usersData.users : [];

    const table = useReactTable({
        data: users || [],
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
        return <div>Error loading users.</div>;
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
}
