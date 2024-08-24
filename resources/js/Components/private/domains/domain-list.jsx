import React, { useEffect } from "react";
import { CaretSortIcon, ChevronDownIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Link as BtnLink, usePage } from "@inertiajs/react";
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
import { EditDomain } from "./edit-domain";
import {
    CodeXml,
    Pencil,
    Radar,
    Radio,
    SlidersVertical,
    Trash2,
} from "lucide-react";
import DeleteDomain from "./delete-domain";
import { Link, useForm } from "@inertiajs/react";
import { useToast } from "@/Components/ui/use-toast";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { useOnboarding } from "@/contexts/onboarding-context";

export function DomainsTable({ websites, user }) {
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [domain, setDomain] = React.useState({});

    const { restart } = useOnboarding();
    const { props } = usePage();
    const { toast } = useToast();

    useEffect(() => {
      if (props.errors.message) {
        toast({ description: props.errors.message });
      }
    }, [props]);
    
    const {
        setSelectedWebsite,
        setShowEditWebsiteDialog,
        setShowDeleteWebsiteDialog,
    } = useWebsite();

    const { post } = useForm();
    const handleScan = (website) => {
        post(route("websites.trigger-scan", website.domain_id), {
            onSuccess: (data) => {
                console.log(data);
                toast({ description: "Scan initiated" });
            },
        });
    };

    useEffect(() => {
        if (user.is_admin == 1) {
            setSelectedWebsite(null);
        }
    }, []);

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
                        Name
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "domain",
            header: "Domain",
            cell: ({ row }) => (
                <div className="lowercase">{row.getValue("domain")}</div>
            ),
        },
        {
            accessorKey: "cookies",
            header: () => <div className="text-center">Total cookies</div>,
            cell: ({ row }) => {
                const cookies = row.getValue("cookies");
                return (
                    <div className="text-center font-medium">
                        {cookies?.length}
                    </div>
                );
            },
        },
        {
            accessorKey: "scan_frequency",
            header: () => <div className="text-center">Scan Frequency</div>,
            cell: ({ row }) => (
                <div className="text-center capitalize">
                    {row.getValue("scan_frequency")}
                </div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const website = row.original;
                return (
                    <div className="text-right">
                        <div className="flex items-center">
                            {user.is_admin == 1 && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            className="py-2 px-4 hover:bg-slate-100 rounded"
                                            href="/configurations"
                                            onClick={() => {
                                                setSelectedWebsite(website);
                                            }}
                                        >
                                            <SlidersVertical className="h-4 w-4" />
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>View configuration</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                            {user.is_admin == 1 && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            className="py-2 px-4 hover:bg-slate-100 rounded"
                                            href="/implementations"
                                            onClick={() => {
                                                setSelectedWebsite(website);
                                            }}
                                        >
                                            <CodeXml className="h-4 w-4" />
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>View implementation</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                            {user.is_admin == 1 && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            className="py-2 px-4 hover:bg-slate-100 rounded"
                                            href="/reports"
                                            onClick={() => {
                                                setSelectedWebsite(website);
                                            }}
                                        >
                                            <Radio className="h-4 w-4 mr-2" />
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>View cookies & reports</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setDomain(website);
                                            setShowEditWebsiteDialog(true);
                                        }}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit domain</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setDomain(website);
                                            setShowDeleteWebsiteDialog(true);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Delete domain</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        onClick={() =>
                                            handleScan(website)
                                        }
                                    >
                                        <Radar className="h-5 w-5 text-green-500" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Trigger scan</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <EditDomain website={domain} />
                        <DeleteDomain resource={domain} type="website" />
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: websites,
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

    return (
        <div className="w-full">
            <div className="flex items-center py-4 justify-between">
                <Input
                    placeholder="Filter domains..."
                    value={table.getColumn("name")?.getFilterValue() ?? ""}
                    onChange={(event) =>
                        table
                            .getColumn("name")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <div className="flex gap-4">
                    <BtnLink
                        href={"onboarding"}
                        onClick={() => {
                            restart()
                        }
                        }
                    >
                        <Button><PlusCircledIcon className="mr-2 h-5 w-5" />Add domain</Button>
                    </BtnLink>
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
