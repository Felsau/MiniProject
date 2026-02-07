"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

// NOTE: createJobAction, getJobsAction, getDepartmentsAction were removed
// because they referenced old schema models (job_position, departments)
// that no longer exist in the current Prisma schema.
// Use the API routes (/api/job) for job creation instead.

/**
 * Kill (soft delete) a job - mark as inactive
 */
export async function killJobAction(jobId: string) {
  try {
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
    return await prisma.job.findMany({
      where: {
        isActive: false,
      },
      include: {
        postedByUser: true,
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

