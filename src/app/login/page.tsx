"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [data, setData] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      })

      if (res?.error) {
        setError("ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง")
        setLoading(false)
      } else {
        const sessionRes = await fetch("/api/auth/session")
        const session = await sessionRes.json()
        const userRole = session?.user?.role
        
        if (userRole === "USER") {
          router.push("/jobs")
        } else {
          router.push("/dashboard")
        }
        router.refresh()
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 text-2xl">💼</div>
          <h1 className="text-2xl font-bold text-gray-800">เข้าสู่ระบบ</h1>
          <p className="text-gray-500 text-sm">ยินดีต้อนรับสู่ระบบ Recruitment</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              required
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900"
              placeholder="admin / hr / employee"
              onChange={(e) => setData({ ...data, username: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900"
              placeholder="••••••"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:bg-gray-400"
          >
            {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          ยังไม่มีบัญชี? <Link href="/register" className="text-blue-600 font-bold hover:underline">สมัครสมาชิก</Link>
        </p>

      </div>
    </div>
  )
}