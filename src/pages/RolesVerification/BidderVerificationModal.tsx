import { useState } from "react";
import { Image, X } from "lucide-react";

interface User {
  id: number;
  fullname: string;
  email: string;
  nik: string | null;
  identity_image_path: string | null;
  selfie_identity_image_path: string | null;
    identity_image_link: string | null;
  selfie_identity_image_link: string | null;
}

interface RoleRequest {
  id: number;
  user_id: number;
  user: User;
}

interface BidderVerificationModalProps {
  request: RoleRequest;
  onClose: () => void;
  onConfirmAction: (
    action: "approve" | "reject",
    rejectMessage?: string,
  ) => Promise<void>;
  isProcessing: boolean;
}

export default function BidderVerificationModal({
  request,
  onClose,
  onConfirmAction,
  isProcessing,
}: BidderVerificationModalProps) {
  const { user } = request;

  // State untuk alur dialog konfirmasi tambahan (Gambar 2 & Gambar 3)
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
      {/* Container Utama Modal (Gambar 1) */}
      <div className="bg-[#E2E8F0] w-full max-w-3xl rounded-2xl p-8 relative shadow-2xl transition-all">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Baris Foto Identitas */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Identity Image (Indikator 1) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Identity Image
            </label>
            <div className="w-full h-48 bg-white/80 rounded-xl border border-gray-300 flex flex-col items-center justify-center overflow-hidden shadow-sm">
              {user.identity_image_link ? (
                <img
                  src={user.identity_image_link}
                  alt="Identity KTP"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <Image className="w-12 h-12 stroke-[1.2]" />
                  <span className="text-xs mt-1">No Image Provided</span>
                </div>
              )}
            </div>
          </div>

          {/* Selfie Identity Image (Indikator 2) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selfie Identity Image
            </label>
            <div className="w-full h-48 bg-white/80 rounded-xl border border-gray-300 flex flex-col items-center justify-center overflow-hidden shadow-sm">
              {user.selfie_identity_image_link ? (
                <img
                  src={user.selfie_identity_image_link}
                  alt="Selfie dengan KTP"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <Image className="w-12 h-12 stroke-[1.2]" />
                  <span className="text-xs mt-1">No Image Provided</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ringkasan Data Teks (Indikator 3) */}
        <div className="bg-transparent  p-4 mb-8 space-y-2 text-[15px] font-medium text-gray-800 max-w-md">
          <div className="grid grid-cols-[100px_10px_1fr]">
            <span className="text-gray-600">Name</span>
            <span>:</span>
            <span>{user.fullname}</span>
          </div>
          <div className="grid grid-cols-[100px_10px_1fr]">
            <span className="text-gray-600">Email</span>
            <span>:</span>
            <span>{user.email || "-"}</span>
          </div>
          <div className="grid grid-cols-[100px_10px_1fr]">
            <span className="text-gray-600">NIK</span>
            <span>:</span>
            <span className="font-mono">{user.nik || "-"}</span>
          </div>
        </div>

        {/* Tombol Utama */}
        <div className="flex gap-6 justify-center">
          {/* Tombol Reject (Indikator 4) */}
          <button
            onClick={() => setConfirmType("reject")}
            disabled={isProcessing}
            className="w-48 py-3 bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold rounded-xl text-lg shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
          >
            Reject
          </button>

          {/* Tombol Verify / Approve (Indikator 5) */}
          <button
            onClick={() => setConfirmType("approve")}
            disabled={isProcessing}
            className="w-48 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl text-lg shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
          >
            Verify
          </button>
        </div>

        {/* ============================================================== */}
        {/* SUB-MODAL KONFIRMASI LAPIS KEDUA (Overlay di atas modal utama) */}
        {/* ============================================================== */}
        {confirmType && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center rounded-2xl p-6">
            <div className="bg-[#F1F5F9] w-full max-w-md rounded-2xl p-6 shadow-xl border border-gray-200 animate-scaleUp">
              <h3 className="text-gray-800 text-sm font-semibold text-center mb-4">
                {confirmType === "reject"
                  ? "Are you sure you want to reject this user's role request?"
                  : "Are you sure you want to verify this user's role?"}
              </h3>

              {/* Box Input Alasan / Message Jika Tipenya REJECT (Gambar 2 - Indikator 1) */}
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

              {/* Tombol Aksi Konfirmasi (Cancel vs Confirm) */}
              <div className="flex justify-center gap-3">
                {/* Cancel Button (Gambar 2/3 - Indikator 2/1) */}
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

                {/* Submit Button (Gambar 2/3 - Indikator 3/2) */}
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
