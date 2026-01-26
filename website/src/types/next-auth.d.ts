// types/next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    role: string // เพิ่มบรรทัดนี้
  }
  interface Session {
    user: User & {
      role: string // เพิ่มบรรทัดนี้
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string // เพิ่มบรรทัดนี้
  }
}