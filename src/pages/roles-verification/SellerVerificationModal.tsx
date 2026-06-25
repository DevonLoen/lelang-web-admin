import { useState } from "react";
import { X } from "lucide-react";

interface User {
  id: number;
  fullname: string;
  email: string;
  bank_account_number: string | null;
  bank_account_name: string | null;
  bank_name: string | null;
}

interface RoleRequest {
  id: number;
  user_id: number;
  user: User;
}

interface SellerVerificationModalProps {
  request: RoleRequest;
  onClose: () => void;
  onConfirmAction: (
    action: "approve" | "reject",
    rejectMessage?: string,
  ) => Promise<void>;
  isProcessing: boolean;
}

export default function SellerVerificationModal({
  request,
  onClose,
  onConfirmAction,
  isProcessing,
}: SellerVerificationModalProps) {
  const { user } = request;

  const [confirmType, setConfirmType] = useState<"approve" | "reject" | null>(
    null,
  );
  const [rejectMessage, setRejectMessage] = useState("");

  const handleActionSubmit = async () => {
    if (!confirmType) return;
    await onConfirmAction(
      confirmType,
      confirmType === "reject" ? rejectMessage : undefined,
    );
    setConfirmType(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 animate-fadeIn">
      <div className="bg-[#E2E8F0] w-full max-w-2xl rounded-2xl p-8 relative shadow-2xl transition-all">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-transparent p-5 mb-8 space-y-3 text-[15px] font-medium text-gray-800 max-w-xl mx-auto">
          <div className="grid grid-cols-[180px_10px_1fr]">
            <span className="text-gray-600">Name</span>
            <span>:</span>
            <span>{user.fullname}</span>
          </div>
          <div className="grid grid-cols-[180px_10px_1fr]">
            <span className="text-gray-600">Email</span>
            <span>:</span>
            <span>{user.email || "-"}</span>
          </div>
          <div className="grid grid-cols-[180px_10px_1fr]">
            <span className="text-gray-600">Bank Account Number</span>
            <span>:</span>
            <span className="font-mono">{user.bank_account_number || "-"}</span>
          </div>
          <div className="grid grid-cols-[180px_10px_1fr]">
            <span className="text-gray-600">Bank Account Name</span>
            <span>:</span>
            <span>{user.bank_account_name || "-"}</span>
          </div>
          <div className="grid grid-cols-[180px_10px_1fr]">
            <span className="text-gray-600">Bank Name</span>
            <span>:</span>
            <span>{user.bank_name || "-"}</span>
          </div>
        </div>

        {/* Tombol Utama Reject & Verify */}
        <div className="flex gap-6 justify-center">
          {/* Tombol Reject (Indikator 2) */}
          <button
            onClick={() => setConfirmType("reject")}
            disabled={isProcessing}
            className="w-44 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold rounded-xl text-md shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
          >
            Reject
          </button>

          {/* Tombol Verify (Indikator 3) */}
          <button
            onClick={() => setConfirmType("approve")}
            disabled={isProcessing}
            className="w-44 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl text-md shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
          >
            Verify
          </button>
        </div>

        {confirmType && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center rounded-2xl p-6">
            <div className="bg-[#F1F5F9] w-full max-w-md rounded-2xl p-6 shadow-xl border border-gray-200 animate-scaleUp">
              <h3 className="text-gray-800 text-sm font-semibold text-center mb-4">
                {confirmType === "reject"
                  ? "Are you sure you want to reject this user's role request?"
                  : "Are you sure you want to verify this user's role?"}
              </h3>

              {/* Box Input Alasan jika Reject */}
              {confirmType === "reject" && (
                <div className="mb-5">
                  <textarea
                    value={rejectMessage}
                    onChange={(e) => setRejectMessage(e.target.value)}
                    placeholder="Write your message here.."
                    rows={4}
                    className="w-full p-3 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-700 resize-none shadow-inner"
                  />
                </div>
              )}

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setConfirmType(null);
                    setRejectMessage("");
                  }}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-[#A8A29E] hover:bg-[#78716C] text-white text-xs font-bold rounded-lg transition-colors min-w-[90px]"
                >
                  Cancel
                </button>

                <button
                  onClick={handleActionSubmit}
                  disabled={
                    isProcessing ||
                    (confirmType === "reject" && !rejectMessage.trim())
                  }
                  className={`px-6 py-2 text-white text-xs font-bold rounded-lg transition-colors min-w-[90px] flex items-center justify-center ${
                    confirmType === "reject"
                      ? "bg-[#E11D48] hover:bg-[#BE123C] disabled:bg-rose-300"
                      : "bg-[#2563EB] hover:bg-[#1D4ED8]"
                  }`}
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : confirmType === "reject" ? (
                    "Reject"
                  ) : (
                    "Verify"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
