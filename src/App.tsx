import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import AdminLayout from "./layout/AdminLayout";
import CreateAdmin from "./pages/Auth/CreateAdmin";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Group route untuk admin yang pakai Sidebar */}
      <Route
        path="/admin"
        element={token ? <AdminLayout /> : <Navigate to="/login" />}
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="create-admin" element={<CreateAdmin />} />
      </Route>

      {/* default route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
