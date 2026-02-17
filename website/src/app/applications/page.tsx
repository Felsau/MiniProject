"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { FileText, Clock, CheckCircle, XCircle, Loader2, Users } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/applications/StatCard";
import { ApplicationCard } from "@/components/applications/ApplicationCard";

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

  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.status === "PENDING").length,
    interview: applications.filter((app) => app.status === "INTERVIEW").length,
    hired: applications.filter((app) => app.status === "HIRED" || app.status === "ACCEPTED").length,
    rejected: applications.filter((app) => app.status === "REJECTED").length,
  };

  const filteredApps = filterStatus === "ALL"
    ? applications
    : applications.filter((app) => {
      if (filterStatus === "HIRED") return app.status === "HIRED" || app.status === "ACCEPTED";
      return app.status === filterStatus;
    });

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isAdminOrHR ? "จัดการใบสมัคร" : "งานที่สมัครไปแล้ว"}
          </h1>
          <p className="text-gray-600">
            {isAdminOrHR ? "ตรวจสอบและจัดการใบสมัครทั้งหมดในระบบ" : "ติดตามสถานะการสมัครงานของคุณ"}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatCard title="ทั้งหมด" count={stats.total} icon={<FileText className="text-blue-500" size={20} />} active={filterStatus === "ALL"} onClick={() => setFilterStatus("ALL")} />
          <StatCard title="รอพิจารณา" count={stats.pending} icon={<Clock className="text-yellow-500" size={20} />} active={filterStatus === "PENDING"} onClick={() => setFilterStatus("PENDING")} />
          <StatCard title="สัมภาษณ์" count={stats.interview} icon={<Users className="text-purple-500" size={20} />} active={filterStatus === "INTERVIEW"} onClick={() => setFilterStatus("INTERVIEW")} />
          <StatCard title="รับเข้าทำงาน" count={stats.hired} icon={<CheckCircle className="text-green-500" size={20} />} active={filterStatus === "HIRED"} onClick={() => setFilterStatus("HIRED")} />
          <StatCard title="ไม่ผ่าน" count={stats.rejected} icon={<XCircle className="text-red-500" size={20} />} active={filterStatus === "REJECTED"} onClick={() => setFilterStatus("REJECTED")} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible">
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
              {filteredApps.map((app) => (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  isAdminOrHR={isAdminOrHR}
                  updatingId={updatingId}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}