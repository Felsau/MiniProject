import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  try {
    // 🛡️ เช็ค Session อีกรอบที่หลังบ้าน
    const session = await getServerSession()
    // @ts-ignore
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "สิทธิ์ไม่เพียงพอ" }, { status: 403 })
    }

    const { username, password, role } = await req.json()

    // ... Logic การ Hash และ Save ข้อมูล (เหมือนเดิมที่คุณทำไว้) ...
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: { username, password: hashedPassword, role }
    })

    return NextResponse.json({ message: "สำเร็จ" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 })
  }
}