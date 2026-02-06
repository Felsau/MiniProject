import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getUserAuthStatus } from "@/lib/apiHelpers";
import { type JobFilterCriteria } from "@/lib/jobService";

/**
 * GET all active jobs (or all jobs if admin)
 * Supports filtering by search, department, location, employmentType, salaryMin, salaryMax, isActive
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await getServerSession(authOptions);

    // Determine if user is admin/hr
    const isAdminOrHR = session?.user?.name
      ? await getUserAuthStatus(session.user.name as string)
      : false;

    // Build filter criteria from query parameters
    const filterCriteria: JobFilterCriteria = {
      searchKeyword: searchParams.get("search") || undefined,
      department: searchParams.get("department") || undefined,
      location: searchParams.get("location") || undefined,
      employmentType: searchParams.get("employmentType") || undefined,
      salaryMin: searchParams.get("salaryMin")
        ? parseInt(searchParams.get("salaryMin")!)
        : undefined,
      salaryMax: searchParams.get("salaryMax")
        ? parseInt(searchParams.get("salaryMax")!)
        : undefined,
      isActive: searchParams.get("isActive") === "false" ? false : true,
    };

    // If admin/hr requests inactive jobs, set isActive to undefined (show all)
    if (isAdminOrHR && searchParams.get("includeInactive") === "true") {
      filterCriteria.isActive = undefined;
    }

    // Pagination params
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (!isAdminOrHR) {
      where.isActive = true;
    }

    if (filterCriteria.searchKeyword) {
      where.OR = [
        { title: { contains: filterCriteria.searchKeyword } },
        { description: { contains: filterCriteria.searchKeyword } },
        { requirements: { contains: filterCriteria.searchKeyword } },
      ];
    }
    if (filterCriteria.department) where.department = { contains: filterCriteria.department };
    if (filterCriteria.location) where.location = { contains: filterCriteria.location };
    if (filterCriteria.employmentType) where.employmentType = filterCriteria.employmentType;
    if (filterCriteria.isActive !== undefined && isAdminOrHR) {
      if (searchParams.get("includeInactive") === "true") {
        delete where.isActive;
      } else {
        where.isActive = filterCriteria.isActive;
      }
    }

    const includeRelations = {
      postedByUser: {
        select: {
          fullName: true,
          username: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    };

    // ดึงข้อมูล + นับจำนวนทั้งหมดพร้อมกัน
    const [jobs, totalCount] = await Promise.all([
      prisma.job.findMany({
        where,
        include: includeRelations,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.job.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json(
      { jobs, totalCount, totalPages, currentPage: page },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    );
  }
}

/**
 * POST create a new job
 */
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