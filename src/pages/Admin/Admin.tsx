import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Admin {
  id: string;
  fullname: string;
  phone: string;
  nik: string;
  birth: string;
  gender: string;
  bankAccountNumber: string;
  createdAt: string;
}

const AdminPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAdmins = async (pageNumber: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/v1/users?pageSize=10&pageNumber=${pageNumber}&role=ADMIN`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch admins");

      const result = await response.json();
      setAdmins(result.data);
      setTotalPage(Number(result.meta.totalPage));
    } catch (err) {
      toast.error("Failed to load admins", {
        style: { background: "#EF4444", color: "white" },
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins(page);
  }, [page]);

  return (
    <div className="flex items-center justify-center w-full px-4 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Toaster position="top-right" richColors />
      <div className="w-full md:w-5/6 lg:w-4/5 xl:w-3/4 p-8 bg-gray-950/70 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-wide">
              List of Admins
            </h2>
            <p className="text-gray-400 text-md">
              Manage and view all registered admins
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/create-admin")}
            className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            + Add Admin
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : admins.length === 0 ? (
          <p className="text-center text-gray-400">No admins found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800 text-gray-300">
                  <th className="p-3">No</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">NIK</th>
                  <th className="p-3">Birth</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">Bank Account</th>
                  <th className="p-3">Created At</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, index) => (
                  <tr
                    key={admin.id}
                    className="border-b border-gray-700 hover:bg-gray-800/60 transition"
                  >
                    <td className="p-3 text-white">{index + 1}</td>
                    <td className="p-3 text-white">{admin.fullname}</td>
                    <td className="p-3 text-gray-300">{admin.phone}</td>
                    <td className="p-3 text-gray-300">{admin.nik}</td>
                    <td className="p-3 text-gray-300">
                      {new Date(admin.birth).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-gray-300">{admin.gender}</td>
                    <td className="p-3 text-gray-300">
                      {admin.bankAccountNumber}
                    </td>
                    <td className="p-3 text-gray-400 text-sm">
                      {new Date(admin.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1 || loading}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-40 hover:bg-gray-700 transition"
          >
            Previous
          </button>
          <span className="text-gray-300">
            Page {page} of {totalPage}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPage))}
            disabled={page === totalPage || loading}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-40 hover:bg-gray-700 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
