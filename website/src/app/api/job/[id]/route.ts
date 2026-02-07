import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";

// ✅ Type สำหรับ Params (Next.js 15)
interface RouteParams {
  params: Promise<{ id: string }>;
}

// ============================================
// GET - ดึงข้อมูลงานรายตัว
// ============================================
export async function GET(
  req: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        postedByUser: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "ไม่พบตำแหน่งงาน" }, { status: 404 });
    }

    return NextResponse.json({ job }, { status: 200 });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// ============================================
// PATCH - รวมพลัง: แก้ไขข้อมูล + ปิด/เปิดงาน
// ============================================
export async function PATCH(
  req: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params; // ✅ Await ID ก่อนเสมอ
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // ตรวจสอบว่าเป็นคำสั่ง Kill/Restore หรือไม่?
    const isStatusAction = body.action === "kill" || body.action === "restore";

    // เตรียมข้อมูลที่จะอัปเดต (Update Data)
    let updateData: Record<string, unknown> = {};

    if (isStatusAction) {
      // 👉 กรณี 1: สั่งปิด/เปิดงาน
      updateData = {
        isActive: body.action === "restore", // restore = true, kill = false
        killedAt: body.action === "kill" ? new Date() : null,
      };
    } else {
      // 👉 กรณี 2: แก้ไขข้อมูลทั่วไป (Edit Job)
      updateData = {
        title: body.title,
        description: body.description,
        department: body.department,
        location: body.location,
        salary: body.salary,
        employmentType: body.employmentType,
        requirements: body.requirements,
        responsibilities: body.responsibilities,
        benefits: body.benefits,
      };
    }

    // อัปเดตลง Database
    const updatedJob = await prisma.job.update({
      where: { id },
      data: updateData,
      include: { postedByUser: true },
    });

    return NextResponse.json(
      { 
        message: isStatusAction ? "อัปเดตสถานะสำเร็จ" : "แก้ไขข้อมูลสำเร็จ", 
        job: updatedJob 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: "Update Failed" }, { status: 500 });
  }
}

// ============================================
// DELETE - ลบงานถาวร
// ============================================
export async function DELETE(
  req: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.job.delete({ where: { id } });

    return NextResponse.json({ message: "Job deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json({ error: "Delete Failed" }, { status: 500 });
  }
}