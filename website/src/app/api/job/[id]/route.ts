import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
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
      return NextResponse.json(
        { error: "ไม่พบตำแหน่งงาน" },
        { status: 404 }
      );
    }

    return NextResponse.json({ job }, { status: 200 });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // ตรวจสอบว่างานนี้เป็นของผู้ใช้ปัจจุบันหรือไม่
    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      return NextResponse.json(
        { error: "ไม่พบตำแหน่งงาน" },
        { status: 404 }
      );
    }

    const updatedJob = await prisma.job.update({
      where: { id },
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อน" },
        { status: 401 }
      );
    }

    await prisma.job.delete({
      where: { id },
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
