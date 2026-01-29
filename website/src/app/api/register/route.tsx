import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
// 1. 👇 เพิ่มบรรทัดนี้ เพื่อดึง Config มาใช้
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    // 2. 👇 ใส่ authOptions เข้าไปในวงเล็บ (ห้ามลืม!)
    const session = await getServerSession(authOptions)

    // เช็คว่ามี Session และเป็น ADMIN จริงไหม
    // @ts-ignore
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "สิทธิ์ไม่เพียงพอ" }, { status: 403 })
    }

    // ... (ส่วนการบันทึกข้อมูล ปล่อยไว้เหมือนเดิม) ...
    const { username, password, role } = await req.json()
    const hashedPassword = await bcrypt.hash(password, 10)
    
    await prisma.user.create({
      data: { username, password: hashedPassword, role }
    })

    return NextResponse.json({ message: "สำเร็จ" }, { status: 201 })

  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการสร้างบัญชี" }, { status: 500 })
  }
}