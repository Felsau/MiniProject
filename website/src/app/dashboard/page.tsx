import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { TrendingUp, Users, Clock, CheckCircle, Briefcase, ArrowUpRight, Activity } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const userRole = (session.user as any)?.role;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 text-lg">ภาพรวมระบบบริหารจัดการงาน</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">ตำแหน่งงานทั้งหมด</p>
              <p className="text-4xl font-bold text-gray-900 mb-1 stat-number">24</p>
              <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                <TrendingUp size={14} />
                <span>+12% จากเดือนที่แล้ว</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Briefcase size={28} className="text-white" />
            </div>
          </div>
        </div>

        <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">ผู้สมัครใหม่</p>
              <p className="text-4xl font-bold text-gray-900 mb-1 stat-number">156</p>
              <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                <TrendingUp size={14} />
                <span>+8% จากเดือนที่แล้ว</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <Users size={28} className="text-white" />
            </div>
          </div>
        </div>

        <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">รอตรวจสอบ</p>
              <p className="text-4xl font-bold text-gray-900 mb-1 stat-number">38</p>
              <div className="flex items-center gap-1 text-orange-600 text-xs font-semibold">
                <Clock size={14} />
                <span>ต้องดำเนินการ</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <Clock size={28} className="text-white" />
            </div>
          </div>
        </div>

        <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">จ้างงานแล้ว</p>
              <p className="text-4xl font-bold text-gray-900 mb-1 stat-number">12</p>
              <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                <TrendingUp size={14} />
                <span>+3 คนสัปดาห์นี้</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <CheckCircle size={28} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Stats */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Activity size={24} className="text-blue-600" />
              สถิติรายเดือน
            </h2>
            <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>มกราคม 2026</option>
              <option>ธันวาคม 2025</option>
              <option>พฤศจิกายน 2025</option>
            </select>
          </div>
          
          {/* Simple Bar Chart Visualization */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">งานที่เปิดรับ</span>
                <span className="text-sm font-bold text-blue-600">85%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full shadow-lg" style={{width: "85%"}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">อัตราการตอบรับ</span>
                <span className="text-sm font-bold text-green-600">72%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full shadow-lg" style={{width: "72%"}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">อัตราการจ้างงาน</span>
                <span className="text-sm font-bold text-purple-600">50%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full shadow-lg" style={{width: "50%"}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">ประสิทธิภาพโดยรวม</span>
                <span className="text-sm font-bold text-indigo-600">78%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-600 h-3 rounded-full shadow-lg" style={{width: "78%"}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Activity className="text-white/80" size={20} />
            การดำเนินการด่วน
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-xl p-4 text-left transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">เพิ่มตำแหน่งงานใหม่</p>
                  <p className="text-xs text-blue-100 mt-1">สร้างประกาศงานว่าง</p>
                </div>
                <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
              </div>
            </button>
            
            <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-xl p-4 text-left transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">ตรวจสอบใบสมัคร</p>
                  <p className="text-xs text-blue-100 mt-1">38 คำขอรอดำเนินการ</p>
                </div>
                <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
              </div>
            </button>
            
            <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-xl p-4 text-left transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">รายงานประจำเดือน</p>
                  <p className="text-xs text-blue-100 mt-1">ดูสถิติโดยละเอียด</p>
                </div>
                <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Clock size={24} className="text-blue-600" />
          กิจกรรมล่าสุด
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4 pb-4 border-b border-gray-100 hover:bg-gray-50 -mx-2 px-2 py-2 rounded-xl transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
              <Briefcase size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">ตำแหน่งใหม่ถูกสร้าง</p>
              <p className="text-xs text-gray-500 mt-1">Senior Developer - 2 ชั่วโมงที่แล้ว</p>
            </div>
            <span className="text-xs text-gray-400">14:30</span>
          </div>

          <div className="flex items-start gap-4 pb-4 border-b border-gray-100 hover:bg-gray-50 -mx-2 px-2 py-2 rounded-xl transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
              <Users size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">ผู้สมัครใหม่</p>
              <p className="text-xs text-gray-500 mt-1">John Doe สมัคร UX Designer - 3 ชั่วโมงที่แล้ว</p>
            </div>
            <span className="text-xs text-gray-400">13:15</span>
          </div>

          <div className="flex items-start gap-4 hover:bg-gray-50 -mx-2 px-2 py-2 rounded-xl transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
              <CheckCircle size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">ผู้สมัครได้รับการจ้างงาน</p>
              <p className="text-xs text-gray-500 mt-1">Jane Smith - Frontend Developer - 5 ชั่วโมงที่แล้ว</p>
            </div>
            <span className="text-xs text-gray-400">11:45</span>
          </div>
        </div>
      </div>
    </div>
  );
}
