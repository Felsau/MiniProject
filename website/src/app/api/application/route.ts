import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET: ดึงรายการงานที่สมัคร (USER ดูของตัวเอง / ADMIN-HR ดูทั้งหมด)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.name) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { username: session.user.name } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isAdminOrHR = user.role === "ADMIN" || user.role === "HR";

    const applications = await prisma.application.findMany({
      where: isAdminOrHR ? {} : { userId: user.id },
      include: {
        job: true,
        user: {
          select: { id: true, fullName: true, username: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(applications);
  } catch {
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }
}

// POST: สมัครงาน
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.name) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { jobId } = body;

    // 1. ตรวจสอบว่าส่ง jobId มาจริงไหม
    if (!jobId) return NextResponse.json({ error: "Missing jobId" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { username: session.user.name },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 2. เช็คซ้ำอีกรอบด้วย findUnique (ถ้าตั้ง @@unique ไว้ใน schema จะใช้ findUnique ได้แม่นกว่า)
    const existing = await prisma.application.findFirst({
      where: {
        jobId: jobId,
        userId: user.id,
      },
    });

    if (existing) {
      return NextResponse.json({ error: "คุณเคยสมัครตำแหน่งนี้ไปแล้ว" }, { status: 400 });
    }

    // 3. บันทึกข้อมูล
    await prisma.application.create({
      data: {
        jobId: jobId,
        userId: user.id,
        status: "PENDING", // กำหนดสถานะเริ่มต้นให้ชัดเจน
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error: unknown) {
    // ถ้าพลาดจากระดับ Database (เช่นกดพร้อมกัน 2 ครั้งจริงๆ) ให้ดัก Error ตรงนี้
    if (error instanceof Error && "code" in error && (error as { code: string }).code === 'P2002') {
      return NextResponse.json({ error: "คุณสมัครงานนี้ไปแล้ว (Database Error)" }, { status: 400 });
    }
    console.error("Apply Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการสมัคร" }, { status: 500 });
  }
}

// PATCH: อัปเดตสถานะใบสมัคร (ADMIN/HR เท่านั้น)
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.name) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { username: session.user.name } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // ตรวจสอบสิทธิ์
    if (user.role !== "ADMIN" && user.role !== "HR") {
      return NextResponse.json({ error: "สิทธิ์ไม่เพียงพอ" }, { status: 403 });
    }

    const { applicationId, status } = await req.json();

    if (!applicationId || !status) {
      return NextResponse.json({ error: "กรุณาระบุ applicationId และ status" }, { status: 400 });
    }

    if (!["PENDING", "ACCEPTED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: { job: true, user: { select: { fullName: true, username: true } } },
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    console.error("Update Application Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการอัปเดตสถานะ" }, { status: 500 });
  }
}