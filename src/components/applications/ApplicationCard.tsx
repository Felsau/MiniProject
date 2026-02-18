"use client";

import React from "react";
import {
  Briefcase,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  FileText,
  Loader2,
  User,
  ChevronDown,
  Download,
  Users,
} from "lucide-react";

interface ApplicationJob {
  title: string;
  location: string;
  department: string | null;
}

interface ApplicationUser {
  id: string;
  fullName: string | null;
  username: string;
  email: string | null;
  phone: string | null;
}

interface Application {
  id: string;
  status: string;
  createdAt: string;
  resumeUrl?: string | null;
  job: ApplicationJob;
  user?: ApplicationUser;
}

/** ฟังก์ชันแสดงสีและไอคอนตามสถานะ */
export function getStatusDetails(status: string) {
  switch (status) {
    case "HIRED":
    case "ACCEPTED":
      return { text: "รับเข้าทำงาน", color: "text-green-600 bg-green-50", icon: <CheckCircle size={16} /> };
    case "INTERVIEW":
      return { text: "สัมภาษณ์", color: "text-purple-600 bg-purple-50", icon: <Users size={16} /> };
    case "REJECTED":
      return { text: "ไม่ผ่าน", color: "text-red-600 bg-red-50", icon: <XCircle size={16} /> };
    case "OFFER":
      return { text: "ยื่นข้อเสนอ", color: "text-indigo-600 bg-indigo-50", icon: <FileText size={16} /> };
    default:
      return { text: "รอพิจารณา", color: "text-yellow-600 bg-yellow-50", icon: <Clock size={16} /> };
  }
}

interface ApplicationCardProps {
  app: Application;
  isAdminOrHR: boolean;
  updatingId: string | null;
  onUpdateStatus: (applicationId: string, newStatus: string) => void;
}

export function ApplicationCard({ app, isAdminOrHR, updatingId, onUpdateStatus }: ApplicationCardProps) {
  const status = getStatusDetails(app.status);

  return (
    <div className="p-6 hover:bg-gray-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-50 rounded-lg text-blue-600 hidden sm:block">
          <Briefcase size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{app.job.title}</h3>
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1"><MapPin size={14} /> {app.job.location || "-"}</span>
            {app.job.department && (
              <span className="flex items-center gap-1"><Briefcase size={14} /> {app.job.department}</span>
            )}
            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(app.createdAt).toLocaleDateString("th-TH")}</span>
          </div>
          {isAdminOrHR && app.user && (
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <User size={14} className="text-gray-400" />
              <span className="font-medium">{app.user.fullName || app.user.username}</span>
              {app.user.email && <span className="text-gray-400">• {app.user.email}</span>}
              {app.user.phone && <span className="text-gray-400">• {app.user.phone}</span>}
            </div>
          )}

          {app.resumeUrl && (
            <a
              href={app.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-1.5 mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition"
            >
              <Download size={14} />
              ดาวน์โหลด Resume
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-4 md:pt-0">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${status.color}`}>
          {status.icon}
          {status.text}
        </div>

        {isAdminOrHR && (
          <>
            {app.status === "PENDING" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateStatus(app.id, "INTERVIEW")}
                  disabled={updatingId === app.id}
                  className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-1"
                >
                  {updatingId === app.id ? <Loader2 size={12} className="animate-spin" /> : <Users size={12} />}
                  สัมภาษณ์
                </button>
                <button
                  onClick={() => onUpdateStatus(app.id, "REJECTED")}
                  disabled={updatingId === app.id}
                  className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-1"
                >
                  {updatingId === app.id ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                  ไม่ผ่าน
                </button>
              </div>
            )}

            {app.status === "INTERVIEW" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateStatus(app.id, "HIRED")}
                  disabled={updatingId === app.id}
                  className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-1"
                >
                  {updatingId === app.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                  รับเข้าทำงาน
                </button>
                <button
                  onClick={() => onUpdateStatus(app.id, "REJECTED")}
                  disabled={updatingId === app.id}
                  className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-1"
                >
                  {updatingId === app.id ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                  ไม่ผ่าน
                </button>
              </div>
            )}

            <div className="relative group">
              <button className="px-2 py-1 text-gray-400 hover:text-gray-600 transition text-xs flex items-center gap-1">
                <ChevronDown size={14} />
              </button>
              <div className="absolute right-0 top-full hidden group-hover:block z-20 min-w-36 pt-2">
                <div className="bg-white rounded-lg shadow-xl border border-gray-200 py-1">
                  <div className="px-3 py-1 text-[10px] text-gray-400 font-semibold bg-gray-50">เปลี่ยนเป็น</div>
                  <button onClick={() => onUpdateStatus(app.id, "PENDING")} className="w-full text-left px-4 py-2 text-sm hover:bg-yellow-50 text-yellow-700 flex items-center gap-2">
                    <Clock size={14} /> รอพิจารณา
                  </button>
                  <button onClick={() => onUpdateStatus(app.id, "INTERVIEW")} className="w-full text-left px-4 py-2 text-sm hover:bg-purple-50 text-purple-700 flex items-center gap-2">
                    <Users size={14} /> สัมภาษณ์
                  </button>
                  <button onClick={() => onUpdateStatus(app.id, "HIRED")} className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 text-green-700 flex items-center gap-2">
                    <CheckCircle size={14} /> รับเข้าทำงาน
                  </button>
                  <button onClick={() => onUpdateStatus(app.id, "REJECTED")} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-700 flex items-center gap-2">
                    <XCircle size={14} /> ไม่ผ่าน
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
