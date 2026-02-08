"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

// 1. ดึงรายการงานที่บันทึก
export async function getSavedJobsAction(userId: string) {
  try {
    const savedJobs = await prisma.savedJob.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            _count: { select: { applications: true } }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return { success: true, data: savedJobs };
  } catch (error) {
    return { success: false, error: "ดึงข้อมูลไม่สำเร็จ" };
  }
}

// 2. สลับสถานะ บันทึก/ยกเลิก (Toggle)
export async function toggleSaveJob(jobId: string, userId: string) {
  try {
    const existingSave = await prisma.savedJob.findFirst({
      where: { jobId, userId },
    });

    if (existingSave) {
      await prisma.savedJob.delete({ where: { id: existingSave.id } });
      revalidatePath("/jobs"); // รีเฟรชหน้างาน
      revalidatePath("/bookmarks"); // รีเฟรชหน้าบุ๊คมาร์ค
      return { success: true, action: "removed" };
    } else {
      await prisma.savedJob.create({
        data: { jobId, userId },
      });
      revalidatePath("/jobs");
      revalidatePath("/bookmarks");
      return { success: true, action: "saved" };
    }
  } catch (error) {
    console.error("Error toggling saved job:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการบันทึก" };
  }
}

// 3. ลบ (สำหรับหน้า Bookmarks)
export async function removeBookmarkAction(savedJobId: string) {
  try {
    await prisma.savedJob.delete({ where: { id: savedJobId } });
    revalidatePath("/bookmarks");
    return { success: true };
  } catch (error) {
    return { success: false, error: "ลบไม่สำเร็จ" };
  }
}