import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import AdminLayout from "./layout/AdminLayout";
import CreateAdmin from "./pages/Admin/CreateAdmin";
import Product from "./pages/product/product";
import PendingProduct from "./pages/product/pending-product";
import { Toaster } from "./components/ui/toaster";
import AdminPage from "./pages/Admin/Admin";

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
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="master-admin" element={<AdminPage />} />
          <Route path="create-admin" element={<CreateAdmin />} />
          <Route path="product" element={<Product />} />
          <Route path="product/pending" element={<PendingProduct />} />
        </Route>

        {/* default route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
