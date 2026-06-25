import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import PaymentMethodModal from "./PaymentMethodModal";
import { apiClient } from "@/lib/apiClient";

interface PaymentMethod {
  id: number;
  name: string;
  code: string;
  type: string;
  is_active: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

interface ApiResponse {
  total: number;
  page: number;
  limit: number;
  nodes: PaymentMethod[];
}

export default function PaymentMethod() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [searchName, setSearchName] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [searchType, setSearchType] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [actionLoading, setActionLoading] = useState(false);

  // 1. GET/POST Filter Payment Methods
  const fetchPaymentMethods = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient<{
        data: ApiResponse;
      }>("/admin/payment-methods/filter", {
        method: "POST",
        body: JSON.stringify({
          page,
          limit,
          name: searchName || undefined,
          code: searchCode || undefined,
          type: searchType || undefined,
        }),
      });

      const data = res.data;
      setMethods(data.nodes || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // 2. POST — Create New Payment Method
  const handleCreateMethod = async (payload: {
    name: string;
    code: string;
    type: string;
    is_active: boolean;
  }) => {
    setActionLoading(true);

    try {
      await apiClient("/admin/payment-methods", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setIsModalOpen(false);
      await fetchPaymentMethods();
    } catch (err: any) {
      alert(err.message || "Error creating data");
    } finally {
      setActionLoading(false);
    }
  };

  // 3. PATCH — Toggle Status
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    // Optimistic UI Update
    setMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_active: !currentStatus } : m)),
    );

    try {
      await apiClient(`/admin/payment-methods/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          is_active: !currentStatus,
        }),
      });
    } catch (err: any) {
      alert(err.message || "Failed to alter toggle status");
      // Rollback
      fetchPaymentMethods();
    }
  };

  // 4. PATCH — Update Payment Method
  const handleUpdateMethod = async (
    id: number,
    payload: {
      name: string;
      code: string;
      type: string;
      is_active: boolean;
    },
  ) => {
    setActionLoading(true);

    try {
      await apiClient(`/admin/payment-methods/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      setIsModalOpen(false);
      setSelectedMethod(null);
      await fetchPaymentMethods();
    } catch (err: any) {
      alert(err.message || "Failed to update payment method");
    } finally {
      setActionLoading(false);
    }
  };

  // 5. Save Method (Create or Update)
  const handleSaveMethod = async (payload: {
    name: string;
    code: string;
    type: string;
    is_active: boolean;
  }) => {
    console.log("selectedMethod", selectedMethod);

    if (selectedMethod) {
      await handleUpdateMethod(selectedMethod.id, payload);
    } else {
      await handleCreateMethod(payload);
    }
  };

  // 6. Reset Filters
  const handleResetFilters = async () => {
    setSearchName("");
    setSearchCode("");
    setSearchType("");
    setPage(1);

    try {
      setLoading(true);
      const res = await apiClient<{
        data: {
          nodes: any[];
          total: number;
        };
      }>("/admin/payment-methods/filter", {
        method: "POST",
        body: JSON.stringify({
          page: 1,
          limit,
        }),
      });

      const data = res.data;
      setMethods(data.nodes || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // 7. Handle Search
  const handleSearch = () => {
    setPage(1);
    fetchPaymentMethods();
  };

  // 8. useEffect
  useEffect(() => {
    fetchPaymentMethods();
  }, [page]);

  // Helper pencocokan penulisan kategori string agar rapi
  const formatCategory = (type: string) => {
    if (type === "BANK_TRANSFER") return "Bank Transfer";
    if (type === "E_WALLET") return "E - Wallet";
    if (type === "QRIS") return "QR Code";
    if (type === "CREDIT_CARD") return "Credit Card";
    return type;
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section dengan Tombol Add New */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#0F172A]">Payment Method</h1>

          <button
            onClick={() => {
              setSelectedMethod(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Add Method
          </button>
        </div>

        {/* Filter Section */}
        <div className="mb-6 bg-white p-4 rounded-xl border border-gray-100 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="px-4 py-2 border rounded-lg text-sm"
          />

          <input
            type="text"
            placeholder="Search code..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="px-4 py-2 border rounded-lg text-sm"
          />

          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            <option value="">All Types</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="E_WALLET">E-Wallet</option>
            <option value="QRIS">QRIS</option>
            <option value="CREDIT_CARD">Credit Card</option>
          </select>

          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Search
          </button>

          <button
            onClick={handleResetFilters}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Table Render Container */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : methods.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 text-gray-400">
            No active payment gateways configurations registered.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-semibold text-[14px]">
                    <th className="py-4 px-6 font-medium w-20">ID</th>
                    <th className="py-4 px-6 font-medium">Method Name</th>
                    <th className="py-4 px-6 font-medium">Category</th>
                    <th className="py-4 px-6 font-medium">Code</th>
                    <th className="py-4 px-6 font-medium">Status</th>
                    <th className="py-4 px-6 font-medium text-center w-32">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[14px] text-gray-700">
                  {methods.map((method, index) => {
                    const isActive = method.is_active;
                    return (
                      <tr
                        key={method.id}
                        className="hover:bg-gray-50/40 transition-colors"
                      >
                        <td className="py-4 px-6 font-medium text-gray-900">
                          {index + 1 + (page - 1) * limit}
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-800">
                          {method.name}
                        </td>
                        <td className="py-4 px-6 text-gray-500">
                          {formatCategory(method.type)}
                        </td>

                        <td className="py-4 px-6 text-gray-500">
                          {method.code}
                        </td>

                        {/* Status styling logic */}
                        <td className="py-4 px-6">
                          {isActive ? (
                            <span className="text-[#4ADE80] font-medium">
                              Active
                            </span>
                          ) : (
                            <span className="text-[#F87171] font-medium">
                              Disabled
                            </span>
                          )}
                        </td>

                        {/* Action Toggle Switch (Buka Tutup) */}
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-4">
                            <button
                              onClick={() => {
                                setSelectedMethod(method);
                                setIsModalOpen(true);
                              }}
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                            >
                              Edit
                            </button>

                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={method.is_active}
                                onChange={() =>
                                  handleToggleStatus(
                                    method.id,
                                    method.is_active,
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                            </label>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
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

        {/* Modal Form Dialog */}
        <PaymentMethodModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMethod(null);
          }}
          onSave={handleSaveMethod}
          initialData={selectedMethod}
          isProcessing={actionLoading}
        />
      </div>
    </div>
  );
}
