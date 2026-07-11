import { apiClient } from "../../lib/apiClient";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiClient<{
        data: {
          token: string;
        };
      }>("/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const token = res.data.token;

      localStorage.setItem("token", token);

      // Decode JWT (opsional)
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Decoded token payload:", payload);

      navigate("/admin/product");
      window.location.href = "/admin/product";
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0e1a2b]">
      {/* Left Side Branding */}
      <div className="flex flex-col items-center justify-center w-1/2 text-white">
        <div className="flex items-center space-x-4">
          <img
            src="/bidify-mark.svg"
            alt="Logo"
            className="w-28 h-28 object-contain"
          />
          <h1 className="text-6xl font-extrabold italic tracking-wide">
            Bidify
          </h1>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px bg-gray-700"></div>

      {/* Right Side Form */}
      <div className="flex flex-col justify-center w-1/2 px-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-2">Welcome</h2>
          <p className="text-gray-300 uppercase tracking-wide text-sm">
            Please login to admin dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 bg-gray-200 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-gray-200 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-500 text-sm font-medium text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white font-bold py-3 rounded-md hover:bg-red-700 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
