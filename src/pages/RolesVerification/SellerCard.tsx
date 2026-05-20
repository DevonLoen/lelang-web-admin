interface User {
  fullname: string;
  phone: string;
  bank_account_number: string | null;
}

interface SellerCardProps {
  user: User;
  onClick?: () => void;
}

export default function SellerCard({ user, onClick }: SellerCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100/50 flex flex-col justify-center cursor-pointer hover:shadow-md transition-shadow min-h-[140px]"
    >
      <div className="space-y-2 text-[14px] text-gray-800">
        <div className="grid grid-cols-[160px_10px_1fr] items-center">
          <span className="text-gray-500">Name</span>
          <span>:</span>
          <span className="font-medium text-gray-900">{user.fullname}</span>
        </div>

        <div className="grid grid-cols-[160px_10px_1fr] items-center">
          <span className="text-gray-500">Phone Number</span>
          <span>:</span>
          <span className="text-gray-700">{user.phone || "-"}</span>
        </div>

        <div className="grid grid-cols-[160px_10px_1fr] items-center">
          <span className="text-gray-400">Bank Account Number</span>
          <span>:</span>
          <span className="font-mono text-gray-700">
            {user.bank_account_number || "-"}
          </span>
        </div>
      </div>
    </div>
  );
}
