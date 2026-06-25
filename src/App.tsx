import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import AdminLayout from "./layout/AdminLayout";
import { Toaster } from "./components/ui/toaster";
import RolesVerification from "./pages/RolesVerification/RolesVerification";
import WithdrawalRequest from "./pages/WithdrawalRequest/WithdrawalRequest";
import PaymentMethod from "./pages/PaymentMethod/PaymentMethod";
import AdminManagement from "./pages/Admin/Admin";
import ProductRequestPage from "./pages/Product/RequestProduct";
import ProductApprovedPage from "./pages/Product/VerfiedProduct";
import ProductRejectedPage from "./pages/Product/RejectedProduct";
import Dashboard from "./pages/Dashboard/Dashboard";
import Product from "./pages/Product/Product";

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
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="product" element={<Product />} />
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
