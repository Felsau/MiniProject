import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import JobList from "@/components/recruitment/JobList";
import AddJobModal from "@/components/recruitment/AddJobModal";
import { Briefcase, Users, Filter, TrendingUp } from "lucide-react";

export default async function RecruitmentPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const userRole = (session.user as { role?: string })?.role;

  // ดึงข้อมูลงานทั้งหมด
  const jobs = await prisma.job.findMany({
    include: {
      postedByUser: {
        select: {
          fullName: true,
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              ระบบจัดหางาน
            </h1>
            <p className="text-gray-600 text-lg">จัดการตำแหน่งงานและรับสมัครพนักงานใหม่</p>
          </div>
          {(userRole === "HR" || userRole === "ADMIN") && (
            <AddJobModal />
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase size={24} className="text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                <TrendingUp size={12} />
                <span>100%</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wide">งานทั้งหมด</p>
            <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
          </div>
        </div>

        <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users size={24} className="text-white" />
              </div>
              <div className="text-xs font-semibold text-blue-600">
                {jobs.length > 0 ? Math.round((jobs.filter((j: { employmentType: string }) => j.employmentType === "FULL_TIME").length / jobs.length) * 100) : 0}%
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wide">Full-time</p>
            <p className="text-3xl font-bold text-blue-600">
              {jobs.filter((j: { employmentType: string }) => j.employmentType === "FULL_TIME").length}
            </p>
          </div>
        </div>

        <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users size={24} className="text-white" />
              </div>
              <div className="text-xs font-semibold text-green-600">
                {jobs.length > 0 ? Math.round((jobs.filter((j: { employmentType: string }) => j.employmentType === "PART_TIME").length / jobs.length) * 100) : 0}%
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wide">Part-time</p>
            <p className="text-3xl font-bold text-green-600">
              {jobs.filter((j: { employmentType: string }) => j.employmentType === "PART_TIME").length}
            </p>
          </div>
        </div>

        <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users size={24} className="text-white" />
              </div>
              <div className="text-xs font-semibold text-purple-600">
                {jobs.length > 0 ? Math.round((jobs.filter((j: { employmentType: string }) => j.employmentType === "CONTRACT").length / jobs.length) * 100) : 0}%
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wide">Contract</p>
            <p className="text-3xl font-bold text-purple-600">
              {jobs.filter((j: { employmentType: string }) => j.employmentType === "CONTRACT").length}
            </p>
          </div>
        </div>
      </div>

      {/* Job List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Briefcase size={24} className="text-blue-600" />
              รายการตำแหน่งงานทั้งหมด
            </h2>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
              <Filter size={16} />
              ตัวกรอง
            </button>
          </div>
        </div>
        <div className="p-6">
          <JobList jobs={jobs} userRole={userRole} />
        </div>
      </div>
    </div>
  );
}
