"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

async function requireAdminOrHRSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name) {
    return { authorized: false, error: "กรุณาเข้าสู่ระบบก่อน" };
  }
  const user = await prisma.user.findUnique({
    where: { username: session.user.name as string },
  });
  if (!user || (user.role !== "ADMIN" && user.role !== "HR")) {
    return { authorized: false, error: "คุณไม่มีสิทธิ์ดำเนินการนี้" };
  }
  return { authorized: true, user };
}

/**
 * Kill (soft delete) a job - mark as inactive
 */
export async function killJobAction(jobId: string) {
  try {
    const auth = await requireAdminOrHRSession();
    if (!auth.authorized) return { success: false, error: auth.error };

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        isActive: false,
        killedAt: new Date(),
      },
    });

    revalidatePath("/");
    return { success: true, job: updatedJob };
  } catch (error) {
    console.error("Kill Job Error:", error);
    return { success: false, error: "ไม่สามารถปิดประกาศงานได้" };
  }
}

/**
 * Restore a killed job - mark as active
 */
export async function restoreJobAction(jobId: string) {
  try {
    const auth = await requireAdminOrHRSession();
    if (!auth.authorized) return { success: false, error: auth.error };

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        isActive: true,
        killedAt: null,
      },
    });

    revalidatePath("/");
    return { success: true, job: updatedJob };
  } catch (error) {
    console.error("Restore Job Error:", error);
    return { success: false, error: "ไม่สามารถเปิดประกาศงานได้" };
  }
}

/**
 * Get all inactive jobs
 */
export async function getInactiveJobsAction() {
  try {
    const auth = await requireAdminOrHRSession();
    if (!auth.authorized) return [];

    return await prisma.job.findMany({
      where: {
        isActive: false,
      },
      include: {
        postedByUser: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
      },
      orderBy: {
        killedAt: "desc",
      },
    });
  } catch (error) {
    console.error("Fetch Inactive Jobs Error:", error);
    return [];
  }
}

