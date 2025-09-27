import type { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard,  LogOut, Shield, User } from "lucide-react";
import { parseJwt } from "../utils/parseJwt";

interface Props {
  children: ReactNode;
}

const Sidebar = ({ children }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const payload = token ? parseJwt(token) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Cek link aktif
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-72 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-40 bg-white/5 rounded-b-full"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600/10 rounded-tl-full"></div>

        <div className="relative z-10">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            </div>
          </div>

          <nav className="mt-6 space-y-1 px-4">
            {/* sementara tampilkan hanya kalau phone dari token = 088469547852, kedepannya by role */}
            {payload?.phone === "088469547852" && (
              <Link
                to="/admin/master-admin"
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActiveLink("/admin/master-admin")
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <User className="h-5 w-5 mr-3" />
                <span className="font-medium">Admin</span>
              </Link>
            )}

            <Link
              to="/admin/dashboard"
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                isActiveLink("/admin/dashboard")
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </nav>
        </div>

        <div className="relative z-10 p-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {payload?.phone?.[0] || "U"}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-blue-200">{payload?.phone}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200 group"
          >
            <LogOut className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default Sidebar;
