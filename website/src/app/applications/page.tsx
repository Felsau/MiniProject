"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { FileText, Calendar, Clock, CheckCircle, XCircle, MapPin, Briefcase, Loader2, User, ChevronDown } from "lucide-react";
import Link from "next/link";

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
  job: ApplicationJob;
  user?: ApplicationUser;
}

export default function ApplicationsPage() {
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string })?.role;
  const isAdminOrHR = userRole === "ADMIN" || userRole === "HR";

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch("/api/application");
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // อัปเดตสถานะใบสมัคร (ADMIN/HR only)
  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    setUpdatingId(applicationId);
    try {
      const res = await fetch("/api/application", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status: newStatus }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      } else {
        const data = await res.json();
        alert(data.error || "อัปเดตไม่สำเร็จ");
      }
    } catch {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setUpdatingId(null);
    }
  };

  // คำนวณตัวเลข Stats
  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.status?.toUpperCase() === "PENDING").length,
    accepted: applications.filter((app) => app.status?.toUpperCase() === "ACCEPTED").length,
    rejected: applications.filter((app) => app.status?.toUpperCase() === "REJECTED").length,
  };

  // กรองตาม Status
  const filteredApps = filterStatus === "ALL"
    ? applications
    : applications.filter((app) => app.status === filterStatus);

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return { text: "ผ่านคัดเลือก", color: "text-green-600 bg-green-50", icon: <CheckCircle size={16} /> };
      case "REJECTED":
        return { text: "ไม่ผ่าน", color: "text-red-600 bg-red-50", icon: <XCircle size={16} /> };
      default:
        return { text: "รอพิจารณา", color: "text-yellow-600 bg-yellow-50", icon: <Clock size={16} /> };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isAdminOrHR ? "จัดการใบสมัคร" : "งานที่สมัครไปแล้ว"}
          </h1>
          <p className="text-gray-600">
            {isAdminOrHR ? "ตรวจสอบและจัดการใบสมัครทั้งหมดในระบบ" : "ติดตามสถานะการสมัครงานของคุณ"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="ทั้งหมด" count={stats.total} icon={<FileText className="text-blue-500" size={20} />} active={filterStatus === "ALL"} onClick={() => setFilterStatus("ALL")} />
          <StatCard title="รอพิจารณา" count={stats.pending} icon={<Clock className="text-yellow-500" size={20} />} active={filterStatus === "PENDING"} onClick={() => setFilterStatus("PENDING")} />
          <StatCard title="ผ่านคัดเลือก" count={stats.accepted} icon={<CheckCircle className="text-green-500" size={20} />} active={filterStatus === "ACCEPTED"} onClick={() => setFilterStatus("ACCEPTED")} />
          <StatCard title="ไม่ผ่าน" count={stats.rejected} icon={<XCircle className="text-red-500" size={20} />} active={filterStatus === "REJECTED"} onClick={() => setFilterStatus("REJECTED")} />
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredApps.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                {filterStatus !== "ALL" ? "ไม่พบใบสมัครในสถานะนี้" : (isAdminOrHR ? "ยังไม่มีใบสมัครเข้ามา" : "คุณยังไม่ได้สมัครงานใดๆ")}
              </p>
              {!isAdminOrHR && filterStatus === "ALL" && (
                <>
                  <p className="text-gray-400 text-sm mt-1">เริ่มต้นค้นหาและสมัครงานที่คุณสนใจได้เลย</p>
                  <Link href="/jobs" className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    ไปค้นหางาน
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredApps.map((app) => {
                const status = getStatusDetails(app.status);
                return (
                  <div key={app.id} className="p-6 hover:bg-gray-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                        {/* แสดงข้อมูลผู้สมัคร (สำหรับ Admin/HR) */}
                        {isAdminOrHR && app.user && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                            <User size={14} className="text-gray-400" />
                            <span className="font-medium">{app.user.fullName || app.user.username}</span>
                            {app.user.email && <span className="text-gray-400">• {app.user.email}</span>}
                            {app.user.phone && <span className="text-gray-400">• {app.user.phone}</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-4 md:pt-0">
                      {/* สถานะปัจจุบัน */}
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${status.color}`}>
                        {status.icon}
                        {status.text}
                      </div>

                      {/* ปุ่มจัดการสถานะ (ADMIN/HR only) */}
                      {isAdminOrHR && app.status === "PENDING" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateStatus(app.id, "ACCEPTED")}
                            disabled={updatingId === app.id}
                            className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-1"
                          >
                            {updatingId === app.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                            ตอบรับ
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                            disabled={updatingId === app.id}
                            className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-1"
                          >
                            {updatingId === app.id ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                            ปฏิเสธ
                          </button>
                        </div>
                      )}

                      {/* ปุ่มเปลี่ยนสถานะกลับ (ADMIN/HR, กรณีอัปเดตผิด) */}
                      {isAdminOrHR && app.status !== "PENDING" && (
                        <div className="relative group">
                          <button className="px-2 py-1 text-gray-400 hover:text-gray-600 transition text-xs flex items-center gap-1">
                            <ChevronDown size={14} />
                            เปลี่ยน
                          </button>
                          <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 hidden group-hover:block z-20 min-w-32">
                            <button
                              onClick={() => handleUpdateStatus(app.id, "PENDING")}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-yellow-50 text-yellow-700 flex items-center gap-2"
                            >
                              <Clock size={14} /> รอพิจารณา
                            </button>
                            {app.status !== "ACCEPTED" && (
                              <button
                                onClick={() => handleUpdateStatus(app.id, "ACCEPTED")}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 text-green-700 flex items-center gap-2"
                              >
                                <CheckCircle size={14} /> ตอบรับ
                              </button>
                            )}
                            {app.status !== "REJECTED" && (
                              <button
                                onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-700 flex items-center gap-2"
                              >
                                <XCircle size={14} /> ปฏิเสธ
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, count, icon, active, onClick }: { title: string; count: number; icon: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-xl p-6 shadow-sm border-2 text-left transition-all hover:shadow-md w-full ${
        active ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 text-sm">{title}</span>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900">{count}</p>
    </button>
  );
}
