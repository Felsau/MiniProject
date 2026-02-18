import Link from "next/link";
import {
  Briefcase,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  ArrowUpRight,
  Activity,
  Search,
} from "lucide-react";

interface Application {
  id: string;
  status: string;
  createdAt: Date;
  job: {
    title: string;
    location: string | null;
  };
}

interface UserDashboardProps {
  user: {
    fullName: string | null;
    username: string;
  };
  applications: Application[];
  activeJobCount: number;
  totalApps: number;
  pendingApps: number;
  acceptedApps: number;
  rejectedApps: number;
}

export function UserDashboard({
  user,
  applications,
  activeJobCount,
  totalApps,
  pendingApps,
  acceptedApps,
  rejectedApps,
}: UserDashboardProps) {
  return (
    <div className="min-h-screen p-8 bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          สวัสดี, {user.fullName || user.username} 👋
        </h1>
        <p className="text-gray-600 text-lg">ภาพรวมการสมัครงานของคุณ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardStatCard
          title="ตำแหน่งงานเปิดรับ"
          value={activeJobCount}
          subtitle="ตำแหน่ง"
          icon={<Briefcase size={28} className="text-white" />}
          gradientFrom="from-blue-500"
          gradientTo="to-indigo-600"
          bgGradientFrom="from-blue-500/10"
          bgGradientTo="to-indigo-500/10"
          shadowColor="shadow-blue-500/30"
        />
        <DashboardStatCard
          title="สมัครไปแล้ว"
          value={totalApps}
          subtitle="งาน"
          icon={<FileText size={28} className="text-white" />}
          gradientFrom="from-green-500"
          gradientTo="to-emerald-600"
          bgGradientFrom="from-green-500/10"
          bgGradientTo="to-emerald-500/10"
          shadowColor="shadow-green-500/30"
        />
        <DashboardStatCard
          title="รอพิจารณา"
          value={pendingApps}
          subtitle={<span className="text-xs text-yellow-600 font-semibold">กำลังดำเนินการ</span>}
          icon={<Clock size={28} className="text-white" />}
          gradientFrom="from-yellow-500"
          gradientTo="to-orange-600"
          bgGradientFrom="from-yellow-500/10"
          bgGradientTo="to-orange-500/10"
          shadowColor="shadow-yellow-500/30"
        />
        <DashboardStatCard
          title="ผ่านคัดเลือก"
          value={acceptedApps}
          valueColor="text-green-600"
          subtitle={
            rejectedApps > 0 ? (
              <span className="text-xs text-red-500 font-semibold flex items-center gap-0.5">
                <XCircle size={12} /> ไม่ผ่าน {rejectedApps}
              </span>
            ) : undefined
          }
          icon={<CheckCircle size={28} className="text-white" />}
          gradientFrom="from-purple-500"
          gradientTo="to-pink-600"
          bgGradientFrom="from-purple-500/10"
          bgGradientTo="to-pink-500/10"
          shadowColor="shadow-purple-500/30"
        />
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
// Reusable Dashboard Stat Card
// ============================================
function DashboardStatCard({
  title,
  value,
  subtitle,
  icon,
  gradientFrom,
  gradientTo,
  bgGradientFrom,
  bgGradientTo,
  shadowColor,
  valueColor = "text-gray-900",
}: {
  title: string;
  value: number;
  subtitle?: React.ReactNode;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  bgGradientFrom: string;
  bgGradientTo: string;
  shadowColor: string;
  valueColor?: string;
}) {
  return (
    <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${bgGradientFrom} ${bgGradientTo} rounded-full -mr-16 -mt-16`}></div>
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">{title}</p>
          <p className={`text-4xl font-bold ${valueColor} mb-1`}>{value}</p>
          {typeof subtitle === "string" ? (
            <p className="text-xs text-gray-400">{subtitle}</p>
          ) : (
            subtitle
          )}
        </div>
        <div className={`w-16 h-16 bg-linear-to-br ${gradientFrom} ${gradientTo} rounded-2xl flex items-center justify-center shadow-lg ${shadowColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
