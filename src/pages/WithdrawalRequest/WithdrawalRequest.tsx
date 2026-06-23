import { useState, useEffect } from "react";
import WithdrawalModal from "./WithdrawalModal";

interface User {
  id: number;
  fullname: string;
  phone: string;
  bank_name: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
}

interface WithdrawalNode {
  id: number;
  user_id: number;
  validator_user_id: number | null;
  amount: number;
  status: "REQUESTED" | "COMPLETED" | "REJECTED";
  CreatedAt: string;
  user: User;
}

interface ApiResponse {
  total: number;
  page: number;
  limit: number;
  nodes: WithdrawalNode[];
}

export default function WithdrawalRequest() {
  const [nodes, setNodes] = useState<WithdrawalNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Filter status
  const [statusFilter, setStatusFilter] = useState<
    "REQUESTED" | "COMPLETED" | ""
  >("REQUESTED");

  // Modal interaction state
  const [selectedNode, setSelectedNode] = useState<WithdrawalNode | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const getToken = (): string | null => {
    return localStorage.getItem("token");
  };

  // 1. Fetch List Penarikan Dana
  const fetchWithdrawals = async () => {
    setLoading(true);
    setError(null);

    const token = getToken();

    try {
      const response = await fetch(
        "http://localhost:8080/admin/withdrawal-requests/filter",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            limit,
            page,
            status: statusFilter || undefined, // Kirim undefined jika filter kosong
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch withdrawal records");
      }

      const res = await response.json();
      const data: ApiResponse = res.data;

      setNodes(data.nodes || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // 2. Aksi PATCH Selesaikan Withdrawal
  const handleCompleteWithdrawal = async () => {
    if (!selectedNode) return;

    setActionLoading(true);
    const token = getToken();

    try {
      const { user_id, id } = selectedNode;
      const url = `http://localhost:8080/admin/users/${user_id}/withdrawal-requests/${id}/complete`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok)
        throw new Error("Failed to finalize withdrawal transfer");

      setSelectedNode(null);
      await fetchWithdrawals(); // Refresh list data setelah update sukses
    } catch (err: any) {
      alert(err.message || "Error performing action");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (status: "REQUESTED" | "COMPLETED" | "") => {
    setStatusFilter(status);
    setPage(1); // Reset ke halaman pertama saat filter berubah
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [page, statusFilter]);

  // Formatting utilities
  const formatRupiah = (amount: number) => {
    return `Rp ${new Intl.NumberFormat("id-ID").format(amount)},-`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return (
          <span className="text-[#F59E0B] font-medium bg-yellow-50 px-2 py-1 rounded-full text-xs">
            Requested
          </span>
        );
      case "COMPLETED":
        return (
          <span className="text-[#10B981] font-medium bg-green-50 px-2 py-1 rounded-full text-xs">
            Completed
          </span>
        );
      case "REJECTED":
        return (
          <span className="text-[#EF4444] font-medium bg-red-50 px-2 py-1 rounded-full text-xs">
            Rejected
          </span>
        );
      default:
        return <span className="text-gray-500">{status}</span>;
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Title Bar */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Withdrawal Verification
          </h1>
        </div>

        {/* Filter Section */}
        <div className="mb-6 bg-white p-4 rounded-xl border border-gray-100 flex flex-wrap gap-3 items-center">
          <span className="text-sm font-medium text-gray-700">
            Filter Status:
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange("REQUESTED")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === "REQUESTED"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Requested
            </button>
            <button
              onClick={() => handleFilterChange("COMPLETED")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === "COMPLETED"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => handleFilterChange("")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === ""
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : nodes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 text-gray-400">
            No withdrawal {statusFilter ? statusFilter.toLowerCase() : ""}{" "}
            records available.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
            {/* Responsiveness wrapper untuk Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-semibold text-[14px]">
                    <th className="py-4 px-6 font-medium">ID</th>
                    <th className="py-4 px-6 font-medium">Phone Number</th>
                    <th className="py-4 px-6 font-medium">Amount</th>
                    <th className="py-4 px-6 font-medium">Bank</th>
                    <th className="py-4 px-6 font-medium">Account No</th>
                    <th className="py-4 px-6 font-medium">Name</th>
                    <th className="py-4 px-6 font-medium">Request Date</th>
                    <th className="py-4 px-6 font-medium">Status</th>
                    <th className="py-4 px-6 font-medium text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[14px] text-gray-700">
                  {nodes.map((node, index) => {
                    const isRequested = node.status === "REQUESTED";
                    return (
                      <tr
                        key={node.id}
                        className="hover:bg-gray-50/40 transition-colors"
                      >
                        <td className="py-4 px-6 font-medium text-gray-900">
                          {index + 1 + (page - 1) * limit}
                        </td>
                        <td className="py-4 px-6">{node.user.phone || "-"}</td>
                        <td className="py-4 px-6 font-medium">
                          {formatRupiah(node.amount)}
                        </td>
                        <td className="py-4 px-6 uppercase">
                          {node.user.bank_name || "BCA"}
                        </td>
                        <td className="py-4 px-6 font-mono text-gray-600">
                          {node.user.bank_account_number || "8349561854"}
                        </td>
                        <td className="py-4 px-6 text-gray-900">
                          {node.user.fullname}
                        </td>
                        <td className="py-4 px-6 text-gray-500">
                          {formatDate(node.CreatedAt)}
                        </td>

                        {/* Status dengan badge yang lebih baik */}
                        <td className="py-4 px-6">
                          {getStatusBadge(node.status)}
                        </td>

                        {/* Action buttons render logic */}
                        <td className="py-4 px-6 text-center">
                          {isRequested ? (
                            <button
                              onClick={() => setSelectedNode(node)}
                              className="px-4 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-95"
                            >
                              Verify
                            </button>
                          ) : (
                            <span className="text-gray-400 font-medium text-lg">
                              -
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 py-5 border-t border-gray-50 bg-white">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-all"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                        page === i + 1
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal Controller */}
        {selectedNode && (
          <WithdrawalModal
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onConfirmComplete={handleCompleteWithdrawal}
            isProcessing={actionLoading}
          />
        )}
      </div>
    </div>
  );
}
