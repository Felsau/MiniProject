"use client";

import {
  MapPin,
  Briefcase,
  Trash2,
  Edit2,
  DollarSign,
  Calendar,
  User,
  Power,
  RotateCcw,
  Users,
  Loader2,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { getEmploymentTypeLabel } from "@/utils/jobListHelpers";
import { JobWithCount } from "@/types";
import Link from "next/link";
import { useState } from "react";

interface JobCardProps {
  job: JobWithCount;
  userRole?: string;
  onEdit?: (job: JobWithCount) => void;
  onKill?: (jobId: string) => Promise<boolean>;
  onRestore?: (jobId: string) => Promise<boolean>;
  onDelete?: (jobId: string) => Promise<boolean>;
  onApply?: () => void;
  isApplying?: boolean;
  isBookmarked?: boolean;
  onBookmark?: (jobId: string) => Promise<void>;
  onUnbookmark?: (jobId: string) => Promise<void>;
}

export function JobCard({
  job,
  userRole,
  onEdit,
  onKill,
  onRestore,
  onDelete,
  onApply,
  isApplying,
  isBookmarked = false,
  onBookmark,
  onUnbookmark
}: JobCardProps) {
  const applicantCount = job._count?.applications || 0;
  const isAdminOrHR = userRole === "ADMIN" || userRole === "HR";
  const [bookmarking, setBookmarking] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleBookmark = async () => {
    if (bookmarking) return;
    
    setBookmarking(true);
    try {
      if (bookmarked) {
        await onUnbookmark?.(job.id);
        setBookmarked(false);
      } else {
        await onBookmark?.(job.id);
        setBookmarked(true);
      }
    } catch (error) {
      console.error("Bookmark error:", error);
    } finally {
      setBookmarking(false);
    }
  };

  const cardStyle = job.isActive
    ? "bg-white border-gray-200 hover:shadow-md"
    : "bg-gray-100 border-gray-300 border-dashed opacity-90";

  return (
    <div className={`group rounded-xl border p-5 shadow-sm transition-all duration-200 flex flex-col h-full relative ${cardStyle}`}>

      {/* 1. ส่วนหัว (Title & Status) */}
      <div className="flex justify-between items-start mb-3">
        <h3 className={`text-lg font-bold line-clamp-2 leading-tight ${job.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
          {job.title}
        </h3>
        {!job.isActive && (
          <span className="shrink-0 ml-2 px-2 py-1 bg-red-100 text-red-700 text-[13px] font-bold rounded-full border border-red-200">
            ปิดรับสมัคร
          </span>
        )}
      </div>

      {/* 2. ข้อมูลงาน (Tags) */}
      <div className="space-y-2 mb-4 text-sm text-gray-500">
        {job.department && (
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="shrink-0" />
            <span className="line-clamp-1">{job.department}</span>
          </div>
        )}
        {job.location && (
          <div className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0" />
            <span className="line-clamp-1">{job.location}</span>
          </div>
        )}
        {job.salary && (
          <div className="flex items-center gap-2 font-medium text-emerald-600">
            <DollarSign size={14} className="shrink-0" />
            <span>{job.salary}</span>
          </div>
        )}
      </div>

      {/* 3. Badge ประเภทงาน */}
      <div className="mb-4">
        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${job.isActive
            ? "bg-blue-50 text-blue-600 border-blue-100"
            : "bg-gray-200 text-gray-500 border-gray-300"
          }`}>
          {getEmploymentTypeLabel(job.employmentType)}
        </span>
      </div>

      {/* 4. รายละเอียด (Description) */}
      <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed grow">
        {job.description || "ไม่มีรายละเอียด"}
      </p>

      {/* 5. Footer: รวมข้อมูล ผู้โพสต์ + จำนวนคนสมัคร + วันที่ */}
      <div className="pt-4 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center mb-4 mt-auto">

        {/* ชื่อคนโพสต์ */}
        <div className="flex items-center gap-1.5 overflow-hidden mr-2">
          <User size={12} className="shrink-0" />
          <span className="truncate max-w-25">
            {job.postedByUser?.fullName || job.postedByUser?.username || "Admin"}
          </span>
        </div>

        {/* กลุ่มข้อมูลขวา: คนสมัคร + วันที่ */}
        <div className="flex items-center gap-3 shrink-0">
          {/* จำนวนผู้สมัคร */}
          <div className={`flex items-center gap-1 ${applicantCount > 0 ? 'text-blue-600 font-bold' : ''}`} title="จำนวนผู้สมัคร">
            <Users size={14} />
            <span>{applicantCount} คน</span>
          </div>

          {/* วันที่ */}
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{new Date(job.createdAt).toLocaleDateString("th-TH")}</span>
          </div>
        </div>
      </div>

      {/* 6. ปุ่มดำเนินการ (Buttons) */}
      <div className="mt-auto pt-2">
        {isAdminOrHR ? (
          <div className="flex flex-col gap-2 w-full">
            {/* --- แถวที่ 1: ปุ่มดูผู้สมัคร --- */}
            <Link
              href={`/recruitment/${job.id}/applicants`}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm font-bold shadow-sm"
            >
              <Users size={18} /> 
              <span>ดูผู้สมัคร ({applicantCount} คน)</span>
            </Link>

            {/* --- แถวที่ 2: ปุ่มจัดการ --- */}
            <div className="flex gap-2 h-10">
              <button
                onClick={() => onEdit?.(job)}
                className="flex-1 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition flex items-center justify-center gap-2 text-sm font-medium"
                title="แก้ไขข้อมูล"
              >
                <Edit2 size={16} /> <span>แก้ไข</span>
              </button>

              {job.isActive ? (
                <button
                  onClick={() => onKill?.(job.id)}
                  className="px-3 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition flex items-center justify-center"
                  title="ปิดรับสมัคร"
                >
                  <Power size={18} />
                </button>
              ) : (
                <button
                  onClick={() => onRestore?.(job.id)}
                  className="px-3 bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition flex items-center justify-center"
                  title="เปิดรับสมัครอีกครั้ง"
                >
                  <RotateCcw size={18} />
                </button>
              )}

              <button
                onClick={() => onDelete?.(job.id)}
                className="px-3 bg-red-50 text-red-500 border border-red-200 rounded-lg hover:bg-red-100 transition flex items-center justify-center"
                title="ลบถาวร"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 h-10 w-full">
            <button
              onClick={onApply}
              disabled={isApplying || !job.isActive}
              className={`flex-1 px-4 text-white rounded-lg transition font-bold flex items-center justify-center gap-2 shadow-sm ${
                job.isActive ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isApplying ? <Loader2 size={16} className="animate-spin" /> : (job.isActive ? "สมัครงาน" : "ปิดรับแล้ว")}
            </button>
            <button 
              onClick={handleBookmark}
              disabled={bookmarking}
              className={`px-3 rounded-lg transition flex items-center justify-center ${
                bookmarked 
                  ? "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100" 
                  : "border border-gray-300 hover:bg-gray-50 text-gray-500"
              }`}
              title={bookmarked ? "เลิกบันทึกงาน" : "บันทึกงาน"}
            >
              {bookmarking ? (
                <Loader2 size={16} className="animate-spin" />
              ) : bookmarked ? (
                <BookmarkCheck size={18} />
              ) : (
                <Bookmark size={18} />
              )}
            </button>
          </div>
        )}
      </div>

    </div>
  );
}