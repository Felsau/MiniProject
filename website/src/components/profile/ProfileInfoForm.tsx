"use client";

import {
  User,
  Mail,
  Phone,
  Briefcase,
  FileText,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface ProfileInfoFormProps {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  bio: string;
  saving: boolean;
  message: { type: "success" | "error"; text: string } | null;
  onFullNameChange: (val: string) => void;
  onEmailChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  onPositionChange: (val: string) => void;
  onBioChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ProfileInfoForm({
  username,
  fullName,
  email,
  phone,
  position,
  bio,
  saving,
  message,
  onFullNameChange,
  onEmailChange,
  onPhoneChange,
  onPositionChange,
  onBioChange,
  onSubmit,
}: ProfileInfoFormProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-linear-to-r from-blue-50 to-indigo-50">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <User size={22} className="text-blue-600" />
          ข้อมูลส่วนตัว
        </h2>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-5">
        {/* Username (read-only) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            ชื่อผู้ใช้ (Username)
          </label>
          <input
            type="text"
            value={username}
            disabled
            className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <User size={14} className="text-gray-400" />
              ชื่อ-นามสกุล
            </span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            placeholder="กรอกชื่อ-นามสกุล"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Mail size={14} className="text-gray-400" />
              อีเมล
            </span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="example@email.com"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Phone size={14} className="text-gray-400" />
              เบอร์โทรศัพท์
            </span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="08x-xxx-xxxx"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
          />
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Briefcase size={14} className="text-gray-400" />
              ตำแหน่ง
            </span>
          </label>
          <input
            type="text"
            value={position}
            onChange={(e) => onPositionChange(e.target.value)}
            placeholder="ตำแหน่งงานของคุณ"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <FileText size={14} className="text-gray-400" />
              เกี่ยวกับฉัน
            </span>
          </label>
          <textarea
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            placeholder="เขียนแนะนำตัวสั้นๆ..."
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none resize-none"
          />
        </div>

        {/* Message */}
        {message && (
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {message.text}
          </div>
        )}

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </button>
      </form>
    </div>
  );
}
