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
} from "lucide-react";

interface RecentApplication {
  id: string;
  status: string;
  createdAt: Date;
  job: { title: string };
  user: { fullName: string | null; username: string };
}

interface AdminDashboardProps {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  recentApplications: RecentApplication[];
}

export function AdminDashboard({
  totalJobs,
  activeJobs,
  totalApplications,
  pendingApplications,
  acceptedApplications,
  recentApplications,
}: AdminDashboardProps) {
  return (
    <div className="min-h-screen p-8 bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 text-lg">ภาพรวมระบบบริหารจัดการงาน</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="ตำแหน่งงานทั้งหมด"
          value={totalJobs}
          subtitle={
            <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
              <TrendingUp size={14} />
              <span>เปิดรับ {activeJobs} ตำแหน่ง</span>
            </div>
          }
          icon={<Briefcase size={28} className="text-white" />}
          gradientFrom="from-blue-500" gradientTo="to-indigo-600"
          bgFrom="from-blue-500/10" bgTo="to-indigo-500/10"
          shadow="shadow-blue-500/30"
        />
        <StatCard
          title="ผู้สมัครทั้งหมด"
          value={totalApplications}
          subtitle={<p className="text-xs text-gray-400">ใบสมัคร</p>}
          icon={<Users size={28} className="text-white" />}
          gradientFrom="from-green-500" gradientTo="to-emerald-600"
          bgFrom="from-green-500/10" bgTo="to-emerald-500/10"
          shadow="shadow-green-500/30"
        />
        <StatCard
          title="รอตรวจสอบ"
          value={pendingApplications}
          subtitle={
            <div className="flex items-center gap-1 text-orange-600 text-xs font-semibold">
              <Clock size={14} />
              <span>ต้องดำเนินการ</span>
            </div>
          }
          icon={<Clock size={28} className="text-white" />}
          gradientFrom="from-yellow-500" gradientTo="to-orange-600"
          bgFrom="from-yellow-500/10" bgTo="to-orange-500/10"
          shadow="shadow-yellow-500/30"
        />
        <StatCard
          title="จ้างงานแล้ว"
          value={acceptedApplications}
          subtitle={<p className="text-xs text-gray-400">คน</p>}
          icon={<CheckCircle size={28} className="text-white" />}
          gradientFrom="from-purple-500" gradientTo="to-pink-600"
          bgFrom="from-purple-500/10" bgTo="to-pink-500/10"
          shadow="shadow-purple-500/30"
        />
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
            <ProgressBar
              label="งานที่เปิดรับ"
              percent={totalJobs > 0 ? Math.round((activeJobs / totalJobs) * 100) : 0}
              color="from-blue-500 to-indigo-600"
              textColor="text-blue-600"
            />
            <ProgressBar
              label="อัตราการตอบรับ"
              percent={totalApplications > 0 ? Math.round((acceptedApplications / totalApplications) * 100) : 0}
              color="from-green-500 to-emerald-600"
              textColor="text-green-600"
            />
            <ProgressBar
              label="รอดำเนินการ"
              percent={totalApplications > 0 ? Math.round((pendingApplications / totalApplications) * 100) : 0}
              color="from-yellow-500 to-orange-600"
              textColor="text-orange-600"
            />
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

// ============================================
// Sub-components
// ============================================

function StatCard({ title, value, subtitle, icon, gradientFrom, gradientTo, bgFrom, bgTo, shadow }: {
  title: string; value: number; subtitle: React.ReactNode; icon: React.ReactNode;
  gradientFrom: string; gradientTo: string; bgFrom: string; bgTo: string; shadow: string;
}) {
  return (
    <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${bgFrom} ${bgTo} rounded-full -mr-16 -mt-16`}></div>
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">{title}</p>
          <p className="text-4xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle}
        </div>
        <div className={`w-16 h-16 bg-linear-to-br ${gradientFrom} ${gradientTo} rounded-2xl flex items-center justify-center shadow-lg ${shadow}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ label, percent, color, textColor }: {
  label: string; percent: number; color: string; textColor: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className={`text-sm font-bold ${textColor}`}>{percent}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div className={`bg-linear-to-r ${color} h-3 rounded-full shadow-lg transition-all`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}
