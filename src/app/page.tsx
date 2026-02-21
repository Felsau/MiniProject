"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Building2, Lock, User, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        setError("ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง");
        setLoading(false);
      } else {
        await fetch("/api/auth/session");
        
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 p-4 relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-6 transform hover:scale-105 transition-transform">
            <Building2 size={40} className="text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            ระบบจัดหางานภายในองค์กร
          </h1>
          <p className="text-blue-100 text-lg">ระบบจัดหางานภายในองค์กร</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20">
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">เข้าสู่ระบบ</h2>
            <p className="text-gray-500 text-sm mt-1">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                ชื่อผู้ใช้ (Username)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  required
                  className="w-full border-2 border-gray-200 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-gray-900 font-medium"
                  placeholder="ชื่อผู้ใช้ของคุณ"
                  onChange={(e) => setData({ ...data, username: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="password" 
                  required
                  className="w-full border-2 border-gray-200 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-gray-900 font-medium"
                  placeholder="••••••••"
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  กำลังตรวจสอบ...
                </>
              ) : (
                <>
                  เข้าสู่ระบบ
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              หากยังไม่มีบัญชี โปรดติดต่อผู้ดูแลระบบเพื่อตรวจสอบสิทธิ์
            </p>
          </div>

        </div>

        <p className="text-center text-white/70 text-sm mt-6">
          © 2026 ระบบจัดหางานภายในองค์กร. สงวนลิขสิทธิ์.
        </p>
      </div>
    </div>
  );
}
