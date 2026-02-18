import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";
import { getUserAuthStatus } from "@/lib/auth/apiHelpers";
import { type JobFilterCriteria } from "@/lib/services/jobService";

/**
 * GET all active jobs (or all jobs if admin)
 * Supports filtering by search, department, location, employmentType, salaryMin, salaryMax, isActive
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await getServerSession(authOptions);

    const isAdminOrHR = session?.user?.name
      ? await getUserAuthStatus(session.user.name as string)
      : false;

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

    if (isAdminOrHR && searchParams.get("includeInactive") === "true") {
      filterCriteria.isActive = undefined;
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");
    const skip = (page - 1) * limit;

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
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.name) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อน" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username: session.user.name as string },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลผู้ใช้" },
        { status: 404 }
      );
    }

    if (user.role !== "ADMIN" && user.role !== "HR") {
      return NextResponse.json(
        { error: "คุณไม่มีสิทธิ์สร้างประกาศงาน" },
        { status: 403 }
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