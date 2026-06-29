import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import AdminLayout from "./layout/AdminLayout";
import { Toaster } from "./components/ui/toaster";
import RolesVerification from "./pages/roles-verification/RolesVerification";
import WithdrawalRequest from "./pages/withdrawal-request/WithdrawalRequest";
import PaymentMethod from "./pages/payment-method/PaymentMethod";
import AdminManagement from "./pages/admin/Admin";
import ProductRequestPage from "./pages/product/RequestProduct";
import Dashboard from "./pages/dashboard/Dashboard";
import ProductContent from "./pages/product/ProductContent";
import ProductApprovedPage from "./pages/product/VerfiedProduct";
import AuctionManagement from "./pages/auction/Auction";
import ProductRejectedPage from "./pages/product/RejectedProduct";

function App() {
  const token = localStorage.getItem("token");

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Group route untuk admin yang pakai Sidebar */}
        <Route
          path="/admin"
          element={token ? <AdminLayout /> : <Navigate to="/login" />}
        >
          {/* <Route path="dashboard" element={<Dashboard />} /> */}
          <Route path="master-admin" element={<AdminManagement />} />
          <Route path="auction" element={<AuctionManagement />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="product" element={<ProductContent />} />
          <Route path="product/request" element={<ProductRequestPage />} />
          <Route path="product/approved" element={<ProductApprovedPage />} />
          <Route path="product/rejected" element={<ProductRejectedPage />} />
          <Route path="roles-verification" element={<RolesVerification />} />
          <Route path="withdrawal-request" element={<WithdrawalRequest />} />
          <Route path="payment-method" element={<PaymentMethod />} />
        </Route>

        {/* default route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
