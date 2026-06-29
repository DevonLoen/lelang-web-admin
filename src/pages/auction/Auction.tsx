import { useState, useEffect } from "react";
import { apiClient } from "../../lib/apiClient";
import {
  Clock,
  Calendar,
  DollarSign,
  User,
  Package,
  X,
  Eye,
  Award,
  Tag,
  Hash,
  AlertCircle,
} from "lucide-react";

interface User {
  id: number;
  fullname: string;
  email: string;
  bank_name: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
}

interface Product {
  id: number;
  user_id: number;
  name: string;
  description: string;
  condition: string;
  cover_image_link: string | null;
  image_links: string[];
  weight_gram: number;
  status: string;
  status_histories: any[];
  created_at: string;
  updated_at: string;
}

interface AuctionBid {
  id: number;
  user_id: number;
  auction_id: number;
  amount: number;
  is_winner: boolean;
  user: User;
  created_at: string;
  updated_at: string;
}

interface AuctionWinner {
  id: number;
  auction_id: number;
  auction_bid_id: number | null;
  status: string;
  auction_bid: AuctionBid | null;
  created_at: string;
  updated_at: string;
}

interface AuctionNode {
  id: number;
  product_id: number;
  starting_price: number;
  start_time: string;
  end_time: string;
  status:
    | "SCHEDULED"
    | "ON_GOING"
    | "COMPLETED"
    | "CANCELLED"
    | "WAITING_FOR_PAYMENT"
    | "WAITING_FOR_SELLER_DECISION";
  fee: number;
  product: Product;
  winner: AuctionWinner | null;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  total: number;
  page: number;
  limit: number;
  nodes: AuctionNode[];
}

type AuctionStatus =
  | "SCHEDULED"
  | "ON_GOING"
  | "COMPLETED"
  | "CANCELLED"
  | "WAITING_FOR_PAYMENT"
  | "WAITING_FOR_SELLER_DECISION"
  | "";

// Detail Modal Component
function AuctionDetailModal({
  auction,
  onClose,
}: {
  auction: AuctionNode;
  onClose: () => void;
}) {
  // Formatting utilities - FIXED
  const formatRupiah = (amount: number) => {
    // Pastikan amount adalah number
    if (typeof amount !== "number" || isNaN(amount)) {
      return "Rp 0,-";
    }

    // Format dengan Intl.NumberFormat yang benar
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("IDR", "Rp");
  };
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      SCHEDULED: "text-blue-600 bg-blue-50 border-blue-200",
      ON_GOING: "text-yellow-600 bg-yellow-50 border-yellow-200",
      COMPLETED: "text-green-600 bg-green-50 border-green-200",
      CANCELLED: "text-red-600 bg-red-50 border-red-200",
      WAITING_FOR_PAYMENT: "text-purple-600 bg-purple-50 border-purple-200",
      WAITING_FOR_SELLER_DECISION: "text-pink-600 bg-pink-50 border-pink-200",
    };
    return colors[status] || "text-gray-600 bg-gray-50 border-gray-200";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Auction Details
              </h2>
              <p className="text-sm text-gray-500">ID: #{auction.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Product Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Product Information
              </h3>

              <div className="bg-gray-50/50 rounded-xl p-4 space-y-3">
                {auction.product?.cover_image_link && (
                  <div className="relative rounded-lg overflow-hidden bg-white">
                    <img
                      src={auction.product.cover_image_link}
                      alt={auction.product.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {auction.product?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {auction.product?.description || "No description"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400">Condition</p>
                    <p className="text-sm font-medium text-gray-700">
                      {auction.product?.condition || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Weight</p>
                    <p className="text-sm font-medium text-gray-700">
                      {auction.product?.weight_gram}g
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Auction Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Auction Information
              </h3>

              <div className="bg-gray-50/50 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(auction.status)}`}
                  >
                    {auction.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Starting Price
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatRupiah(auction.starting_price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Fee
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      {formatRupiah(auction.fee)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-gray-100">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">Start Time</p>
                      <p className="text-sm text-gray-700">
                        {formatDateTime(auction.start_time)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">End Time</p>
                      <p className="text-sm text-gray-700">
                        {formatDateTime(auction.end_time)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Winner Section */}
              {auction.winner?.auction_bid && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100/50">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-blue-600" />
                    Winner
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {auction.winner.auction_bid.user.fullname}
                      </p>
                      <p className="text-sm text-gray-500">
                        {auction.winner.auction_bid.user.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600">
                        {formatRupiah(auction.winner.auction_bid.amount)}
                      </p>
                      <p className="text-xs text-gray-400">Winning Bid</p>
                    </div>
                  </div>
                </div>
              )}

              {/* No Winner */}
              {!auction.winner?.auction_bid &&
                auction.status !== "SCHEDULED" && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No winner yet</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuctionManagement() {
  const [nodes, setNodes] = useState<AuctionNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Filter status
  const [statusFilter, setStatusFilter] = useState<AuctionStatus>("");

  // Modal state
  const [selectedAuction, setSelectedAuction] = useState<AuctionNode | null>(
    null,
  );

  // Fetch Auction List
  const fetchAuctions = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient<{
        data: ApiResponse;
      }>("/admin/auctions/filter", {
        method: "POST",
        body: JSON.stringify({
          limit,
          page,
          status: statusFilter || undefined,
          sorts: [
            {
              direction: "desc",
              field: "created_at",
            },
          ],
        }),
      });

      const data = res.data;
      setNodes(data.nodes || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (status: AuctionStatus) => {
    setStatusFilter(status);
    setPage(1);
  };

  useEffect(() => {
    fetchAuctions();
  }, [page, statusFilter]);

  // Formatting utilities
  const formatRupiah = (amount: number) => {
    return `Rp ${new Intl.NumberFormat("id-ID").format(amount)},-`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { color: string; bg: string; label: string; icon: any }
    > = {
      SCHEDULED: {
        color: "#3B82F6",
        bg: "bg-blue-50",
        label: "Scheduled",
        icon: Clock,
      },
      ON_GOING: {
        color: "#F59E0B",
        bg: "bg-yellow-50",
        label: "On Going",
        icon: Clock,
      },
      COMPLETED: {
        color: "#10B981",
        bg: "bg-green-50",
        label: "Completed",
        icon: Award,
      },
      CANCELLED: {
        color: "#EF4444",
        bg: "bg-red-50",
        label: "Cancelled",
        icon: X,
      },
      WAITING_FOR_PAYMENT: {
        color: "#8B5CF6",
        bg: "bg-purple-50",
        label: "Waiting Payment",
        icon: DollarSign,
      },
      WAITING_FOR_SELLER_DECISION: {
        color: "#EC4899",
        bg: "bg-pink-50",
        label: "Seller Decision",
        icon: AlertCircle,
      },
    };

    const config = statusMap[status] || {
      color: "#6B7280",
      bg: "bg-gray-50",
      label: status,
      icon: Tag,
    };

    const Icon = config.icon;

    return (
      <span
        className={`${config.bg} px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit`}
        style={{ color: config.color }}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#EEF2F6] p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#0F172A] flex items-center gap-3">
                Auction Management
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Manage and monitor all auctions in the system
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                <span className="text-sm text-gray-500">Total Auctions</span>
                <span className="ml-2 font-bold text-gray-900">{total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Filter Status:
            </span>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleFilterChange("")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  statusFilter === ""
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {[
                { value: "SCHEDULED", label: "Scheduled" },
                { value: "ON_GOING", label: "On Going" },
                { value: "WAITING_FOR_PAYMENT", label: "Waiting Payment" },
                {
                  value: "WAITING_FOR_SELLER_DECISION",
                  label: "Seller Decision",
                },
                { value: "COMPLETED", label: "Completed" },
                { value: "CANCELLED", label: "Cancelled" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleFilterChange(value as AuctionStatus)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    statusFilter === value
                      ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-sm text-gray-500">Loading auctions...</p>
          </div>
        ) : nodes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              No auction records available
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {statusFilter
                ? `with status "${statusFilter.replace(/_/g, " ")}"`
                : ""}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-semibold text-[13px] uppercase tracking-wider">
                    <th className="py-4 px-6 font-medium">Auction</th>
                    <th className="py-4 px-6 font-medium">Product</th>
                    <th className="py-4 px-6 font-medium text-right">
                      Starting Price
                    </th>
                    <th className="py-4 px-6 font-medium">Start</th>
                    <th className="py-4 px-6 font-medium">End</th>
                    <th className="py-4 px-6 font-medium">Status</th>
                    <th className="py-4 px-6 font-medium">Winner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {nodes.map((node) => (
                    <tr
                      key={node.id}
                      className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedAuction(node)}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Hash className="w-3 h-3 text-gray-400" />
                          <span className="font-mono font-medium text-gray-900">
                            {node.id}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {node.product?.cover_image_link ? (
                            <img
                              src={node.product.cover_image_link}
                              alt={node.product.name}
                              className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900 text-sm line-clamp-1">
                              {node.product?.name || "N/A"}
                            </div>
                            <div className="text-xs text-gray-400">
                              {node.product?.condition || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right font-medium text-gray-900">
                        <span className="whitespace-nowrap">
                          {formatRupiah(node.starting_price)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        <div className="flex flex-col">
                          <span>{formatDate(node.start_time)}</span>
                          <span className="text-xs text-gray-400">
                            {formatTime(node.start_time)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        <div className="flex flex-col">
                          <span>{formatDate(node.end_time)}</span>
                          <span className="text-xs text-gray-400">
                            {formatTime(node.end_time)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(node.status)}
                      </td>
                      <td className="py-4 px-6">
                        {node.winner?.auction_bid?.user ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">
                                {node.winner.auction_bid.user.fullname}
                              </div>
                              <div className="text-xs text-blue-600 font-medium">
                                {formatRupiah(node.winner.auction_bid.amount)}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center py-4 px-6 border-t border-gray-100 bg-gray-50/30">
                <div className="text-sm text-gray-500">
                  Showing {(page - 1) * limit + 1} to{" "}
                  {Math.min(page * limit, total)} of {total} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-8 h-8 rounded-xl text-sm font-medium transition-all ${
                            page === pageNum
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Detail Modal */}
        {selectedAuction && (
          <AuctionDetailModal
            auction={selectedAuction}
            onClose={() => setSelectedAuction(null)}
          />
        )}
      </div>
    </div>
  );
}
