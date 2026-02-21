import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import AddJobModal from "@/components/recruitment/AddJobModal";
import Pagination from "@/components/ui/Pagination";
import { Briefcase, Users, Filter, TrendingUp } from "lucide-react";
import { JobWithCount } from "@/types";
import RecruitmentClientWrapper from "@/components/recruitment/RecruitmentClientWrapper";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function RecruitmentPage(props: Props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const userRole = (session.user as { role?: string })?.role;

  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = 6;
  const skip = (currentPage - 1) * itemsPerPage;

  const [jobs, totalJobCount, fullTimeCount, partTimeCount, contractCount] = await Promise.all([
    prisma.job.findMany({
      take: itemsPerPage,
      skip: skip,
      include: {
        postedByUser: {
          select: {
            fullName: true,
            username: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: [
        { createdAt: "desc" },
        { id: "desc" }
      ],
    }),
    prisma.job.count(),
    prisma.job.count({ where: { employmentType: "FULL_TIME" } }),
    prisma.job.count({ where: { employmentType: "PART_TIME" } }),
    prisma.job.count({ where: { employmentType: "CONTRACT" } }),
  ]);

  const totalPages = Math.ceil(totalJobCount / itemsPerPage);

  return (
    <div className="min-h-screen p-8 bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              ระบบจัดหางาน
            </h1>
            <p className="text-gray-600 text-lg">จัดการตำแหน่งงานและรับสมัครพนักงานใหม่</p>
          </div>
          
          <AddJobModal />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-500/10 to-indigo-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase size={24} className="text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                <TrendingUp size={12} />
                <span>100%</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wide">งานทั้งหมด</p>
            <p className="text-3xl font-bold text-gray-900">{totalJobCount}</p>
          </div>
        </div>

        <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-500/10 to-cyan-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users size={24} className="text-white" />
              </div>
              <div className="text-xs font-semibold text-blue-600">
                {totalJobCount > 0 ? Math.round((fullTimeCount / totalJobCount) * 100) : 0}%
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wide">Full-time</p>
            <p className="text-3xl font-bold text-blue-600">
              {fullTimeCount}
            </p>
          </div>
        </div>

        <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-green-500/10 to-emerald-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users size={24} className="text-white" />
              </div>
              <div className="text-xs font-semibold text-green-600">
                {totalJobCount > 0 ? Math.round((partTimeCount / totalJobCount) * 100) : 0}%
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wide">Part-time</p>
            <p className="text-3xl font-bold text-green-600">
              {partTimeCount}
            </p>
          </div>
        </div>

        <div className="card-hover bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users size={24} className="text-white" />
              </div>
              <div className="text-xs font-semibold text-purple-600">
                {totalJobCount > 0 ? Math.round((contractCount / totalJobCount) * 100) : 0}%
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wide">Contract</p>
            <p className="text-3xl font-bold text-purple-600">
              {contractCount}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-linear-to-r from-gray-50 to-blue-50">
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
          <RecruitmentClientWrapper 
            jobs={JSON.parse(JSON.stringify(jobs)) as JobWithCount[]} 
            userRole={userRole} 
          />
          
          <div className="mt-8 pt-6 border-t border-gray-100">
             <Pagination totalPages={totalPages} />
          </div>
        </div>
      </div>
    </div>
  );
}
