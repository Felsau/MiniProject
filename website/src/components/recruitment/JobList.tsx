"use client";

import { useState } from "react";
import { MapPin, Briefcase, Trash2, Edit2, DollarSign, Calendar, User } from "lucide-react"; // เพิ่ม Icon Calendar, User
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  description: string | null;
  department: string | null;
  location: string | null;
  salary: string | null;
  employmentType: string;
  requirements: string | null;
  responsibilities: string | null;
  benefits: string | null;
  createdAt: Date;
  postedByUser: {
    fullName: string | null;
    username: string;
  } | null;
}

interface JobListProps {
  jobs: Job[];
  userRole?: string;
}

export default function JobList({ jobs, userRole }: JobListProps) {
  const router = useRouter();

  const handleDelete = async (jobId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบงานนี้?")) return;

    try {
      const res = await fetch(`/api/job/${jobId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("ไม่สามารถลบงานได้");
      }
    } catch (_error) {
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleEdit = (jobId: string) => {
    router.push(`/recruitment/${jobId}/edit`);
  };

  const getEmploymentTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      FULL_TIME: "เต็มเวลา",
      PART_TIME: "พาร์ทไทม์",
      CONTRACT: "สัญญาจ้าง",
      INTERNSHIP: "ฝึกงาน",
    };
    return labels[type] || type;
  };

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-10 text-center border border-gray-200 border-dashed">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="text-gray-400" size={32} />
        </div>
        <p className="text-gray-500 text-lg font-medium">ยังไม่มีตำแหน่งงานในขณะนี้</p>
        <p className="text-gray-400 text-sm mt-1">ลองเพิ่มประกาศงานใหม่ดูสิ</p>
      </div>
    );
  }

  return (
    // ✅ เปลี่ยนเป็น Grid 3 คอลัมน์ตรงนี้
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <div
          key={job.id}
          // ✅ จัด style ให้การ์ดสูงเท่ากัน (h-full) และมี relative เพื่อวางปุ่มลอย
          className="group bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full relative"
        >
            {/* 1. ส่วนหัว: ชื่อตำแหน่ง + ปุ่ม Action */}
            <div className="flex justify-between items-start mb-3 pr-8"> 
                {/* pr-8 เว้นที่ให้ปุ่ม Action ด้านขวา */}
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={job.title}>
                  {job.title}
                </h3>

                {/* ปุ่มแก้ไข/ลบ (แสดงเมื่อเมาส์ชี้ หรือบนมือถือ) */}
                {(userRole === "HR" || userRole === "ADMIN") && (
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg shadow-sm border border-gray-100 z-10">
                        <button
                          onClick={() => handleEdit(job.id)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition"
                          title="แก้ไข"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition"
                          title="ลบ"
                        >
                          <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* 2. Tags ข้อมูล (แผนก, สถานที่, เงินเดือน) */}
            <div className="space-y-2 mb-4 text-sm text-gray-500">
                {job.department && (
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-gray-400" />
                    <span>{job.department}</span>
                  </div>
                )}
                {job.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{job.location}</span>
                  </div>
                )}
                {job.salary && (
                  <div className="flex items-center gap-2 font-medium text-emerald-600">
                    <DollarSign size={14} />
                    <span>{job.salary}</span>
                  </div>
                )}
            </div>

            {/* 3. Badge ประเภทงาน */}
            <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100">
                  {getEmploymentTypeLabel(job.employmentType)}
                </span>
            </div>

            {/* 4. คำอธิบายงาน (ใช้ flex-grow ดันส่วน footer ลงล่างสุด) */}
            <div className="mb-6 flex-grow">
               {job.description ? (
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>
               ) : (
                  <p className="text-gray-400 text-sm italic">ไม่มีรายละเอียด</p>
               )}
            </div>

            {/* 5. Footer: คนโพสต์ & วันที่ */}
            <div className="pt-4 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center mt-auto">
                <div className="flex items-center gap-1.5" title={job.postedByUser?.fullName || job.postedByUser?.username}>
                   <User size={12} />
                   <span className="max-w-[80px] truncate">{job.postedByUser?.fullName || job.postedByUser?.username || "Admin"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <Calendar size={12} />
                   <span>{new Date(job.createdAt).toLocaleDateString("th-TH")}</span>
                </div>
            </div>

        </div>
      ))}
    </div>
  );
}