import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// ============================================
// GET all active jobs (or all jobs if admin)
// ============================================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get("includeInactive") === "true";
    const session = await getServerSession(authOptions);

    // Determine if user is admin/hr
    let isAdminOrHR = false;
    if (session?.user?.name) {
      const user = await prisma.user.findUnique({
        where: { username: session.user.name as string },
      });
      isAdminOrHR = user?.role === "ADMIN" || user?.role === "HR";
    }

    // Admin/HR can see all jobs, others see only active jobs
    const jobs = await prisma.job.findMany({
      where: includeInactive && isAdminOrHR ? {} : { isActive: true },
      include: {
        postedByUser: {
          select: {
            fullName: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // 1. เช็คว่า Login หรือยัง?
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.name) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อน" },
        { status: 401 }
      );
    }

    // 2. ดึงข้อมูล User คนที่โพสต์
    const user = await prisma.user.findUnique({
      where: { username: session.user.name as string },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลผู้ใช้" },
        { status: 404 }
      );
    }

    // 3. รับข้อมูลจากฟอร์ม
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

    // 4. บันทึกลง Database
    const newJob = await prisma.job.create({
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
        postedBy: user.id,
      },
    });

    return NextResponse.json(
      { message: "สร้างประกาศงานสำเร็จ", job: newJob },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึก" },
      { status: 500 }
    );
  }
}