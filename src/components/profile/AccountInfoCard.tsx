"use client";

interface AccountInfoCardProps {
  username: string;
  role: string;
}

export function AccountInfoCard({ username, role }: AccountInfoCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
        ข้อมูลบัญชี
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">ชื่อผู้ใช้</span>
          <span className="font-semibold text-gray-800">{username}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">บทบาท</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              role === "ADMIN"
                ? "bg-purple-100 text-purple-700"
                : role === "HR"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {role}
          </span>
        </div>
      </div>
    </div>
  );
}
