import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

const Sidebar = ({ children }: Props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col justify-between">
        <div>
          <div className="p-4 text-xl font-bold border-b">Admin Panel</div>
          <nav className="mt-4 space-y-2">
            <Link
              to="/admin/dashboard"
              className="block px-4 py-2 hover:bg-gray-200 rounded"
            >
              Dashboard
            </Link>
          </nav>
        </div>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
};

export default Sidebar;
