import Breadcrumb from "../../components/breadcrumb";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTimeId } from "@/utils/format-date";
import type { Product, Status } from "@/interface/product";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ToastAction } from "@radix-ui/react-toast";
import { useToast } from "@/hooks/use-toast";

const img1 =
  "https://img.freepik.com/free-photo/closeup-scarlet-macaw-from-side-view-scarlet-macaw-closeup-head_488145-3540.jpg?semt=ais_incoming&w=740&q=80";
const img2 =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmxbhQpDEuFsnVwrYGw3432VO3RCI_hVo71A&s";

const pageSizes = [5, 10, 20, 50]; // opsi page size

export default function PendingProduct() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [open, setOpen] = React.useState(false);
  const [actionType, setActionType] = React.useState<Status | null>(null);
  const [message, setMessage] = React.useState("");
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null
  );

  const handleOpenModal = (type: Status, product: Product) => {
    setSelectedProduct(product); // product yang di-looping
    setActionType(type);
    setOpen(true);
  };

  const handleSubmit = () => {
    try {
      toast({
        title: "tes",
        description: "he",
        action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
      });
      // console.log("Action:", actionType);
      // console.log("Message:", message);
      // console.log(selectedProduct?.id);
      // setOpen(false);
      // setMessage("");
    } catch (error) {}
  };

  const data = React.useMemo<Product[]>(
    () => [
      {
        id: 1,
        userId: 101,
        coverImageUrl: img1,
        imageUrls: [img2, img1],
        name: "IPhone 15 Pro Max",
        userName: "Devon",
        description:
          "Smartphone flagship Apple dengan kamera 48MP dan chip A17 Pro terbaru.",
        submissionDate: new Date("2025-09-18T09:00:00"),
        condition: "new",
        status: "requested",
        createdAt: "2025-09-18T09:00:00",
      },
      {
        id: 2,
        userId: 102,
        coverImageUrl:
          "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=800&q=80",
        imageUrls: [
          "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=800&q=80",
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
        ],
        name: "Asus ROG Zephyrus G15",
        userName: "Maliq",
        description:
          "Laptop gaming high-end dengan AMD Ryzen 9 dan GPU RTX 3080, cocok untuk gamer profesional.",
        submissionDate: new Date("2025-09-17T13:30:00"),
        condition: "used",
        status: "verified",
        createdAt: "2025-09-17T14:00:00",
      },
      {
        id: 3,
        userId: 103,
        coverImageUrl:
          "https://images.unsplash.com/photo-1512499617640-c2f999098c01?w=800&q=80",
        imageUrls: [
          "https://images.unsplash.com/photo-1512499617640-c2f999098c01?w=800&q=80",
          "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=800&q=80",
        ],
        name: "Sony WH-1000XM5 Headphones",
        userName: "Alicia",
        description:
          "Headphone wireless noise-cancelling premium dengan kualitas suara jernih.",
        submissionDate: new Date("2025-09-16T15:00:00"),
        condition: "new",
        status: "on bids",
        createdAt: "2025-09-16T15:30:00",
      },
      {
        id: 4,
        userId: 104,
        coverImageUrl:
          "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80",
        imageUrls: [
          "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80",
          "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80",
        ],
        name: "Canon EOS R5 Mirrorless Camera",
        userName: "Brian",
        description:
          "Kamera mirrorless full-frame dengan 45MP dan kemampuan 8K video recording.",
        submissionDate: new Date("2025-09-15T10:00:00"),
        condition: "used",
        status: "completed",
        createdAt: "2025-09-15T11:00:00",
      },
      {
        id: 5,
        userId: 105,
        coverImageUrl:
          "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800&q=80",
        imageUrls: [
          "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800&q=80",
          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
        ],
        name: "Samsung 4K Smart TV 55 Inch",
        userName: "Catherine",
        description:
          "Smart TV 4K UHD dengan dukungan HDR dan aplikasi streaming bawaan.",
        submissionDate: new Date("2025-09-14T17:00:00"),
        condition: "new",
        status: "draft",
        createdAt: "2025-09-14T18:00:00",
      },
      {
        id: 6,
        userId: 106,
        coverImageUrl:
          "https://images.unsplash.com/photo-1616627453158-fd99bbfa8f35?w=800&q=80",
        imageUrls: [
          "https://images.unsplash.com/photo-1616627453158-fd99bbfa8f35?w=800&q=80",
          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
        ],
        name: "PlayStation 5 Digital Edition",
        userName: "Devon",
        description:
          "Konsol game next-gen dengan performa tinggi dan dukungan ray tracing.",
        submissionDate: new Date("2025-09-13T20:00:00"),
        condition: "used",
        status: "rejected",
        createdAt: "2025-09-13T21:00:00",
      },
    ],
    []
  );

  const columns = React.useMemo<ColumnDef<Product>[]>(
    () => [
      // {
      //   id: "select",
      //   header: ({ table }) => (
      //     <Checkbox
      //       checked={
      //         table.getIsAllPageRowsSelected() ||
      //         (table.getIsSomePageRowsSelected() && "indeterminate")
      //       }
      //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      //       aria-label="Select all"
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <Checkbox
      //       checked={row.getIsSelected()}
      //       onCheckedChange={(value) => row.toggleSelected(!!value)}
      //       aria-label="Select row"
      //     />
      //   ),
      //   enableSorting: false,
      //   enableHiding: false,
      // },
      {
        id: "id",
        header: ({ column }) => (
          <div className="text-middle">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="flex items-middle justify-middle w-full gap-1"
            >
              Id
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        ),
        accessorFn: (row) => row.id,
        cell: ({ getValue }) => {
          return (
            <div className="flex items-center justify-center font-medium">
              {getValue() as string}
            </div>
          );
        },
      },
      {
        id: "userName",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Seller
            <ArrowUpDown />
          </Button>
        ),
        accessorFn: (row) => row.userName,
        cell: ({ getValue }) => <div className="">{getValue() as string}</div>,
      },
      {
        id: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product
            <ArrowUpDown />
          </Button>
        ),
        accessorFn: (row) => row.name,
        cell: ({ getValue }) => <div className="">{getValue() as string}</div>,
      },
      {
        id: "condition",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Condition
            <ArrowUpDown />
          </Button>
        ),
        accessorFn: (row) => row.condition,
        cell: ({ getValue }) => <div className="">{getValue() as string}</div>,
      },
      {
        id: "coverImageUrl",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Cover Image
            <ArrowUpDown />
          </Button>
        ),
        accessorFn: (row) => row.coverImageUrl,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        cell: ({ row }) => {
          const url: string = row.getValue("coverImageUrl");
          return (
            <div className="">
              <img
                key={`${row.getValue("id")}-cover-image}`}
                src={url}
                alt={`${row.getValue("id")}-cover-image}`}
                className="h-12 w-12 object-cover rounded"
              />
            </div>
          );
        },
      },
      {
        id: "imageUrls",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Images
            <ArrowUpDown />
          </Button>
        ),
        accessorFn: (row) => row.imageUrls,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        cell: ({ row }) => {
          const urls: string[] = row.getValue("imageUrls");
          return (
            <div className="flex gap-2">
              {urls.map((url, i) => (
                <img
                  key={`${row.getValue("id")}-image-${i}-}`}
                  src={url}
                  alt={`${row.getValue("id")}-image-${i}-}`}
                  className="h-12 w-12 object-cover rounded"
                />
              ))}
            </div>
          );
        },
      },
      {
        id: "description",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Description
            <ArrowUpDown />
          </Button>
        ),
        accessorFn: (row) => row.description,
        cell: ({ getValue }) => <div className="">{getValue() as string}</div>,
      },
      {
        id: "submissionDate",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Submission Date
            <ArrowUpDown />
          </Button>
        ),
        accessorFn: (row) => formatDateTimeId(row.submissionDate),
        cell: ({ getValue }) => <div className="">{getValue() as string}</div>,
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const product = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => handleOpenModal("verified", product)}
                >
                  Verify
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleOpenModal("rejected", product)}
                >
                  Reject
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [pageSize, setPageSize] = React.useState(5);
  const [pageIndex, setPageIndex] = React.useState(0); // tambahkan pageIndex

  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
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
      pagination: { pageIndex, pageSize }, // pakai kedua state
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    pageCount: Math.ceil(data.length / pageSize),
    initialState: { pagination: { pageIndex: 0, pageSize } },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Breadcrumb paths={["Product", "Pending Verification"]} />

      <div className="max-w-6xl mx-auto">
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Search ..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
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
          <div className="overflow-hidden rounded-md border">
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
                                header.column.columnDef.header,
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
                      data-state={row.getIsSelected() && "selected"}
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
          <div className="flex items-center justify-between py-4 space-x-4 text-sm text-muted-foreground">
            {/* Selected row info */}
            <div className="flex-1">
              {/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected */}
            </div>

            {/* Page size dropdown */}
            <div className="flex items-center flex-none space-x-2">
              <span>Rows per page:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="px-2 py-1 text-sm">
                    {pageSize} <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[4rem] p-1">
                  {pageSizes.map((size) => (
                    <DropdownMenuItem
                      key={size}
                      className="capitalize px-2 py-1 text-sm"
                      onSelect={() => table.setPageSize(size)}
                    >
                      {size}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Page range info */}
            <div className="flex-none">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              –
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                data.length
              )}{" "}
              of {data.length}
            </div>

            {/* Navigation buttons */}
            <div className="flex-none space-x-2">
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {actionType === "verified"
                    ? "Verify Product"
                    : "Reject Product"}
                </DialogTitle>
                <DialogDescription>
                  Please provide a message or reason before proceeding.
                  <br />
                  <span className="font-semibold">
                    {selectedProduct?.userName}
                  </span>
                  <br />
                  <span className="font-semibold">{selectedProduct?.name}</span>
                </DialogDescription>
              </DialogHeader>
              <Textarea
                placeholder="Enter message/reason..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mb-4"
              />
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedProduct(null);
                    setMessage("");
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {actionType === "verified" ? "Verify" : "Reject"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
