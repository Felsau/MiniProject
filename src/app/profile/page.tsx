import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/authOptions"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import Link from "next/link"
import { ArrowLeft, User, Briefcase, Calendar, Shield, Mail, Phone, FileText, MapPin, Award, Pencil } from "lucide-react"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { username: session.user?.name as string },
    include: {
      jobs: { orderBy: { createdAt: 'desc' } },
      applications: { include: { job: true }, orderBy: { createdAt: 'desc' } },
    }
  })

  if (!user) return <div>ไม่พบข้อมูล</div>

  const isRecruiter = user.role === 'ADMIN' || user.role === 'HR';
  const activeJobsCount = user.jobs.filter(job => job.isActive).length;

  const totalApplicants = isRecruiter
    ? await prisma.application.count({
        where: { job: { postedBy: user.id } },
      })
    : 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 md:p-12">
      
      <div className="max-w-6xl mx-auto mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition font-medium">
          <ArrowLeft size={20} /> กลับแดชบอร์ด
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden card-hover">
            <div className="h-32 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 relative">
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
            
            <div className="px-6 pb-6 -mt-16 relative z-10">
              <div className="w-28 h-28 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 border-4 border-white shadow-xl mx-auto">
                <User size={48} className="text-white" />
              </div>
              
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {user.fullName || user.username}
                </h2>
                <p className="text-blue-600 font-semibold text-sm mb-2">
                  {user.position || (isRecruiter ? "Recruitment Team" : "Job Seeker")}
                </p>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 
                  user.role === 'HR' ? 'bg-blue-100 text-blue-700' : 
                  'bg-gray-100 text-gray-700'
                }`}>
                  <Shield size={12} />
                  {user.role}
                </span>
              </div>

              <div className="space-y-3 bg-linear-to-br from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3 text-gray-700 text-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Mail size={16} className="text-blue-600" />
                  </div>
                  <span className="truncate">{user.email || "-"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 text-sm">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-green-600" />
                  </div>
                  <span>{user.phone || "-"}</span>
                </div>
              </div>

              <div className="mt-4">
                <Link href="/profile/edit" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold text-sm">
                  <Pencil size={16} />
                  แก้ไขโปรไฟล์
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: About Me */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 card-hover">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FileText size={18} className="text-blue-600" />
              เกี่ยวกับฉัน
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {user.bio || "ยังไม่ได้เขียนแนะนำตัว..."}
            </p>
          </div>

        </div>

        <div className="lg:col-span-2 space-y-6">
          
          {isRecruiter ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card-hover bg-white p-6 rounded-2xl border border-gray-100 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-blue-500/10 to-indigo-500/10 rounded-full -mr-12 -mt-12"></div>
                  <div className="relative z-10">
                    <p className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wide">ประกาศงานทั้งหมด</p>
                    <p className="text-4xl font-bold text-blue-600 mb-1">{user.jobs.length}</p>
                    <p className="text-xs text-gray-400">ตำแหน่ง</p>
                  </div>
                </div>
                
                <div className="card-hover bg-white p-6 rounded-2xl border border-gray-100 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-green-500/10 to-emerald-500/10 rounded-full -mr-12 -mt-12"></div>
                  <div className="relative z-10">
                    <p className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wide">งานที่เปิดรับ</p>
                    <p className="text-4xl font-bold text-green-600 mb-1">{activeJobsCount}</p>
                    <p className="text-xs text-gray-400">Active</p>
                  </div>
                </div>
                
                <div className="card-hover bg-white p-6 rounded-2xl border border-gray-100 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-12 -mt-12"></div>
                  <div className="relative z-10">
                    <p className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wide">ผู้สมัครทั้งหมด</p>
                    <p className="text-4xl font-bold text-purple-600 mb-1">{totalApplicants}</p>
                    <p className="text-xs text-gray-400">คน</p>
                  </div>
                </div>
              </div>

              {/* Job List */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-linear-to-r from-gray-50 to-blue-50">
                  <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                    <Briefcase size={24} className="text-blue-600" />
                    ประวัติการลงประกาศงาน
                  </h3>
                </div>
                
                <div className="p-6">
                  {user.jobs.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Briefcase size={32} className="text-gray-400" />
                      </div>
                      <p className="text-gray-400 font-medium">ยังไม่มีประวัติการลงประกาศงาน</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user.jobs.map((job) => (
                        <div key={job.id} className="group card-hover flex justify-between items-start p-5 rounded-xl border border-gray-200 bg-linear-to-br from-white to-gray-50 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition mb-2">
                              {job.title}
                            </h4>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Award size={14} className="text-gray-400" />
                                {job.department}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin size={14} className="text-gray-400" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar size={14} className="text-gray-400" />
                                {new Date(job.createdAt).toLocaleDateString('th-TH')}
                              </span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <span className={`inline-block px-3 py-1 text-white text-xs rounded-lg font-semibold shadow-md ${
                              job.isActive
                                ? "bg-linear-to-r from-green-500 to-emerald-500"
                                : "bg-linear-to-r from-gray-400 to-gray-500"
                            }`}>
                              {job.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-linear-to-r from-gray-50 to-blue-50">
                  <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                    <FileText size={24} className="text-blue-600" />
                    ประวัติการสมัครงาน ({user.applications.length})
                  </h3>
                </div>
                
                {user.applications.length === 0 ? (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
                    <FileText size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">ยังไม่มีประวัติการสมัครงาน</h3>
                  <p className="text-gray-500 mb-6 max-w-md">
                    เริ่มต้นค้นหาตำแหน่งงานที่เหมาะสมกับคุณและส่งใบสมัครของคุณวันนี้
                  </p>
                  <Link href="/jobs" className="px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold flex items-center gap-2">
                    <Briefcase size={18} />
                    ค้นหางานที่น่าสนใจ
                  </Link>
                </div>
                ) : (
                <div className="p-6 space-y-4">
                  {user.applications.map((app) => (
                    <div key={app.id} className="flex justify-between items-center p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all">
                      <div>
                        <h4 className="font-bold text-gray-800">{app.job.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {app.job.location || "-"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(app.createdAt).toLocaleDateString('th-TH')}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        app.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                        app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {app.status === 'ACCEPTED' ? 'ได้รับการติดต่อ' :
                         app.status === 'REJECTED' ? 'ไม่ผ่าน' : 'รอพิจารณา'}
                      </span>
                    </div>
                  ))}
                </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}