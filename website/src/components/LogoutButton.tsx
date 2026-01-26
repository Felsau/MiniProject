'use client' // ต้องมี เพราะมีการคลิก (Interactive)

import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })} // เมื่อกดแล้วให้เด้งไปหน้า login
      className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
    >
      ออกจากระบบ
    </button>
  )
}