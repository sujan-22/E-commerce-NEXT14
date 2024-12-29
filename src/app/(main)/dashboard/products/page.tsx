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
import Loader from "@/components/utility/Loader";
import { useRouter } from "next/navigation";
import useStore, { Collection, Product } from "@/context/useStore";
import Link from "next/link";

const columns: ColumnDef<Product>[] = [
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
        accessorKey: "id",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Id <ArrowUpDown className="pl-1 w-5 h-5" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("id")}</div>
        ),
        sortingFn: "alphanumeric",
    },
    // {
    //     accessorKey: "availableImages",
    //     header: "Image",
    //     cell: ({ row }) => {
    //         const images: string[] = row.getValue("availableImages");
    //         return images && images.length > 0 ? (
    //             <div className="relative w-28 h-20 flex items-center overflow-hidden">
    //                 <img alt={"product"} src={images[0]} />
    //             </div>
    //         ) : (
    //             <div>No Image</div>
    //         );
    //     },
    //     enableSorting: false,
    // },
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
        accessorKey: "collection",
        header: "Collection",
        cell: ({ row }) => {
            const collection: Collection[] = row.getValue("collection");
            const relevantCollections = Object.entries(collection)
                .filter(([_, value]) => Object.keys(value).length > 0)
                .map(([key]) => key);
            return (
                <div className="capitalize">
                    {relevantCollections.length > 0
                        ? relevantCollections.join(", ")
                        : "N/A"}
                </div>
            );
        },
    },

    {
        accessorKey: "price",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Price <ArrowUpDown className="pl-1 w-5 h-5" />
            </Button>
        ),
        cell: ({
            row,
        }: {
            row: { getValue: <T extends keyof Product>(key: T) => Product[T] };
        }) => {
            const collection = row.getValue("collection");
            const onsale = collection?.onsale;
            const originalPrice = row.getValue("price");
            const discountedPrice = onsale?.newPrice;

            return (
                <div className="space-x-2 uppercase">
                    {discountedPrice ? (
                        <>
                            <span className="line-through text-muted-foreground">
                                CAD{originalPrice.toFixed(2)}
                            </span>
                            <span className="text-red-500 font-semibold">
                                CAD{discountedPrice.toFixed(2)}
                            </span>
                        </>
                    ) : (
                        <span>CAD{originalPrice.toFixed(2)}</span>
                    )}
                </div>
            );
        },
        sortingFn: "alphanumeric",
    },
    {
        accessorKey: "stock",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Stock <ArrowUpDown className="pl-1 w-5 h-5" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("stock")}</div>
        ),
        sortingFn: "alphanumeric",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const productId = row.getValue("id");
            return (
                <Link href={`products/edit-product/${productId}/upload`}>
                    Edit Product
                </Link>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
];

export default function Products() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const router = useRouter();

    const { allProducts } = useStore();

    const table = useReactTable({
        data: allProducts || [],
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

    if (!allProducts) {
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
                    placeholder="Filter by name..."
                    value={
                        (table.getColumn("name")?.getFilterValue() as string) ??
                        ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("name")
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
