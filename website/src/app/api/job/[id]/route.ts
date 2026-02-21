import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

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

export async function PATCH(
  req: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { username: session.user.name as string },
    });

    if (!user) {
      return NextResponse.json({ error: "ไม่พบข้อมูลผู้ใช้" }, { status: 404 });
    }
    if (user.role !== "ADMIN" && user.role !== "HR") {
      return NextResponse.json({ error: "คุณไม่มีสิทธิ์แก้ไขประกาศงาน" }, { status: 403 });
    }

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      return NextResponse.json({ error: "ไม่พบตำแหน่งงาน" }, { status: 404 });
    }
    if (job.postedBy !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "คุณไม่มีสิทธิ์แก้ไขงานของคนอื่น" }, { status: 403 });
    }

    const body = await req.json();
    
    const isStatusAction = body.action === "kill" || body.action === "restore";

    let updateData: Record<string, unknown> = {};

    if (isStatusAction) {
      updateData = {
        isActive: body.action === "restore",
        killedAt: body.action === "kill" ? new Date() : null,
      };
    } else {
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

export async function DELETE(
  req: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.name) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { username: session.user.name as string },
    });

    if (!user) return NextResponse.json({ error: "ไม่พบข้อมูลผู้ใช้" }, { status: 404 });

    if (user.role !== "ADMIN" && user.role !== "HR") {
      return NextResponse.json({ error: "คุณไม่มีสิทธิ์ลบประกาศงาน" }, { status: 403 });
    }

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) return NextResponse.json({ error: "ไม่พบตำแหน่งงาน" }, { status: 404 });
    if (job.postedBy !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "คุณไม่มีสิทธิ์ลบงานของคนอื่น" }, { status: 403 });
    }

    await prisma.job.delete({ where: { id } });

    return NextResponse.json({ message: "Job deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json({ error: "Delete Failed" }, { status: 500 });
  }
}