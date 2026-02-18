import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import bcrypt from "bcrypt"
import { authOptions } from "@/lib/auth/authOptions"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "สิทธิ์ไม่เพียงพอ" }, { status: 403 })
    }

    const { username, password, role } = await req.json()
    const hashedPassword = await bcrypt.hash(password, 10)
    
    await prisma.user.create({
      data: { username, password: hashedPassword, role }
    })

    return NextResponse.json({ message: "สำเร็จ" }, { status: 201 })

  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการสร้างบัญชี" }, { status: 500 })
  }
}