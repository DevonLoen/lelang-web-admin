import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

const CreateAdmin = () => {
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [nik, setNik] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("MALE");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
   // validasi sebelum submit
if (!fullname) {
  toast.error("Full name is required!", { duration: 2500 });
  return false;
}
if (fullname.length < 3) {
  toast.error("Full name must be at least 3 characters!", { duration: 2500 });
  return false;
}

if (!phone) {
  toast.error("Phone is required!", { duration: 2500 });
  return false;
}
if (!/^\d{5,}$/.test(phone)) {
  toast.error("Phone must be at least 5 digits and only numbers!", { duration: 2500 });
  return false;
}

if (!nik) {
  toast.error("NIK is required!", { duration: 2500 });
  return false;
}
if (!/^\d{5,}$/.test(nik)) {
  toast.error("NIK must be at least 5 digits and only numbers!", { duration: 2500 });
  return false;
}

if (!birth) {
  toast.error("Birth date is required!", { duration: 2500 });
  return false;
}

if (!gender) {
  toast.error("Gender is required!", { duration: 2500 });
  return false;
}

if (!bankAccountNumber) {
  toast.error("Bank account number is required!", { duration: 2500 });
  return false;
}
if (!/^\d{5,}$/.test(bankAccountNumber)) {
  toast.error("Bank account must be at least 5 digits and only numbers!", { duration: 2500 });
  return false;
}

if (!password) {
  toast.error("Password is required!", { duration: 2500 });
  return false;
}

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/v1/auth/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullname,
          phone,
          nik,
          birth,
          gender,
          bankAccountNumber,
          password,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to create admin.", {
          style: { background: "#EF4444", color: "white" },
          duration: 3000,
        });
        throw new Error("Failed to create admin");
      }

      toast.success("Admin created successfully!", {
        style: { background: "#10B981", color: "white" },
        duration: 3000,
      });

      // reset form
      setFullname("");
      setPhone("");
      setNik("");
      setBirth("");
      setGender("MALE");
      setBankAccountNumber("");
      setPassword("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full px-4 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Toaster position="top-right" richColors />
       <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 p-10 bg-gray-950/70 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-700 relative">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center text-gray-300 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <h2 className="text-3xl font-bold text-center text-white mb-4 tracking-wide">
          Create Admin
        </h2>
        <p className="text-center text-gray-400 mb-8 text-md">
          Fill out the form to register a new admin
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              className="w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg 
              focus:ring-2 focus:ring-indigo-400 focus:outline-none text-md"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Phone</label>
            <input
              type="text"
              placeholder="Enter phone number"
              className="w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg 
              focus:ring-2 focus:ring-indigo-400 focus:outline-none text-md"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">NIK</label>
            <input
              type="text"
              placeholder="Enter NIK"
              className="w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg 
              focus:ring-2 focus:ring-indigo-400 focus:outline-none text-md"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Birth Date</label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg 
              focus:ring-2 focus:ring-indigo-400 focus:outline-none text-md"
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Gender</label>
            <select
              className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg 
              focus:ring-2 focus:ring-indigo-400 focus:outline-none text-md"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm text-gray-300 mb-2">Bank Account Number</label>
            <input
              type="text"
              placeholder="Enter bank account number"
              className="w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg 
              focus:ring-2 focus:ring-indigo-400 focus:outline-none text-md"
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm text-gray-300 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg 
              focus:ring-2 focus:ring-indigo-400 focus:outline-none text-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md 
              hover:bg-indigo-700 transition duration-300 disabled:opacity-50 text-lg"
            >
              {loading ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdmin;
