import { useState, useEffect } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddAdminModal from "./AddAdminModal";
import { apiClient } from "../../lib/apiClient";

interface AdminRole {
  id: number;
  role: "ADMIN";
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface AdminUser {
  id: number;
  fullname: string;
  email: string;
  birth: string;
  gender: "MALE" | "FEMALE";
  is_verified: boolean;
  is_deleted: boolean;
  roles: AdminRole[];
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  total: number;
  page: number;
  limit: number;
  nodes: AdminUser[];
}

export default function AdminManagement() {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Modal manipulation state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient<{
        data: ApiResponse;
      }>("/admin/users/admins/filter", {
        method: "POST",
        body: JSON.stringify({
          limit,
          page,
          sorts: [
            {
              direction: "desc",
              field: "created_at",
            },
          ],
        }),
      });

      const data = res.data;
      setNodes(data.nodes || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [page]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
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

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section dengan Back Button & Add Admin Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-xl border border-gray-200/80 shadow-sm transition-all active:scale-95"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">
                Admin Management
              </h1>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            Add Admin
          </button>
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
            No admin records available.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-semibold text-[14px]">
                    <th className="py-4 px-6 font-medium w-20">No</th>
                    <th className="py-4 px-6 font-medium">Full Name</th>
                    <th className="py-4 px-6 font-medium">Email</th>
                    <th className="py-4 px-6 font-medium">Birth Date</th>
                    <th className="py-4 px-6 font-medium">Gender</th>
                    <th className="py-4 px-6 font-medium">Role</th>
                    <th className="py-4 px-6 font-medium">Join Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[14px] text-gray-700">
                  {nodes.map((node, index) => (
                    <tr
                      key={node.id}
                      className="hover:bg-gray-50/40 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-gray-900">
                        {index + 1 + (page - 1) * limit}
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-800">
                        {node.fullname}
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-gray-600">
                        {node.email}
                      </td>
                      <td className="py-4 px-6">{formatDate(node.birth)}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            node.gender === "MALE"
                              ? "bg-blue-50 text-blue-600 border border-blue-200"
                              : "bg-pink-50 text-pink-600 border border-pink-200"
                          }`}
                        >
                          {node.gender === "MALE" ? "Male" : "Female"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-blue-600 font-semibold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded text-xs">
                          {node.roles?.[0]?.role || "ADMIN"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        {formatDate(node.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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
        {isAddModalOpen && (
          <AddAdminModal
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={async () => {
              setIsAddModalOpen(false);
              await fetchAdmins();
            }}
          />
        )}
      </div>
    </div>
  );
}
