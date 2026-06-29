import { useState, useEffect } from "react";
import { X, User, Wallet, Calendar, Clock, DollarSign } from "lucide-react";
import { apiClient } from "../../lib/apiClient";

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
  validator_user_id: number | null;
  amount: number;
  status: "REQUESTED" | "COMPLETED" | "REJECTED";
  CreatedAt: string;
  UpdatedAt: string;
  user: User | null;
}

interface Props {
  userId: number;
  userName: string;
  userEmail: string;
  onClose: () => void;
}

export default function UserWithdrawalHistoryModal({
  userId,
  userName,
  userEmail,
  onClose,
}: Props) {
  const [nodes, setNodes] = useState<WithdrawalNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient<{
        data: {
          nodes: WithdrawalNode[];
          total: number;
        };
      }>(`/admin/users/${userId}/withdrawal-requests`, {
        method: "GET",
      });

      const data = res.data;
      const nodesData = data.nodes || [];
      setNodes(nodesData);

      // Hitung total amount dari semua history
      const total = nodesData.reduce((sum, node) => sum + node.amount, 0);
      setTotalAmount(total);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  const formatRupiah = (amount: number) => {
    return `Rp ${new Intl.NumberFormat("id-ID").format(amount)},-`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { color: string; bg: string; label: string }
    > = {
      REQUESTED: {
        color: "#F59E0B",
        bg: "bg-yellow-50",
        label: "Requested",
      },
      COMPLETED: {
        color: "#10B981",
        bg: "bg-green-50",
        label: "Completed",
      },
      REJECTED: {
        color: "#EF4444",
        bg: "bg-red-50",
        label: "Rejected",
      },
    };

    const config = statusMap[status] || {
      color: "#6B7280",
      bg: "bg-gray-50",
      label: status,
    };

    return (
      <span
        className={`${config.bg} px-3 py-1.5 rounded-full text-xs font-medium`}
        style={{ color: config.color }}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-xl">
              <Wallet className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Withdrawal History
              </h2>
              <div className="flex items-center gap-4 mt-0.5">
                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {userName}
                </p>
                <p className="text-sm text-gray-400">•</p>
                <p className="text-sm text-gray-500">{userEmail}</p>
              </div>
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
          {/* Summary Card */}
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Withdrawal</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatRupiah(totalAmount)}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Total Requests</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {nodes.length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Completed</p>
                  <p className="text-lg font-semibold text-green-600">
                    {nodes.filter((n) => n.status === "COMPLETED").length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Pending</p>
                  <p className="text-lg font-semibold text-yellow-600">
                    {nodes.filter((n) => n.status === "REQUESTED").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          ) : nodes.length === 0 ? (
            <div className="text-center py-20">
              <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No withdrawal history</p>
              <p className="text-sm text-gray-400 mt-1">
                This user hasn't made any withdrawal requests yet
              </p>
            </div>
          ) : (
            <div className="bg-gray-50/50 rounded-xl overflow-hidden border border-gray-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-100/50 text-gray-500 font-semibold text-[13px] uppercase tracking-wider">
                    <th className="py-3 px-4 font-medium">ID</th>
                    <th className="py-3 px-4 font-medium">Amount</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Request Date</th>
                    <th className="py-3 px-4 font-medium">Completed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {nodes.map((node) => (
                    <tr
                      key={node.id}
                      className="hover:bg-gray-100/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-gray-900">
                        #{node.id}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {formatRupiah(node.amount)}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(node.status)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {formatDate(node.CreatedAt)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {node.status !== "COMPLETED"
                          ? "-"
                          : formatDate(node.UpdatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
