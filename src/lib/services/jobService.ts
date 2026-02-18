import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { JobWithCount } from "@/types";

/**
 * Job creation data interface
 */
export interface CreateJobData {
  title: string;
  department?: string;
  location?: string;
  description?: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
  employmentType?: string;
  salary?: string;
}

/**
 * Validate job creation data
 */
export async function validateJobData(data: CreateJobData): Promise<{ valid: boolean; error?: string }> {
  if (!data.title) {
    return { valid: false, error: "Job title is required" };
  }
  return { valid: true };
}

/**
 * Get all jobs (With Applicant Count)
 */
export async function getAllJobs(): Promise<JobWithCount[]> {
  try {
    return await prisma.job.findMany({
      include: {
        postedByUser: {
          select: {
            fullName: true,
            username: true,
          }
        },
        _count: {
          select: { applications: true }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Fetch Jobs Error:", error);
    return [];
  }
}

/**
 * Job filter criteria interface
 */
export interface JobFilterCriteria {
  searchKeyword?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
  isActive?: boolean;
}

/**
 * Search and filter jobs
 */
export async function searchAndFilterJobs(criteria: JobFilterCriteria): Promise<JobWithCount[]> {
  try {
    const where: Record<string, unknown> = {};

    if (criteria.searchKeyword) {
      where.OR = [
        { title: { contains: criteria.searchKeyword } },
        { description: { contains: criteria.searchKeyword } },
        { requirements: { contains: criteria.searchKeyword } },
      ];
    }
    if (criteria.department) where.department = { contains: criteria.department };
    if (criteria.location) where.location = { contains: criteria.location };
    if (criteria.employmentType) where.employmentType = criteria.employmentType;
    if (criteria.isActive !== undefined) where.isActive = criteria.isActive;

    const jobs = await prisma.job.findMany({
      where,
      include: {
        postedByUser: {
          select: { fullName: true, username: true },
        },
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return jobs;
  } catch (error) {
    console.error("Search and Filter Jobs Error:", error);
    return [];
  }
}

/**
 * Get inactive jobs
 */
export async function getInactiveJobs(): Promise<JobWithCount[]> {
  try {
    return await prisma.job.findMany({
      where: { isActive: false },
      include: {
        postedByUser: true,
        _count: { select: { applications: true } }
      },
      orderBy: { killedAt: "desc" },
    });
  } catch (error) {
    console.error("Fetch Inactive Jobs Error:", error);
    return [];
  }
}

/**
 * Kill (soft delete) a job
 */
export async function killJobById(jobId: string) {
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
 * Restore a killed job
 */
export async function restoreJobById(jobId: string) {
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
