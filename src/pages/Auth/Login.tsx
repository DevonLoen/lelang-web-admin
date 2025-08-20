import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("jerry@gmail.com");
  const [password, setPassword] = useState("asu1321@jjf_a");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem("token", "dummy_token");
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-950/70 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-700">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-white mb-8 tracking-wide">
          Admin Login
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-white text-gray-900 font-semibold py-3 rounded-lg shadow-md hover:bg-gray-200 transition duration-300"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          © {new Date().getFullYear()} Lelang Admin Web
        </p>
      </div>
    </div>
  );
};

export default Login;
