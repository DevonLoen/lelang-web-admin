interface User {
  fullname: string;
  email: string;
  nik: string | null;
}

interface BidderCardProps {
  user: User;
  onClick?: () => void;
}

export default function BidderCard({ user, onClick }: BidderCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100/50 flex flex-col justify-center cursor-pointer hover:shadow-md transition-shadow min-h-[140px]"
    >
      <div className="space-y-2 text-[14px] text-gray-800">
        <div className="grid grid-cols-[120px_10px_1fr] items-center">
          <span className="text-gray-500">Name</span>
          <span>:</span>
          <span className="font-medium text-gray-900">{user.fullname}</span>
        </div>

        <div className="grid grid-cols-[120px_10px_1fr] items-center">
          <span className="text-gray-500">Email</span>
          <span>:</span>
          <span className="text-gray-700">{user.email || "-"}</span>
        </div>

        <div className="grid grid-cols-[120px_10px_1fr] items-center">
          <span className="text-gray-400">NIK</span>
          <span>:</span>
          <span className="font-mono text-gray-700">{user.nik || "-"}</span>
        </div>
      </div>
    </div>
  );
}
