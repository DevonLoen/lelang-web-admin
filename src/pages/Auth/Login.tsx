import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("jerry@gmail.com");
  const [password, setPassword] = useState("123456");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      localStorage.setItem("token", "dummy_token");
      localStorage.setItem("role", "superadmin");
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0e1a2b]">
      <div className="flex flex-col items-center justify-center w-1/2 text-white">
        <div className="flex items-center space-x-4">
          <img
            src="/logo.jpg"
            alt="Logo"
            className="w-28 h-28 object-contain"
          />
          <h1 className="text-6xl font-extrabold italic tracking-wide">
            LELANG
          </h1>
        </div>
      </div>

      <div className="w-px bg-gray-700"></div>

      <div className="flex flex-col justify-center w-1/2 px-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-2">Welcome</h2>
          <p className="text-gray-300 uppercase tracking-wide text-sm">
            Please login to admin dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 bg-gray-200 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

          <button
            type="submit"
            className="w-full bg-red-600 text-white font-bold py-3 rounded-md hover:bg-red-700 transition duration-300"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
