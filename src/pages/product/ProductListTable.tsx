import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductVerificationModal from "./ProductVerificationModal";

interface ProductListTableProps {
  statusFilter: "REQUEST" | "VERIFIED" | "REJECTED";
  title: string;
}

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

const normalizeProduct = (product: ProductNode): ProductNode => ({
  ...product,
  id: Number(product.id),
  user: {
    ...product.user,
    id: Number(product.user.id),
  },
});

export function ProductListTable({
  statusFilter,
  title,
}: ProductListTableProps) {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [selectedProduct, setSelectedProduct] = useState<ProductNode | null>(
    null,
  );
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:8080/admin/products/filter",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            limit: limit,
            page: page,
            sorts: [
              {
                direction: "desc",
                field: "created_at",
              },
            ],
            status: statusFilter,
          }),
        },
      );

      if (!response.ok)
        throw new Error("Failed to fetch products filtering criteria");

      const res = await response.json();
      setProducts((res.data.nodes || []).map(normalizeProduct));
      setTotal(res.data.total || 0);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAction = async (
    id: number,
    targetStatus: "VERIFIED" | "REJECTED",
    message?: string,
  ) => {
    setActionLoading(true);
    const token = localStorage.getItem("token");

    // Sesuaikan path segmen endpoint dengan rute baru Go REST API:
    // /admin/users/:userId/products/:productId/approve ATAU /admin/users/:userId/products/:productId/reject
    const actionSegment = targetStatus === "VERIFIED" ? "approve" : "reject";
    const userId = selectedProduct?.user?.id;

    if (!userId) {
      alert("Error: Missing associated user contextual mapping reference");
      setActionLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/admin/users/${userId}/products/${id}/${actionSegment}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // Masukkan request body message JSON jika statusnya REJECTED
          body:
            targetStatus === "REJECTED"
              ? JSON.stringify({ message })
              : undefined,
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to change product status to ${targetStatus}`,
        );
      }

      setSelectedProduct(null);
      await fetchProducts();
    } catch (err: any) {
      alert(err.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, statusFilter]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section dengan Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-xl border border-gray-200/80 shadow-sm transition-all active:scale-95"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">{title}</h1>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 text-gray-400">
            No items listed in this segment.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-semibold text-[14px]">
                    <th className="py-4 px-6 font-medium w-20">No</th>
                    <th className="py-4 px-6 font-medium">Product Name</th>
                    <th className="py-4 px-6 font-medium">Seller Name</th>
                    <th className="py-4 px-6 font-medium">Email</th>
                    <th className="py-4 px-6 font-medium">Condition</th>
                    <th className="py-4 px-6 font-medium">Global Status</th>
                    <th className="py-4 px-6 font-medium text-center w-36">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[14px] text-gray-700">
                  {products.map((product, index) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50/40 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-gray-900">
                        {index + 1 + (page - 1) * limit}
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-800">
                        {product.name}
                      </td>
                      <td className="py-4 px-6">
                        {product.user?.fullname || "-"}
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-gray-500">
                        {product.user?.email || "-"}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${product.condition === "NEW" ? "bg-green-50 text-green-600 border border-green-200" : "bg-amber-50 text-amber-600 border border-amber-200"}`}
                        >
                          {product.condition}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`font-semibold ${statusFilter === "REQUEST" ? "text-yellow-500" : statusFilter === "VERIFIED" ? "text-blue-500" : "text-red-500"}`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="px-3.5 py-1.5 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded-lg transition-all"
                        >
                          {statusFilter === "REQUEST"
                            ? "Verify Process"
                            : "View Detail"}
                        </button>
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
                  className="px-4 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold ${page === i + 1 ? "bg-blue-600 text-white" : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-100"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {selectedProduct && (
          <ProductVerificationModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAction={handleVerifyAction}
            isProcessing={actionLoading}
          />
        )}
      </div>
    </div>
  );
}
