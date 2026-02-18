"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

async function getSessionUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name) return null;
  const user = await prisma.user.findUnique({
    where: { username: session.user.name as string },
    select: { id: true },
  });
  return user?.id || null;
}

export async function getSavedJobsAction(userId: string) {
  try {
    const sessionUserId = await getSessionUserId();
    if (!sessionUserId || sessionUserId !== userId) {
      return { success: false, error: "ไม่มีสิทธิ์เข้าถึงข้อมูลนี้" };
    }

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

export async function toggleSaveJob(jobId: string, userId: string) {
  try {
    const sessionUserId = await getSessionUserId();
    if (!sessionUserId || sessionUserId !== userId) {
      return { success: false, error: "ไม่มีสิทธิ์ดำเนินการนี้" };
    }

    const existingSave = await prisma.savedJob.findFirst({
      where: { jobId, userId },
    });

    if (existingSave) {
      await prisma.savedJob.delete({ where: { id: existingSave.id } });
      revalidatePath("/jobs");
      revalidatePath("/bookmarks");
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

export async function removeBookmarkAction(savedJobId: string) {
  try {
    const sessionUserId = await getSessionUserId();
    if (!sessionUserId) {
      return { success: false, error: "กรุณาเข้าสู่ระบบก่อน" };
    }

    const bookmark = await prisma.savedJob.findUnique({ where: { id: savedJobId } });
    if (!bookmark || bookmark.userId !== sessionUserId) {
      return { success: false, error: "ไม่มีสิทธิ์ลบบุ๊คมาร์คนี้" };
    }

    await prisma.savedJob.delete({ where: { id: savedJobId } });
    revalidatePath("/bookmarks");
    return { success: true };
  } catch (error) {
    return { success: false, error: "ลบไม่สำเร็จ" };
  }
}