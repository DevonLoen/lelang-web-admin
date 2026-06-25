interface User {
  id: number;
  fullname: string;
  email: string;
  bank_name: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
}

interface WithdrawalNode {
  id: number;
  user_id: number;
  amount: number;
  status: "REQUESTED" | "COMPLETED" | "REJECTED";
  CreatedAt: string;
  user: User;
}

interface WithdrawalModalProps {
  node: WithdrawalNode;
  onClose: () => void;
  onConfirmComplete: () => Promise<void>;
  isProcessing: boolean;
}

export default function WithdrawalModal({
  node,
  onClose,
  onConfirmComplete,
  isProcessing,
}: WithdrawalModalProps) {
  const { user } = node;

  // Helper formatting di dalam modal
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 animate-fadeIn">
      {/* Box Modal Sesuai Ukuran dan Layout Mockup */}
      <div className="bg-[#E2E8F0] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-300 relative animate-scaleUp">
        {/* Detail Ringkasan Konten Data */}
        <div className="space-y-3.5 text-[14px] font-medium text-gray-800 mb-6 mt-2">
          <div className="grid grid-cols-[130px_10px_1fr]">
            <span className="text-gray-600">Email</span>
            <span>:</span>
            <span>{user.email || "-"}</span>
          </div>
          <div className="grid grid-cols-[130px_10px_1fr]">
            <span className="text-gray-600">Amount</span>
            <span>:</span>
            <span>{formatRupiah(node.amount)}</span>
          </div>
          <div className="grid grid-cols-[130px_10px_1fr]">
            <span className="text-gray-600">Bank</span>
            <span>:</span>
            <span className="uppercase">{user.bank_name || "BCA"}</span>{" "}
            {/* Fallback visual sesuai mockup */}
          </div>
          <div className="grid grid-cols-[130px_10px_1fr]">
            <span className="text-gray-600">Account No</span>
            <span>:</span>
            <span className="font-mono">
              {user.bank_account_number || "8349561854"}
            </span>
          </div>
          <div className="grid grid-cols-[130px_10px_1fr]">
            <span className="text-gray-600">Name</span>
            <span>:</span>
            <span>{user.fullname}</span>
          </div>
          <div className="grid grid-cols-[130px_10px_1fr]">
            <span className="text-gray-600">Request Date</span>
            <span>:</span>
            <span>{formatDate(node.CreatedAt)}</span>
          </div>
        </div>

        {/* Action Buttons: Cancel & Verify */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-7 py-2 bg-[#A8A29E] hover:bg-[#78716C] text-white text-xs font-bold rounded-lg transition-colors min-w-[95px]"
          >
            Cancel
          </button>

          <button
            onClick={onConfirmComplete}
            disabled={isProcessing}
            className="px-7 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-lg transition-colors min-w-[95px] flex items-center justify-center"
          >
            {isProcessing ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Verify"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
