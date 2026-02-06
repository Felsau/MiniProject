import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Briefcase,
  ArrowUpRight,
  Activity,
  FileText,
  Search,
  MapPin,
  Calendar,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const userRole = (session.user as { role?: string })?.role;
  const username = session.user?.name as string;

  // ============================================
  // USER Dashboard
  // ============================================
  if (userRole === "USER") {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) redirect("/");

    const [applications, activeJobCount, totalApps, pendingApps, acceptedApps, rejectedApps] = await Promise.all([
      prisma.application.findMany({
        where: { userId: user.id },
        include: { job: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.job.count({ where: { isActive: true } }),
      prisma.application.count({ where: { userId: user.id } }),
      prisma.application.count({ where: { userId: user.id, status: "PENDING" } }),
      prisma.application.count({ where: { userId: user.id, status: "ACCEPTED" } }),
      prisma.application.count({ where: { userId: user.id, status: "REJECTED" } }),
    ]);

    return (
      <div className="min-h-screen p-8 bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            สวัสดี, {user.fullName || user.username} 👋
          </h1>
          <p className="text-gray-600 text-lg">ภาพรวมการสมัครงานของคุณ</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-500/10 to-indigo-500/10 rounded-full -mr-16 -mt-16"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">ตำแหน่งงานเปิดรับ</p>
                <p className="text-4xl font-bold text-gray-900 mb-1">{activeJobCount}</p>
                <p className="text-xs text-gray-400">ตำแหน่ง</p>
              </div>
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Briefcase size={28} className="text-white" />
              </div>
            </div>
          </div>

          <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-green-500/10 to-emerald-500/10 rounded-full -mr-16 -mt-16"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">สมัครไปแล้ว</p>
                <p className="text-4xl font-bold text-gray-900 mb-1">{totalApps}</p>
                <p className="text-xs text-gray-400">งาน</p>
              </div>
              <div className="w-16 h-16 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <FileText size={28} className="text-white" />
              </div>
            </div>
          </div>

          <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-yellow-500/10 to-orange-500/10 rounded-full -mr-16 -mt-16"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">รอพิจารณา</p>
                <p className="text-4xl font-bold text-gray-900 mb-1">{pendingApps}</p>
                <p className="text-xs text-yellow-600 font-semibold">กำลังดำเนินการ</p>
              </div>
              <div className="w-16 h-16 bg-linear-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <Clock size={28} className="text-white" />
              </div>
            </div>
          </div>

          <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-16 -mt-16"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">ผ่านคัดเลือก</p>
                <p className="text-4xl font-bold text-green-600 mb-1">{acceptedApps}</p>
                <div className="flex items-center gap-2">
                  {rejectedApps > 0 && (
                    <span className="text-xs text-red-500 font-semibold flex items-center gap-0.5">
                      <XCircle size={12} /> ไม่ผ่าน {rejectedApps}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <CheckCircle size={28} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Activity size={24} className="text-blue-600" />
                การสมัครล่าสุด
              </h2>
              <Link href="/applications" className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                ดูทั้งหมด <ArrowUpRight size={14} />
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={28} className="text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">ยังไม่มีประวัติการสมัคร</p>
                <p className="text-gray-400 text-sm mt-1">ไปค้นหางานที่คุณสนใจกันเลย!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Briefcase size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{app.job.title}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                          <span className="flex items-center gap-1"><MapPin size={12} /> {app.job.location || "-"}</span>
                          <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(app.createdAt).toLocaleDateString("th-TH")}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      app.status === "ACCEPTED" ? "bg-green-100 text-green-700" :
                      app.status === "REJECTED" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {app.status === "ACCEPTED" ? "ผ่านคัดเลือก" : app.status === "REJECTED" ? "ไม่ผ่าน" : "รอพิจารณา"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Activity className="text-white/80" size={20} />
              เมนูลัด
            </h3>
            <div className="space-y-3">
              <Link href="/jobs" className="block w-full bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-xl p-4 text-left transition-all group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">ค้นหางาน</p>
                    <p className="text-xs text-blue-100 mt-1">{activeJobCount} ตำแหน่งที่เปิดรับ</p>
                  </div>
                  <Search className="group-hover:translate-x-1 transition-transform" size={20} />
                </div>
              </Link>

              <Link href="/applications" className="block w-full bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-xl p-4 text-left transition-all group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">ติดตามสถานะ</p>
                    <p className="text-xs text-blue-100 mt-1">{pendingApps} รอพิจารณา</p>
                  </div>
                  <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
                </div>
              </Link>

              <Link href="/profile" className="block w-full bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-xl p-4 text-left transition-all group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">โปรไฟล์ของฉัน</p>
                    <p className="text-xs text-blue-100 mt-1">จัดการข้อมูลส่วนตัว</p>
                  </div>
                  <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // ADMIN / HR Dashboard
  // ============================================
  const [totalJobs, activeJobs, totalApplications, pendingApplications, acceptedApplications, recentApplications] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where: { isActive: true } }),
    prisma.application.count(),
    prisma.application.count({ where: { status: "PENDING" } }),
    prisma.application.count({ where: { status: "ACCEPTED" } }),
    prisma.application.findMany({
      include: {
        job: { select: { title: true } },
        user: { select: { fullName: true, username: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="min-h-screen p-8 bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 text-lg">ภาพรวมระบบบริหารจัดการงาน</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-500/10 to-indigo-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">ตำแหน่งงานทั้งหมด</p>
              <p className="text-4xl font-bold text-gray-900 mb-1">{totalJobs}</p>
              <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                <TrendingUp size={14} />
                <span>เปิดรับ {activeJobs} ตำแหน่ง</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Briefcase size={28} className="text-white" />
            </div>
          </div>
        </div>

        <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-green-500/10 to-emerald-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">ผู้สมัครทั้งหมด</p>
              <p className="text-4xl font-bold text-gray-900 mb-1">{totalApplications}</p>
              <p className="text-xs text-gray-400">ใบสมัคร</p>
            </div>
            <div className="w-16 h-16 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <Users size={28} className="text-white" />
            </div>
          </div>
        </div>

        <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-yellow-500/10 to-orange-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">รอตรวจสอบ</p>
              <p className="text-4xl font-bold text-gray-900 mb-1">{pendingApplications}</p>
              <div className="flex items-center gap-1 text-orange-600 text-xs font-semibold">
                <Clock size={14} />
                <span>ต้องดำเนินการ</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-linear-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <Clock size={28} className="text-white" />
            </div>
          </div>
        </div>

        <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">จ้างงานแล้ว</p>
              <p className="text-4xl font-bold text-gray-900 mb-1">{acceptedApplications}</p>
              <p className="text-xs text-gray-400">คน</p>
            </div>
            <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <CheckCircle size={28} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Progress Bars */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Activity size={24} className="text-blue-600" />
              สถิติภาพรวม
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">งานที่เปิดรับ</span>
                <span className="text-sm font-bold text-blue-600">{totalJobs > 0 ? Math.round((activeJobs / totalJobs) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-linear-to-r from-blue-500 to-indigo-600 h-3 rounded-full shadow-lg transition-all" style={{width: `${totalJobs > 0 ? Math.round((activeJobs / totalJobs) * 100) : 0}%`}}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">อัตราการตอบรับ</span>
                <span className="text-sm font-bold text-green-600">{totalApplications > 0 ? Math.round((acceptedApplications / totalApplications) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-linear-to-r from-green-500 to-emerald-600 h-3 rounded-full shadow-lg transition-all" style={{width: `${totalApplications > 0 ? Math.round((acceptedApplications / totalApplications) * 100) : 0}%`}}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">รอดำเนินการ</span>
                <span className="text-sm font-bold text-orange-600">{totalApplications > 0 ? Math.round((pendingApplications / totalApplications) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-linear-to-r from-yellow-500 to-orange-600 h-3 rounded-full shadow-lg transition-all" style={{width: `${totalApplications > 0 ? Math.round((pendingApplications / totalApplications) * 100) : 0}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Activity className="text-white/80" size={20} />
            การดำเนินการด่วน
          </h3>
          <div className="space-y-3">
            <Link href="/recruitment" className="block w-full bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-xl p-4 text-left transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">จัดการตำแหน่งงาน</p>
                  <p className="text-xs text-blue-100 mt-1">{totalJobs} ตำแหน่งทั้งหมด</p>
                </div>
                <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
              </div>
            </Link>

            <Link href="/applications" className="block w-full bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-xl p-4 text-left transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">ตรวจสอบใบสมัคร</p>
                  <p className="text-xs text-blue-100 mt-1">{pendingApplications} คำขอรอดำเนินการ</p>
                </div>
                <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
              </div>
            </Link>

            <Link href="/profile" className="block w-full bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-xl p-4 text-left transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">โปรไฟล์ของฉัน</p>
                  <p className="text-xs text-blue-100 mt-1">จัดการข้อมูลส่วนตัว</p>
                </div>
                <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Clock size={24} className="text-blue-600" />
            ใบสมัครล่าสุด
          </h2>
          <Link href="/applications" className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
            ดูทั้งหมด <ArrowUpRight size={14} />
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={28} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">ยังไม่มีใบสมัครเข้ามา</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentApplications.map((app) => (
              <div key={app.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 py-2 rounded-xl transition-colors">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                  app.status === "ACCEPTED" ? "bg-linear-to-br from-green-500 to-emerald-600" :
                  app.status === "REJECTED" ? "bg-linear-to-br from-red-500 to-rose-600" :
                  "bg-linear-to-br from-blue-500 to-indigo-600"
                }`}>
                  {app.status === "ACCEPTED" ? <CheckCircle size={20} className="text-white" /> :
                   app.status === "REJECTED" ? <XCircle size={20} className="text-white" /> :
                   <Users size={20} className="text-white" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {app.user.fullName || app.user.username} สมัคร {app.job.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(app.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  app.status === "ACCEPTED" ? "bg-green-100 text-green-700" :
                  app.status === "REJECTED" ? "bg-red-100 text-red-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>
                  {app.status === "ACCEPTED" ? "ผ่าน" : app.status === "REJECTED" ? "ไม่ผ่าน" : "รอพิจารณา"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
