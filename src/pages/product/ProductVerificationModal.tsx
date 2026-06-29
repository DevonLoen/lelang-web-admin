import { useState, useEffect } from "react";
import { X, Check, XCircle, AlertTriangle, Send, Clock } from "lucide-react";
import { apiClient } from "../../lib/apiClient";

interface User {
  id: number;
  fullname: string;
  email: string;
  nik: string;
  is_verified: boolean;
}

interface ProductNode {
  id: number;
  name: string;
  description: string;
  condition: string;
  status: "REQUEST" | "VERIFIED" | "REJECTED";
  cover_image_link: string;
  image_links: string[];
  created_at: string;
  user: User;
}

// Tambahkan interface untuk History
interface StatusHistory {
  id: number;
  product_id: number;
  status: "REQUEST" | "VERIFIED" | "REJECTED";
  message?: string;
  created_at: string;
  updated_at: string;
}

interface ProductModalProps {
  product: ProductNode;
  onClose: () => void;
  onAction: (
    id: number,
    action: "VERIFIED" | "REJECTED",
    message?: string,
  ) => Promise<void>;
  isProcessing: boolean;
}

export default function ProductVerificationModal({
  product,
  onClose,
  onAction,
  isProcessing,
}: ProductModalProps) {
  const isPending = product.status === "REQUEST";
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");

  // State untuk menyimpan data history dan loading history
  const [histories, setHistories] = useState<StatusHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        // Menggunakan apiClient dengan method POST sesuai standar proyekmu
        const res = await apiClient<{
          data: {
            histories: StatusHistory[];
          };
        }>(`/admin/products/${product.id}/histories`, {
          method: "POST",
          body: JSON.stringify({}), // Kirim body kosong jika endpoint-nya tidak butuh payload filter tambahan
        });

        if (res?.data?.histories) {
          setHistories(res.data.histories);
        }
      } catch (err: any) {
        console.error(
          "Failed to fetch product status histories:",
          err.message || err,
        );
      } finally {
        setIsLoadingHistory(false);
      }
    };

    if (product?.id) {
      fetchHistory();
    }
  }, [product.id]);

  const handleConfirmReject = () => {
    if (!rejectMessage.trim()) {
      alert("Please provide a rejection message reason.");
      return;
    }
    setShowRejectForm(false);
    onAction(product.id, "REJECTED", rejectMessage);
  };

  const handleConfirmApprove = () => {
    setShowApproveConfirm(false);
    onAction(product.id, "VERIFIED");
  };

  // Helper untuk styling badge status di timeline
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-100 text-green-700 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden relative flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Product Verification Detail
            </h2>
            <p className="text-xs text-gray-500 font-mono">ID: {product.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Section 1: Product Specs */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
              Product Images
            </h3>

            <div className="space-y-4">
              {/* Cover Image */}
              {product.cover_image_link && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2">
                    Cover Image
                  </label>

                  <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                    <img
                      src={product.cover_image_link}
                      alt="Cover Product"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Product Images */}
              {product.image_links?.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2">
                    Additional Images
                  </label>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {product.image_links.map((image, index) => (
                      <div
                        key={index}
                        className="h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
                      >
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
              Product Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <span className="block text-xs font-semibold text-gray-400">
                  Product Name
                </span>
                <span className="text-base font-semibold text-gray-800">
                  {product.name}
                </span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-400">
                  Condition
                </span>
                <span
                  className={`inline-block mt-1 px-2.5 py-0.5 rounded-md text-xs font-bold ${
                    product.condition === "NEW"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {product.condition}
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="block text-xs font-semibold text-gray-400">
                  Description
                </span>
                <p className="text-gray-600 mt-0.5 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Seller Profile */}

          {/* BARU: Section 3 - Status Histories Timeline */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
              Status History Logs
            </h3>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
              {isLoadingHistory ? (
                <div className="flex items-center justify-center py-4 gap-2 text-gray-400 text-xs">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                  Loading history logs...
                </div>
              ) : histories.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-2">
                  No history data available.
                </p>
              ) : (
                <div className="relative border-l border-gray-200 ml-2.5 pl-4 space-y-4">
                  {histories.map((history) => (
                    <div key={history.id} className="relative text-xs">
                      {/* Titik Timeline */}
                      <span className="absolute -left-[22.5px] top-1 flex h-3 w-3 items-center justify-center rounded-full bg-white border border-gray-300 shadow-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                      </span>

                      {/* Konten Timeline */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded font-bold border text-[10px] ${getStatusBadgeClass(history.status)}`}
                        >
                          {history.status}
                        </span>
                        <span className="text-gray-400 font-mono text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(history.created_at).toLocaleString(
                            "id-ID",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            },
                          )}
                        </span>
                      </div>

                      {/* Pesan Penolakan jika Status REJECTED */}
                      {history.status === "REJECTED" && history.message && (
                        <div className="mt-1.5 p-2 bg-red-50/50 text-red-600 rounded-lg border border-red-100 max-w-md">
                          <span className="font-semibold block text-[11px] text-red-700 mb-0.5">
                            Reason:
                          </span>
                          <p className="leading-relaxed text-gray-700">
                            {history.message}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
              Seller Details
            </h3>
            <div className="space-y-2.5 font-medium text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="grid grid-cols-[120px_10px_1fr]">
                <span className="text-gray-400">Full Name</span>
                <span>:</span>
                <span className="text-gray-900">{product.user.fullname}</span>
              </div>
              <div className="grid grid-cols-[120px_10px_1fr]">
                <span className="text-gray-400">Email</span>
                <span>:</span>
                <span>{product.user.email}</span>
              </div>
              <div className="grid grid-cols-[120px_10px_1fr]">
                <span className="text-gray-400">NIK (KTP)</span>
                <span>:</span>
                <span className="font-mono">{product.user.nik}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-5 py-2 bg-gray-400 hover:bg-gray-500 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Close
          </button>

          {isPending && (
            <>
              <button
                onClick={() => setShowRejectForm(true)}
                disabled={isProcessing}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>

              <button
                onClick={() => setShowApproveConfirm(true)}
                disabled={isProcessing}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                Approve Verified
              </button>
            </>
          )}
        </div>
      </div>

      {/* Confirm Approve Modal */}
      {showApproveConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-fadeIn">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Approval
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to approve this product?
                <br />
                <span className="font-medium text-gray-700">
                  "{product.name}"
                </span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowApproveConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApprove}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Reject Modal */}
      {showRejectForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden animate-fadeIn">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Reject Product
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Please provide a reason for rejecting this product
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectMessage("");
                  }}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product Name */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 font-medium">Product</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">
                  {product.name}
                </p>
              </div>

              {/* Rejection Reason */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectMessage}
                  onChange={(e) => setRejectMessage(e.target.value)}
                  placeholder="Explain why this product is being rejected..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-800 text-sm placeholder:text-gray-400 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  {rejectMessage.length}/500 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectMessage("");
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  disabled={isProcessing || !rejectMessage.trim()}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
