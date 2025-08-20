import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      />
      {/* default route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
