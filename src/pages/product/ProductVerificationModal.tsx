import { useState } from "react";
import { X, Check, XCircle, AlertTriangle } from "lucide-react";

interface User {
  id: string;
  fullname: string;
  phone: string;
  nik: string;
  is_verified: boolean;
}

interface ProductNode {
  id: string;
  name: string;
  description: string;
  condition: string;
  status: "REQUEST" | "VERIFIED" | "REJECTED";
  image_links: string[];
  created_at: string;
  user: User;
}

interface ProductModalProps {
  product: ProductNode;
  onClose: () => void;
  onAction: (
    id: string,
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

  const handleConfirmReject = () => {
    if (!rejectMessage.trim()) {
      alert("Please provide a rejection message reason.");
      return;
    }
    onAction(product.id, "REJECTED", rejectMessage);
  };

  const handleConfirmApprove = () => {
    setShowApproveConfirm(false);
    onAction(product.id, "VERIFIED");
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
                  className={`inline-block mt-1 px-2.5 py-0.5 rounded-md text-xs font-bold ${product.condition === "NEW" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
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
                <span className="text-gray-400">Phone Number</span>
                <span>:</span>
                <span>{product.user.phone}</span>
              </div>
              <div className="grid grid-cols-[120px_10px_1fr]">
                <span className="text-gray-400">NIK (KTP)</span>
                <span>:</span>
                <span className="font-mono">{product.user.nik}</span>
              </div>
              <div className="grid grid-cols-[120px_10px_1fr]">
                <span className="text-gray-400">Account Status</span>
                <span>:</span>
                <span>
                  {product.user.is_verified ? (
                    <span className="text-green-600 font-semibold text-xs bg-green-50 px-2 py-0.5 rounded border border-green-200">
                      Verified Seller
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold text-xs bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      Unverified
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Section 3: Rejection Feedback Box */}
          {showRejectForm && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-3 animate-fadeIn">
              <label className="block text-xs font-bold text-red-700 uppercase tracking-wider">
                Rejection Reason (Required)
              </label>
              <textarea
                value={rejectMessage}
                onChange={(e) => setRejectMessage(e.target.value)}
                placeholder="Specify why this item is being rejected (e.g. Invalid document details, blurred photos...)"
                rows={3}
                className="w-full bg-white border border-red-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/20 text-gray-800 text-sm placeholder:text-gray-400"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectForm(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  disabled={isProcessing}
                  className="px-3 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          )}
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

          {isPending && !showRejectForm && (
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
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
    </div>
  );
}
