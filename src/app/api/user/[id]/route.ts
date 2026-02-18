import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import bcrypt from "bcrypt";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.name) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อน" }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        bio: true,
        phone: true,
        position: true, 
      },
    });

    if (!user) {
      return NextResponse.json({ error: "ไม่พบผู้ใช้งาน" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.name) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อน" }, { status: 401 });
    }

    const { id } = await params;

    const currentUser = await prisma.user.findUnique({
      where: { username: session.user.name as string },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "ไม่พบข้อมูลผู้ใช้" }, { status: 404 });
    }

    if (currentUser.id !== id && currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "คุณไม่มีสิทธิ์แก้ไขข้อมูลผู้ใช้คนอื่น" }, { status: 403 });
    }

    const body = await req.json();
    const { fullName, email, phone, position, bio, currentPassword, newPassword } = body;

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "กรุณาระบุรหัสผ่านปัจจุบัน" }, { status: 400 });
      }

      if (newPassword.length < 4) {
        return NextResponse.json({ error: "รหัสผ่านใหม่ต้องมีอย่างน้อย 4 ตัวอักษร" }, { status: 400 });
      }

      const userWithPassword = await prisma.user.findUnique({
        where: { id },
      });

      if (!userWithPassword) {
        return NextResponse.json({ error: "ไม่พบผู้ใช้งาน" }, { status: 404 });
      }

      const isMatch = await bcrypt.compare(currentPassword, userWithPassword.password);
      if (!isMatch) {
        return NextResponse.json({ error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
      });

      return NextResponse.json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        fullName: fullName ?? undefined,
        email: email ?? undefined,
        phone: phone ?? undefined,
        position: position ?? undefined,
        bio: bio ?? undefined,
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        bio: true,
        phone: true,
        position: true,
      },
    });

    return NextResponse.json({ message: "อัปเดตโปรไฟล์สำเร็จ", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}