// 📂 src/app/api/application/status/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { isUserAdminOrHR } from "@/lib/auth/sessionHelpers";

const VALID_STATUSES = ["PENDING", "ACCEPTED", "REJECTED", "INTERVIEW", "HIRED", "OFFER"];

export async function PUT(req: Request) {
  try {
    // ✅ Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.name) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อน" }, { status: 401 });
    }

    // ✅ Role check - only ADMIN/HR
    const isAdmin = await isUserAdminOrHR(session.user.name as string);
    if (!isAdmin) {
      return NextResponse.json({ error: "คุณไม่มีสิทธิ์เปลี่ยนสถานะใบสมัคร" }, { status: 403 });
    }

    const { applicationId, status } = await req.json();

    // ✅ Input validation
    if (!applicationId || !status) {
      return NextResponse.json({ error: "กรุณาระบุ applicationId และ status" }, { status: 400 });
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `สถานะไม่ถูกต้อง ต้องเป็น: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}