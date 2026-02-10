// 📂 ไฟล์: src/app/api/job/[id]/applicants/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ 1. เปลี่ยน Type ของ params ให้เป็น Promise
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ 2. ต้อง await params ก่อนเรียกใช้ id
    const { id } = await params;

    const jobWithApplicants = await prisma.job.findUnique({
      where: { id },
      include: {
        applications: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                username: true,
                email: true,
                // image: true, // ถ้ามีรูปโปรไฟล์ให้เปิดบรรทัดนี้
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!jobWithApplicants) {
      return NextResponse.json({ error: "ไม่พบตำแหน่งงานนี้" }, { status: 404 });
    }

    return NextResponse.json(jobWithApplicants);
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}