import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import PaymentMethodModal from "./PaymentMethodModal";

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

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [actionLoading, setActionLoading] = useState(false);

  const getToken = (): string | null => {
    return localStorage.getItem("token");
  };

  // 1. GET — List Payment Methods
  const fetchPaymentMethods = async () => {
    setLoading(true);
    setError(null);
    const token = getToken();

    try {
      const response = await fetch(
        `http://localhost:8080/admin/payment-methods?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to load payment methods");

      const res = await response.json();
      const data: ApiResponse = res.data;

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
    const token = getToken();

    try {
      const response = await fetch(
        "http://localhost:8080/admin/payment-methods",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) throw new Error("Failed to create new payment method");

      setIsModalOpen(false);
      await fetchPaymentMethods();
    } catch (err: any) {
      alert(err.message || "Error creating data");
    } finally {
      setActionLoading(false);
    }
  };

  // 3. PATCH — Toggle Status Buka/Tutup (is_active)
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    const token = getToken();

    // Optimistic UI Update biar terasa instan di mata user
    setMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_active: !currentStatus } : m)),
    );

    try {
      const response = await fetch(
        `http://localhost:8080/admin/payment-methods/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_active: !currentStatus,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to update execution status");
    } catch (err: any) {
      alert(err.message || "Failed to alter toggle status");
      // Rollback jika request API bermasalah/gagal
      fetchPaymentMethods();
    }
  };

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
                      Action
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
                          <div className="flex justify-center items-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isActive}
                                onChange={() =>
                                  handleToggleStatus(method.id, isActive)
                                }
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
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
          onClose={() => setIsModalOpen(false)}
          onSave={handleCreateMethod}
          initialData={selectedMethod}
          isProcessing={actionLoading}
        />
      </div>
    </div>
  );
}
