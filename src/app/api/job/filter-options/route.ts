import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

/**
 * GET filter options for job listing (departments and locations)
 */
export async function GET() {
  try {
    const [departmentRows, locationRows] = await Promise.all([
      prisma.job.findMany({
        where: { isActive: true },
        distinct: ["department"],
        select: { department: true },
      }),
      prisma.job.findMany({
        where: { isActive: true },
        distinct: ["location"],
        select: { location: true },
      }),
    ]);

    const departments = departmentRows
      .map((j) => j.department)
      .filter(Boolean) as string[];

    const locations = locationRows
      .map((j) => j.location)
      .filter(Boolean) as string[];

    const employmentTypes = [
      { value: "FULL_TIME", label: "เต็มเวลา" },
      { value: "PART_TIME", label: "พาร์ตไทม์" },
      { value: "CONTRACT", label: "สัญญา" },
      { value: "INTERNSHIP", label: "ฝึกงาน" },
    ];

    return NextResponse.json(
      { departments, locations, employmentTypes },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    );
  }
}
