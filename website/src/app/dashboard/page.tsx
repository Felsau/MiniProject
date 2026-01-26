import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import LogoutButton from "@/components/LogoutButton" // ถ้าคุณแยกปุ่ม Logout ไว้
import Link from "next/link"

export default async function DashboardPage() {

  const session = await getServerSession(authOptions)

  // 1. ความปลอดภัยขั้นแรก: ถ้ายังไม่ Login ให้ดีดกลับหน้า Login
  if (!session) {
    redirect("/login")
  }
  console.log("Full Session Data:", JSON.stringify(session, null, 2))
  // 2. ดึง Role ออกมา (ใช้ @ts-ignore เพื่อเลี่ยงตัวแดงของ TypeScript ในบางเคส)
  // @ts-ignore
  const role = session.user?.role

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* ส่วนหัวหน้าจอ */}
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">ระบบประกาศงานภายใน</h1>
            <p className="text-gray-500 mt-1">ยินดีต้อนรับคุณ {session.user?.name} | สิทธิ์การใช้งาน: <span className="font-bold text-blue-600">{role}</span></p>
          </div>
          <LogoutButton />
        </div>

        {/* 3. ส่วนแยกเนื้อหาตาม Role */}
        <div className="grid grid-cols-1 gap-6">

          {/* --- ส่วนสำหรับ ADMIN (จัดการระบบ) --- */}
          {role === "ADMIN" && (
            <div className="bg-purple-50 border-2 border-purple-200 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-purple-800 mb-4">เมนูผู้ดูแลระบบ (Admin Control)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/register"
                  className="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700 transition"
                >
                  สร้างบัญชีพนักงานใหม่
                </Link>
                <button className="bg-white border-2 border-purple-600 text-purple-600 p-4 rounded-lg hover:bg-purple-50 transition">
                  จัดการสิทธิ์ผู้ใช้งาน
                </button>
              </div>
            </div>
          )}

          {/* --- ส่วนสำหรับ HR (จัดการประกาศงาน) --- */}
          {(role === "HR" || role === "ADMIN") && (
            <div className="bg-green-50 border-2 border-green-200 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-green-800 mb-4">เมนูฝ่ายบุคคล (Recruitment Management)</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition">
                  ลงประกาศงานใหม่
                </button>
                <button className="bg-white border-2 border-green-600 text-green-600 p-4 rounded-lg hover:bg-green-50 transition">
                  ดูรายชื่อผู้สมัครงาน
                </button>
                <button className="bg-white border-2 border-green-600 text-green-600 p-4 rounded-lg hover:bg-green-50 transition">
                  สรุปผลการรับสมัคร
                </button>
              </div>
            </div>
          )}

          {/* --- ส่วนสำหรับ USER / Employee (ดูและสมัครงาน) --- */}
          <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-blue-800 mb-4">รายการตำแหน่งงานว่าง (Job Listings)</h2>
            <div className="space-y-4">
              {/* ตรงนี้ในอนาคตคุณจะดึงข้อมูลมาจาก Prisma มา Loop แสดงผล */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">Full-stack Developer (Internal)</h3>
                  <p className="text-sm text-gray-500">แผนก: IT Development | ปิดรับ: 28 ก.พ. 2026</p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                  ดูรายละเอียด
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}