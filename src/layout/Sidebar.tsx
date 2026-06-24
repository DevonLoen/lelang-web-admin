import type { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  Shield,
  Package,
  User,
  IdCard,
  HandCoins,
  CreditCard,
} from "lucide-react";

import { parseJwt } from "../utils/parseJwt";

interface Props {
  children: ReactNode;
}

const Sidebar = ({ children }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const payload = token ? parseJwt(token) : null;
  console.log(payload);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  const menuClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
      isActiveLink(path)
        ? "bg-blue-600 text-white shadow-lg"
        : "text-slate-200 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="flex h-screen bg-slate-100">
      {/* SIDEBAR */}
      <aside className="w-[270px] bg-[#18233A] flex flex-col justify-between px-4 py-5">
        {/* TOP */}
        <div>
          {/* LOGO */}
          <div className="pb-5 border-b border-white/20">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>

              <h1 className="text-white text-2xl font-bold tracking-wide">
                Admin Panel
              </h1>
            </div>
          </div>

          {/* MENU */}
          <nav className="mt-6 flex flex-col gap-2">
            {/* SUPER ADMIN */}
            {payload?.roles?.[0] === "SUPERADMIN" && (
              <Link
                to="/admin/master-admin"
                className={menuClass("/admin/master-admin")}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Admin</span>
              </Link>
            )}

            {/* DASHBOARD */}
            {/* <Link
              to="/admin/dashboard"
              className={menuClass("/admin/dashboard")}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link> */}

            {/* PRODUCT */}
            <Link to="/admin/product" className={menuClass("/admin/product")}>
              <Package className="w-5 h-5" />
              <span className="font-medium">Product</span>
            </Link>

            {/* ROLES VERIFICATION */}
            <Link
              to="/admin/roles-verification"
              className={menuClass("/admin/roles-verification")}
            >
              <IdCard className="w-5 h-5" />
              <span className="font-medium">Roles Verification</span>
            </Link>

            {/* WITHDRAWAL REQUEST */}
            <Link
              to="/admin/withdrawal-request"
              className={menuClass("/admin/withdrawal-request")}
            >
              <HandCoins className="w-5 h-5" />
              <span className="font-medium">Withdrawal Request</span>
            </Link>

            {/* PAYMENT METHOD */}
            <Link
              to="/admin/payment-method"
              className={menuClass("/admin/payment-method")}
            >
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Payment Method</span>
            </Link>
          </nav>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/20 pt-4">
          {/* USER */}
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-semibold">
                {payload?.email?.[0] || "U"}
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                {payload?.roles[0] === "SUPERADMIN" ? "Superadmin" : "Admin"}
              </p>
              <p className="text-xs text-blue-300">{payload?.email}</p>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 transition-all duration-200 text-white py-3 rounded-2xl"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default Sidebar;
