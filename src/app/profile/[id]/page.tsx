"use client";

import { useEffect, useState, use } from "react";
import { User, Mail, Calendar, Briefcase, ArrowLeft, Loader2, Phone } from "lucide-react";
import Link from "next/link";

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/user/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32}/></div>;
  if (!user) return <div className="p-10 text-center text-gray-500">ไม่พบข้อมูลผู้ใช้งานนี้</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition">
          <ArrowLeft size={20} /> ย้อนกลับ
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-4 flex justify-between items-end">
              <div className="w-32 h-32 bg-white rounded-full p-2 shadow-md">
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-4xl font-bold">
                  {user.fullName?.[0] || user.username?.[0] || <User size={48} />}
                </div>
              </div>
              <span className="mb-4 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100 uppercase tracking-wide">
                {user.role}
              </span>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.fullName || user.username}</h1>
              <p className="text-gray-500 mt-1 text-lg flex items-center gap-2">
                {user.position ? (
                  <span className="flex items-center gap-1"><Briefcase size={16}/> {user.position}</span>
                ) : (
                  <span className="italic text-gray-400">ไม่ได้ระบุตำแหน่ง</span>
                )}
              </p>
            </div>

            <hr className="my-6 border-gray-100" />

            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">เกี่ยวกับฉัน</h2>
              {user.bio ? (
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{user.bio}</p>
              ) : (
                <p className="text-gray-400 italic">ยังไม่มีข้อมูลแนะนำตัว</p>
              )}
            </div>

            <h2 className="text-lg font-bold text-gray-900 mb-3">ข้อมูลติดต่อ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600">
                  <Mail size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-400 font-bold uppercase">อีเมล</p>
                  <p className="text-gray-900 font-medium truncate" title={user.email}>{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-green-600">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">เบอร์โทรศัพท์</p>
                  <p className="text-gray-900 font-medium">{user.phone || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-600">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">วันที่เริ่มใช้งาน</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(user.createdAt).toLocaleDateString("th-TH", {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}