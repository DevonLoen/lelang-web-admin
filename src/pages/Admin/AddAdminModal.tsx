import React, { useState } from "react";

interface AddAdminModalProps {
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export default function AddAdminModal({
  onClose,
  onSuccess,
}: AddAdminModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    birth: "",
    gender: "MALE",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8080/admin/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok)
        throw new Error("Failed to register new administrator account");

      await onSuccess();
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 animate-fadeIn">
      {/* Box Modal Sesuai Ukuran dan Layout Mockup (Warna Dasar #E2E8F0) */}
      <div className="bg-[#E2E8F0] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-300 relative animate-scaleUp">
        <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">
          Register New Admin
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 text-[14px] font-medium text-gray-800 mb-6"
        >
          {/* Full Name */}
          <div className="grid grid-cols-[110px_10px_1fr] items-center">
            <span className="text-gray-600">Full Name</span>
            <span>:</span>
            <input
              type="text"
              name="fullname"
              required
              value={form.fullname}
              onChange={handleChange}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal text-gray-900"
              placeholder="e.g. Admin Baru"
            />
          </div>

          {/* Phone */}
          <div className="grid grid-cols-[110px_10px_1fr] items-center">
            <span className="text-gray-600">Phone</span>
            <span>:</span>
            <input
              type="text"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-normal text-gray-900"
              placeholder="+6281234567891"
            />
          </div>

          {/* Birth Date */}
          <div className="grid grid-cols-[110px_10px_1fr] items-center">
            <span className="text-gray-600">Birth Date</span>
            <span>:</span>
            <input
              type="date"
              name="birth"
              required
              value={form.birth}
              onChange={handleChange}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal text-gray-900"
            />
          </div>

          {/* Gender */}
          <div className="grid grid-cols-[110px_10px_1fr] items-center">
            <span className="text-gray-600">Gender</span>
            <span>:</span>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal text-gray-900"
            >
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
            </select>
          </div>

          {/* Password */}
          <div className="grid grid-cols-[110px_10px_1fr] items-center">
            <span className="text-gray-600">Password</span>
            <span>:</span>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal text-gray-900"
              placeholder="••••••••"
            />
          </div>

          {/* Action Buttons: Cancel & Submit */}
          <div className="flex justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-7 py-2 bg-[#A8A29E] hover:bg-[#78716C] text-white text-xs font-bold rounded-lg transition-colors min-w-[95px]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              className="px-7 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-lg transition-colors min-w-[95px] flex items-center justify-center"
            >
              {isProcessing ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
