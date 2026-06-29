import { useState, useEffect } from "react";
import {
  X,
  History,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Hash,
} from "lucide-react";
import { apiClient } from "../../lib/apiClient";

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

interface RoleRequestLog {
  id: number;
  user_id: number;
  validator_user_id: number | null;
  role: "BIDDER" | "SELLER";
  status: "REQUESTED" | "APPROVED" | "REJECTED";
  message: string | null;
  CreatedAt: string;
  UpdatedAt: string;
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

  // State untuk history logs
  const [showHistory, setShowHistory] = useState(false);
  const [logs, setLogs] = useState<RoleRequestLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState<string | null>(null);

  const handleActionSubmit = async () => {
    if (!confirmType) return;
    await onConfirmAction(
      confirmType,
      confirmType === "reject" ? rejectMessage : undefined,
    );
    setConfirmType(null);
  };

  // Fetch history logs
  const fetchHistoryLogs = async () => {
    if (!user?.id) return;

    setLogsLoading(true);
    setLogsError(null);

    try {
      const res = await apiClient<{
        data: {
          role_requests: RoleRequestLog[];
          total: number;
        };
      }>(`/admin/users/${user.id}/role-requests/logs`, {
        method: "GET",
      });

      setLogs(res.data.role_requests || []);
    } catch (err: any) {
      setLogsError(err.message || "Failed to load history");
    } finally {
      setLogsLoading(false);
    }
  };

  // Load history when modal opens
  useEffect(() => {
    if (user?.id) {
      fetchHistoryLogs();
    }
  }, [user?.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { color: string; bg: string; label: string; icon: any }
    > = {
      REQUESTED: {
        color: "#F59E0B",
        bg: "bg-yellow-50",
        label: "Requested",
        icon: Clock,
      },
      APPROVED: {
        color: "#10B981",
        bg: "bg-green-50",
        label: "Approved",
        icon: CheckCircle,
      },
      REJECTED: {
        color: "#EF4444",
        bg: "bg-red-50",
        label: "Rejected",
        icon: XCircle,
      },
    };

    const config = statusMap[status] || {
      color: "#6B7280",
      bg: "bg-gray-50",
      label: status,
      icon: AlertCircle,
    };

    const Icon = config.icon;

    return (
      <span
        className={`${config.bg} px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1`}
        style={{ color: config.color }}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 animate-fadeIn">
      <div className="bg-[#E2E8F0] w-full max-w-2xl rounded-2xl p-8 relative shadow-2xl transition-all max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-200 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-transparent p-5 mb-6 space-y-3 text-[15px] font-medium text-gray-800 max-w-xl mx-auto">
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

        {/* History Section - Toggle */}
        <div className="mb-6 max-w-xl mx-auto">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
            <History className="w-4 h-4" />
            Request History
          </div>

          <div className="mt-3 bg-white/80 rounded-xl border border-gray-200 p-4 max-h-48 overflow-y-auto">
            {logsLoading ? (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : logsError ? (
              <p className="text-sm text-red-500">{logsError}</p>
            ) : logs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                No previous role requests
              </p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="text-gray-500 font-medium border-b border-gray-200">
                  <tr>
                    <th className="pb-2 pr-3">ID</th>
                    <th className="pb-2 pr-3">Role</th>
                    <th className="pb-2 pr-3">Status</th>
                    <th className="pb-2 pr-3">Date</th>
                    <th className="pb-2">Reject Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50">
                      <td className="py-2 pr-3 font-mono text-xs">#{log.id}</td>
                      <td className="py-2 pr-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            log.role === "BIDDER"
                              ? "bg-purple-50 text-purple-600"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {log.role}
                        </span>
                      </td>
                      <td className="py-2 pr-3">
                        {getStatusBadge(log.status)}
                      </td>
                      <td className="py-2 pr-3 text-xs text-gray-500">
                        {formatDate(log.CreatedAt)}
                      </td>

                      <td className="py-2 text-xs">
                        {log.message ? (
                          <span className="text-red-600">{log.message}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Tombol Utama Reject & Verify */}
        <div className="flex gap-6 justify-center">
          <button
            onClick={() => setConfirmType("reject")}
            disabled={isProcessing}
            className="w-44 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold rounded-xl text-md shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
          >
            Reject
          </button>

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
