import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";
import {
  sendApplicationConfirmationEmail,
  sendNewApplicationNotifyHR,
  sendApplicationStatusUpdateEmail,
} from "@/lib/services/emailService";

// GET: ดึงรายการงานที่สมัคร
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
    const { jobId, resumeUrl } = body;

    if (!jobId) return NextResponse.json({ error: "Missing jobId" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { username: session.user.name },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const existing = await prisma.application.findFirst({
      where: {
        jobId: jobId,
        userId: user.id,
      },
    });

    if (existing) {
      return NextResponse.json({ error: "คุณเคยสมัครตำแหน่งนี้ไปแล้ว" }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        jobId: jobId,
        userId: user.id,
        status: "PENDING",
        resumeUrl: resumeUrl || null,
      },
      include: {
        job: {
          select: { title: true, department: true, location: true },
        },
      },
    });

    // Email Notification Logic
    const emailData = {
      applicantName: user.fullName || user.username,
      applicantEmail: user.email || "",
      jobTitle: application.job.title,
      jobDepartment: application.job.department,
      jobLocation: application.job.location,
    };

    sendApplicationConfirmationEmail(emailData).catch((err) =>
      console.error("❌ Failed to send confirmation email:", err)
    );

    prisma.user
      .findMany({
        where: { role: { in: ["ADMIN", "HR"] }, email: { not: null } },
        select: { email: true },
      })
      .then((hrUsers) => {
        const hrEmails = hrUsers
          .map((u) => u.email)
          .filter((e): e is string => e !== null && e !== "");
        if (hrEmails.length > 0) {
          sendNewApplicationNotifyHR({ ...emailData, hrEmails }).catch((err) =>
            console.error("❌ Failed to send HR notification email:", err)
          );
        }
      })
      .catch((err) => console.error("❌ Failed to fetch HR emails:", err));

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && (error as any).code === 'P2002') {
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

    if (user.role !== "ADMIN" && user.role !== "HR") {
      return NextResponse.json({ error: "สิทธิ์ไม่เพียงพอ" }, { status: 403 });
    }

    const { applicationId, status } = await req.json();

    if (!applicationId || !status) {
      return NextResponse.json({ error: "กรุณาระบุ applicationId และ status" }, { status: 400 });
    }

    // ✅✅✅ จุดที่แก้ไข: เพิ่มสถานะใหม่ (INTERVIEW, HIRED, OFFER) เข้าไปใน List
    const validStatuses = ["PENDING", "ACCEPTED", "REJECTED", "INTERVIEW", "HIRED", "OFFER"];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: `สถานะไม่ถูกต้อง (${status})` }, { status: 400 });
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: {
        job: {
          select: { title: true, department: true, location: true },
        },
        user: {
          select: { fullName: true, username: true, email: true },
        },
      },
    });

    // ส่วนส่ง Email (ส่งเฉพาะ Accepted/Rejected ตาม Logic เดิม)
    // หมายเหตุ: หากต้องการให้ส่งเมลตอนนัดสัมภาษณ์ด้วย ต้องแก้ฟังก์ชัน sendApplicationStatusUpdateEmail เพิ่มเติม
    if (
      (status === "ACCEPTED" || status === "REJECTED") &&
      updated.user?.email
    ) {
      sendApplicationStatusUpdateEmail({
        applicantName: updated.user.fullName || updated.user.username,
        applicantEmail: updated.user.email,
        jobTitle: updated.job.title,
        jobDepartment: updated.job.department,
        jobLocation: updated.job.location,
        newStatus: status as "ACCEPTED" | "REJECTED",
      }).catch((err) =>
        console.error("❌ Failed to send status update email:", err)
      );
    }

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    console.error("Update Application Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการอัปเดตสถานะ" }, { status: 500 });
  }
}