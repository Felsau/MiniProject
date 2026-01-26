'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()
  // @ts-ignore
  const role = session?.user?.role

  return (
    <nav className="p-4 bg-white shadow flex justify-between">
      <Link href="/dashboard" className="font-bold">HOME</Link>
      
      <div className="flex gap-4">
        {/* 🔒 ถ้าเป็น ADMIN เท่านั้นถึงจะเห็นเมนูนี้ */}
        {role === "ADMIN" && (
          <Link href="/register" className="text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50">
            + เพิ่มสมาชิก
          </Link>
        )}
        
        {session ? (
          <span>{session.user?.name} ({role})</span>
        ) : (
          <Link href="/login">เข้าสู่ระบบ</Link>
        )}
      </div>
    </nav>
  )
}