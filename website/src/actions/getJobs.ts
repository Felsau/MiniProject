// src/actions/getJobs.ts
'use server'

import { prisma } from "@/lib/prisma" // ปรับตาม path จริงของคุณ

const ITEMS_PER_PAGE = 6;

export async function getJobs(page: number = 1, query: string = "") {
  try {
    const skip = (page - 1) * ITEMS_PER_PAGE;

    // ดึงข้อมูลพร้อมกัน 2 อย่าง: ข้อมูลงาน และ จำนวนงานทั้งหมด
    const [jobs, totalCount] = await Promise.all([
      prisma.job.findMany({
        skip,
        take: ITEMS_PER_PAGE,
        where: {
          // ใส่เงื่อนไข Search/Filter ตรงนี้
          title: { contains: query},
          isActive: true, 
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.job.count({
        where: {
          title: { contains: query,},
           isActive: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return { success: true, data: jobs, totalPages, currentPage: page };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return { success: false, error: "Failed to fetch jobs" };
  }
}