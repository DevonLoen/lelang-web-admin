import { useState } from "react";

const CreateAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    setTimeout(() => {
      console.log("API CALLED:", { email, password });
      setLoading(false);
      setSuccess(true);
      setEmail("");
      setPassword("");
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center w-full px-4 min-h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full md:w-2/3 lg:w-1/2 xl:w-2/5 p-8 bg-gray-950/70 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-white mb-4 tracking-wide">
          Create Admin
        </h2>
        <p className="text-center text-gray-400 mb-8 text-md">
          Fill the form below to add a new admin
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-md text-gray-300 mb-3">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-md text-gray-300 mb-3">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 disabled:opacity-50 text-lg"
          >
            {loading ? "Creating..." : "Create Admin"}
          </button>
        </form>

        {success && (
          <p className="mt-6 text-center text-green-400 font-medium text-lg">
            ✅ Admin created successfully!
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateAdmin;
