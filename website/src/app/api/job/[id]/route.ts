import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อน" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      department,
      location,
      salary,
      employmentType,
      requirements,
      responsibilities,
      benefits,
    } = body;

    const updatedJob = await prisma.job.update({
      where: { id: params.id },
      data: {
        title,
        description: description || null,
        department: department || null,
        location: location || null,
        salary: salary || null,
        employmentType: employmentType || "FULL_TIME",
        requirements: requirements || null,
        responsibilities: responsibilities || null,
        benefits: benefits || null,
      },
    });

    return NextResponse.json(
      { message: "แก้ไขงานสำเร็จ", job: updatedJob },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการแก้ไข" },
      { status: 500 }
    );
  }
}

// ============================================
// Kill Section - Soft Delete Job Posting
// ============================================
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อน" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { action } = body;

    // Validate action
    if (!action || !["kill", "restore"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Use 'kill' or 'restore'" },
        { status: 400 }
      );
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: { postedByUser: true },
    });

    if (!job) {
      return NextResponse.json(
        { error: "ไม่พบประกาศงาน" },
        { status: 404 }
      );
    }

    // Check authorization - only author, HR, or ADMIN can kill jobs
    const user = await prisma.user.findUnique({
      where: { username: session.user?.name as string },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลผู้ใช้" },
        { status: 404 }
      );
    }

    const isAuthor = job.postedBy === user.id;
    const isAuthorized = isAuthor || user.role === "HR" || user.role === "ADMIN";

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "คุณไม่มีสิทธิ์แก้ไขประกาศงานนี้" },
        { status: 403 }
      );
    }

    // Perform the action
    const updatedJob = await prisma.job.update({
      where: { id: params.id },
      data: {
        isActive: action === "kill" ? false : true,
        killedAt: action === "kill" ? new Date() : null,
      },
      include: { postedByUser: true },
    });

    const message = action === "kill" 
      ? "ปิดประกาศงานสำเร็จ" 
      : "เปิดประกาศงานสำเร็จ";

    return NextResponse.json(
      { message, job: updatedJob },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating job status:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการเปลี่ยนสถานะ" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อน" },
        { status: 401 }
      );
    }

    await prisma.job.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "ลบงานสำเร็จ" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบ" },
      { status: 500 }
    );
  }
}

