import React, { useEffect, useState } from "react";
import {
    CaretSortIcon,
    CheckCircledIcon,
    ChevronDownIcon,
    QuestionMarkCircledIcon,
    StopwatchIcon,
} from "@radix-ui/react-icons";
import {
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { useWebsite } from "@/contexts/website-context";
import { AddCookie } from "./add-cookie";
import { useCookies } from "@/contexts/cookie-context";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { useToast } from "@/Components/ui/use-toast";
import { useForm } from "@inertiajs/react";
import DeleteDomain from "../domains/delete-domain";
import { CircleIcon, Pencil, Trash2 } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

export function CookiesTable({ cookies }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [selectCookie, setSelectCookie] = useState();
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [filteredCookies, setFilteredCookies] = useState([]);

    const { setShowEditCookieDialog } = useCookies();

    const { selectedWebsite, setShowDeleteWebsiteDialog } = useWebsite();

    const { toast } = useToast();
    const { patch } = useForm();

    useEffect(() => {
        const cook = cookies.filter((cookie) => cookie.category == categoryFilter)
        setFilteredCookies(
            categoryFilter == 'all' ? cookies : cook
        );
    }, [categoryFilter, cookies]);

    const handleUpdateCategory = (data) => {
        patch(route("cookies.update", data), {
            onSuccess: () => toast({ description: "Operation Successfull" }),
        });
    };

    function shortenText(value, maxLength = 30) {
        if (value.length > maxLength) {
            return value.substring(0, maxLength - 3) + "...";
        }
        return value;
    }

    const categories = [
        {
            value: "analytics",
            label: "Analytics",
            icon: QuestionMarkCircledIcon,
        },
        {
            value: "marketing",
            label: "Markeing",
            icon: CircleIcon,
        },
        {
            value: "necessary",
            label: "Necessary",
            icon: StopwatchIcon,
        },
        {
            value: "preferences",
            label: "Preferences",
            icon: CheckCircledIcon,
        },
    ];

    const columns = [
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
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Tracker name
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize pl-4">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "provider",
            header: () => <div className="text-center">Domain</div>,
            cell: ({ row }) => (
                <div className="lowercase text-center">
                    {row.getValue("provider")}
                </div>
            ),
        },
        {
            accessorKey: "value",
            header: () => <div className="text-center">Value</div>,
            cell: ({ row }) => (
                <div className="lowercase text-center">
                    {shortenText(row.getValue("value"))}
                </div>
            ),
        },
        {
            accessorKey: "category",
            header: ({ column }) => {
                return (
                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                            className="text-center"
                        >
                            Category
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize text-center">
                    {row.getValue("category") ?? (
                        <Select
                            onValueChange={(e) =>
                                handleUpdateCategory({
                                    cookie_id: row?.original?.id,
                                    domain_id: selectedWebsite?.domain_id,
                                    category: e,
                                })
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Assign to category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Categories</SelectLabel>
                                    <SelectItem value="necessary">
                                        Nescessary
                                    </SelectItem>
                                    <SelectItem value="marketing">
                                        Marketing
                                    </SelectItem>
                                    <SelectItem value="preferences">
                                        Preferences
                                    </SelectItem>
                                    <SelectItem value="analytics">
                                        Analytics
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "http_only",
            header: () => <div className="text-right">Http Only</div>,
            cell: ({ row }) => {
                const http_only = row.getValue("http_only");
                return (
                    <div className=" text-right capitalize">
                        {http_only == 1 ? (
                            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
                                True
                            </span>
                        ) : (
                            <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">
                                False
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "secure",
            header: () => <div className="text-center">Secure</div>,
            cell: ({ row }) => {
                const secure = row.getValue("secure");
                return (
                    <div className=" text-right capitalize">
                        {secure == 1 ? (
                            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
                                True
                            </span>
                        ) : (
                            <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">
                                False
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const cookie = row.original;

                return (
                    <div className="text-right">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setSelectCookie(cookie);
                                        setShowEditCookieDialog(true);
                                    }}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit cookie</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="text-red-500"
                                    onClick={() => {
                                        setSelectCookie(cookie);
                                        setShowDeleteWebsiteDialog(true);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Delete cookie</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: filteredCookies,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    return (
        <div className="w-full">
            <DeleteDomain resource={selectCookie} type="cookie" />
            <div className="flex items-center py-4 justify-between">
                <div className="flex gap-4">
                    <Input
                        placeholder="Filter cookies..."
                        value={table.getColumn("name")?.getFilterValue() ?? ""}
                        onChange={(event) =>
                            table
                                .getColumn("name")
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />

                    <Select onValueChange={(e)=> setCategoryFilter(e)} value={categoryFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Categories</SelectLabel>
                                <SelectItem value="all">
                                    All Categories
                                </SelectItem>
                                <SelectItem value="analytics">
                                    Analytics
                                </SelectItem>
                                <SelectItem value="marketing">
                                    Marketing
                                </SelectItem>
                                <SelectItem value="necessary">
                                    Necessary
                                </SelectItem>
                                <SelectItem value="preferences">
                                    Preferences
                                </SelectItem>
                                <SelectItem value={()=>("")}>
                                    Not Categorised
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-4">
                    <AddCookie cookie={selectCookie} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns{" "}
                                <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
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
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
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
        </div>
    );
}
