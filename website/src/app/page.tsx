import { getServerSession } from "next-auth";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function Home() {
  const session = await getServerSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="z-10 w-full max-w-2xl items-center justify-between font-mono text-sm flex flex-col gap-8 bg-white p-10 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold text-gray-900">
          Project Website
        </h1>

        {session ? (
          // ถ้า Login แล้วจะเห็นส่วนนี้
          <div className="flex flex-col items-center gap-4">
            <p className="text-xl text-green-600 font-medium">
              สถานะ: เข้าสู่ระบบแล้ว ✅
            </p>
            <p className="text-gray-700 text-lg">
              ยินดีต้อนรับคุณ <span className="font-bold">{session.user?.name}</span>
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                ไปที่ Dashboard
              </Link>
              <LogoutButton />
            </div>
          </div>
        ) : (
          // ถ้ายังไม่ได้ Login จะเห็นส่วนนี้
          <div className="flex flex-col items-center gap-4">
            <p className="text-xl text-red-500 font-medium">
              สถานะ: ยังไม่ได้เข้าสู่ระบบ ❌
            </p>
            <Link href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
              เข้าสู่ระบบที่นี่
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}