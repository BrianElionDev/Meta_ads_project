"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
  ColumnFiltersState,
  Row,
} from "@tanstack/react-table";
import { UserAds, EnumAdStatus } from "@/types/user_ads";

interface AdsTableProps {
  ads: UserAds[];
  onApprove?: (adId: string) => void;
}

const columnHelper = createColumnHelper<UserAds>();

export default function AdsTable({ ads, onApprove }: AdsTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const getStatusBadge = (status: EnumAdStatus) => {
    const statusConfig = {
      [EnumAdStatus.pending]: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: "⏳",
      },
      [EnumAdStatus.ready]: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "🎯",
      },
      [EnumAdStatus.approved]: {
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: "✅",
      },
      [EnumAdStatus.posted]: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: "🚀",
      },
      [EnumAdStatus.cancelled]: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: "❌",
      },
    };

    const config = statusConfig[status] || statusConfig[EnumAdStatus.pending];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
      >
        <span className="mr-1">{config.icon}</span>
        {status.toString().toUpperCase()}
      </span>
    );
  };

  const getProgressPercentage = (ad: UserAds) => {
    // If status is posted, it's 100% complete regardless of other fields
    if (ad.status === EnumAdStatus.posted) {
      return 100;
    }

    // If status is approved, it's 100% complete (ready to post)
    if (ad.status === EnumAdStatus.approved) {
      return 100;
    }

    // If we have ad_ID, it's 100% complete
    if (ad.ad_ID) {
      return 100;
    }

    // If status is ready, check what we have
    if (ad.status === EnumAdStatus.ready) {
      // If we have ad_creative_ID, we're at 83% (5/6 steps)
      if (ad.ad_creative_ID) return 83;
      // If we have adset_ID, we're at 67% (4/6 steps)
      if (ad.adset_ID) return 67;
      // If we have campaign_ID, we're at 50% (3/6 steps)
      if (ad.campaign_ID) return 50;
      // If we have image_url, we're at 17% (1/6 steps)
      if (ad.image_url) return 17;
    }

    // For pending status, check what fields we have
    if (ad.status === EnumAdStatus.pending) {
      // If we have ad_creative_ID, we're at 83% (5/6 steps)
      if (ad.ad_creative_ID) return 83;
      // If we have adset_ID, we're at 67% (4/6 steps)
      if (ad.adset_ID) return 67;
      // If we have campaign_ID, we're at 50% (3/6 steps)
      if (ad.campaign_ID) return 50;
      // If we have image_url, we're at 17% (1/6 steps)
      if (ad.image_url) return 17;
    }

    // Default to 0% if nothing is available
    return 0;
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("campaign_name", {
        header: "Campaign",
        cell: ({ getValue, row }) => (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📱</span>
            </div>
            <div>
              <div className="font-semibold text-white">
                {getValue() || "Untitled Campaign"}
              </div>
              <div className="text-sm text-gray-500">
                {row.original.ad_name || "Ad Creative"}
              </div>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ getValue }) => getStatusBadge(getValue()),
      }),
      columnHelper.accessor("created_at", {
        header: "Created",
        cell: ({ getValue }) => {
          const date = new Date(getValue());
          return (
            <div className="text-sm">
              <div className="font-medium text-white">
                {date.toLocaleDateString()}
              </div>
              <div className="text-gray-500">{date.toLocaleTimeString()}</div>
            </div>
          );
        },
      }),
      {
        id: "progress",
        header: "Progress",
        cell: ({ row }: { row: Row<UserAds> }) => {
          const progress = getProgressPercentage(row.original);
          return (
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-white w-8">
                {progress}%
              </span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: Row<UserAds> }) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push(`/ads/${row.original.id}`)}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View Details
            </button>
            {row.original.status === EnumAdStatus.ready && onApprove && (
              <button
                onClick={() => onApprove(row.original.id)}
                className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Approve
              </button>
            )}
          </div>
        ),
      },
    ],
    [router, onApprove]
  );

  const table = useReactTable({
    data: ads,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/80 to-gray-900/80">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Ad Campaigns</h2>
            <p className="text-sm text-gray-400 mt-1">
              Manage and track your advertising campaigns
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search campaigns..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 w-full sm:w-auto"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center space-x-1"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          {header.column.getCanSort() && (
                            <span className="text-gray-400">
                              {{
                                asc: "↑",
                                desc: "↓",
                              }[header.column.getIsSorted() as string] ?? "↕"}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-gray-800/30 divide-y divide-gray-700/50">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-700/30 transition-colors cursor-pointer"
                  onClick={() => router.push(`/ads/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          {table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="p-4 border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors cursor-pointer"
              onClick={() => router.push(`/ads/${row.original.id}`)}
            >
              {/* Campaign Column - Always visible */}
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📱</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">
                    {row.original.campaign_name || "Untitled Campaign"}
                  </div>
                  <div className="text-sm text-gray-400">
                    {row.original.ad_name || "Ad Creative"}
                  </div>
                </div>
                {getStatusBadge(row.original.status)}
              </div>

              {/* Other columns stacked below */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Created:</span>
                  <div className="text-white">
                    {new Date(row.original.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Progress:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${getProgressPercentage(row.original)}%`,
                        }}
                      />
                    </div>
                    <span className="text-white font-medium">
                      {getProgressPercentage(row.original)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/ads/${row.original.id}`);
                  }}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  View Details
                </button>
                {row.original.status === EnumAdStatus.ready && onApprove && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onApprove(row.original.id);
                    }}
                    className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-700/50 border-t border-gray-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-400">
          <div>
            Showing {table.getFilteredRowModel().rows.length} of {ads.length}{" "}
            campaigns
          </div>
          <div className="flex items-center space-x-2">
            <span>Rows per page:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
