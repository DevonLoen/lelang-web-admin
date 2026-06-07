import { useState, useEffect } from "react";
import BidderCard from "./BidderCard";
import SellerCard from "./SellerCard";
import BidderVerificationModal from "./BidderVerificationModal";
import SellerVerificationModal from "./SellerVerificationModal";

interface User {
  id: string;
  fullname: string;
  phone: string;
  nik: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
  bank_name: string | null;
  identity_image_path: string | null;
  selfie_identity_image_path: string | null;
}

interface RoleRequest {
  id: number;
  user_id: string;
  status: "REQUESTED" | "APPROVED" | "REJECTED";
  role: "BIDDER" | "SELLER";
  message: string | null;
  CreatedAt: string;
  UpdatedAt: string;
  user: User;
}

interface ApiResponse {
  total: number;
  page: number;
  limit: number;
  nodes: RoleRequest[];
}

type TabType = "BIDDER" | "SELLER";

export default function RolesVerification() {
  const [activeTab, setActiveTab] = useState<TabType>("BIDDER");
  const [requests, setRequests] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [selectedRequest, setSelectedRequest] = useState<RoleRequest | null>(
    null,
  );
  const [actionLoading, setActionLoading] = useState(false);

  const limit = 9;

  const getToken = (): string | null => {
    return localStorage.getItem("token");
  };

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);

    const token = getToken();
    if (!token) {
      setError("No authentication token found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/admin/role-requests/list/${activeTab}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            limit,
            page,
            role: activeTab,
            status: "REQUESTED",
          }),
        },
      );

      if (response.status === 401) {
        setError("Session expired. Please login again.");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }

      const res = await response.json();
      const data: ApiResponse = res.data;

      setRequests(data.nodes || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePatchVerification = async (
    action: "approve" | "reject",
    message?: string,
  ) => {
    if (!selectedRequest) return;

    setActionLoading(true);
    setError(null);
    const token = getToken();

    try {
      const { user_id, id } = selectedRequest;
      const url = `http://localhost:8080/admin/users/${user_id}/role-requests/${id}/${action}`;

      const config: RequestInit = {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      if (action === "reject" && message) {
        config.body = JSON.stringify({ message: message });
      }

      const response = await fetch(url, config);

      if (response.status === 401) {
        throw new Error("Session expired. Please login again.");
      }
      if (!response.ok) {
        throw new Error(`Failed to ${action} request`);
      }

      setSelectedRequest(null);
      await fetchRequests();
    } catch (err: any) {
      alert(err.message || "Error processing action");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchRequests();
  }, [activeTab]);

  useEffect(() => {
    fetchRequests();
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Title (Gambar 1 & 2 - Indikator 1) */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Roles Verification
          </h1>
        </div>

        {/* Tabs Changer (Gambar 1 & 2 - Indikator 2) */}
        <div className="border-b border-gray-300 mb-6">
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveTab("BIDDER")}
              className={`pb-3 text-sm font-medium transition-all ${
                activeTab === "BIDDER"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-400"
              }`}
            >
              Bidder
            </button>
            <button
              onClick={() => setActiveTab("SELLER")}
              className={`pb-3 text-sm font-medium transition-all ${
                activeTab === "SELLER"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-400"
              }`}
            >
              Seller
            </button>
          </nav>
        </div>

        {/* Error handling component */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Loader atau List Cards Grid (Gambar 1 & 2 - Indikator 3) */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 text-gray-400">
            No pending {activeTab.toLowerCase()} verification requests.
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {requests.map((request) =>
                activeTab === "BIDDER" ? (
                  <BidderCard
                    key={request.id}
                    user={request.user}
                    onClick={() => setSelectedRequest(request)}
                  />
                ) : (
                  <SellerCard
                    key={request.id}
                    user={request.user}
                    onClick={() => setSelectedRequest(request)}
                  />
                ),
              )}
            </div>

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        page === i + 1
                          ? "bg-blue-600 text-white"
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
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal Layer Controller */}
        {selectedRequest && activeTab === "BIDDER" && (
          <BidderVerificationModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onConfirmAction={handlePatchVerification}
            isProcessing={actionLoading}
          />
        )}

        {selectedRequest && activeTab === "SELLER" && (
          <SellerVerificationModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onConfirmAction={handlePatchVerification}
            isProcessing={actionLoading}
          />
        )}
      </div>
    </div>
  );
}
