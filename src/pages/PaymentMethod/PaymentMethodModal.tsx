import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface PaymentMethod {
  id?: number;
  name: string;
  code: string;
  type: string;
  is_active: boolean;
}

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    code: string;
    type: string;
    is_active: boolean;
  }) => Promise<void>;
  initialData?: PaymentMethod | null;
  isProcessing: boolean;
}

export default function PaymentMethodModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isProcessing,
}: PaymentMethodModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("BANK_TRANSFER");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCode(initialData.code);
      setType(initialData.type);
      setIsActive(initialData.is_active);
    } else {
      setName("");
      setCode("");
      setType("BANK_TRANSFER");
      setIsActive(true);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;
    onSave({ name, code, type, is_active: isActive });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
      <div className="bg-[#E2E8F0] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-300 relative animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-gray-800 mb-5">
          {initialData ? "Edit Payment Method" : "Add Payment Method"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
              Method Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., BCA Virtual Account"
              className="w-full p-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 shadow-inner"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
              Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g., bca_va"
              className="w-full p-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-mono shadow-inner"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
              Category Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 shadow-inner"
            >
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="E_WALLET">E-Wallet</option>
              <option value="QRIS">QR Code</option>
              <option value="CREDIT_CARD">Credit Card</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs font-bold text-gray-600 uppercase">
              Default Status:
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                {isActive ? "Active" : "Disabled"}
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-300/50 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-5 py-2 bg-[#A8A29E] hover:bg-[#78716C] text-white text-xs font-bold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center min-w-[80px]"
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
