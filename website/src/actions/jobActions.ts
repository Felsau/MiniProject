"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createJobAction(data: {
  job_title: string;
  department_id: number;
  job_level?: string;
  work_location?: string;
  job_description?: string;
  responsibilities?: string;
  qualifications?: string;
  special_conditions?: string;
  hiring_count?: number;
  employment_type?: string;
  salary_min?: number;
  salary_max?: number;
  close_date?: string;
}) {
  try {
    if (!data.job_title) throw new Error("Job title is required");
    if (!data.department_id) throw new Error("Department is required");

    await prisma.job_position.create({
      data: {
        job_title: data.job_title,
        department_id: data.department_id,
        job_level: data.job_level || null,
        work_location: data.work_location || null,
        job_description: data.job_description || null,
        responsibilities: data.responsibilities || null,
        qualifications: data.qualifications || null,
        special_conditions: data.special_conditions || null,
        hiring_count: data.hiring_count || 1,
        employment_type: data.employment_type || null,
        salary_min: data.salary_min || null,
        salary_max: data.salary_max || null,
        close_date: data.close_date ? new Date(data.close_date) : null,
        status: "Open",
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to create job" };
  }
}

export async function getJobsAction() {
  try {
    return await prisma.job_position.findMany({
      include: {
        departments: true,
      },
      orderBy: {
        job_id: "desc",
      },
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    return []; 
  }
}

export async function getDepartmentsAction() {
  try {
    console.log("getDepartmentsAction called");
    const depts = await prisma.departments.findMany({
      orderBy: {
        dept_name: "asc",
      },
    });
    console.log("Raw departments from DB:", depts);
    console.log("Number of departments:", depts.length);
    return depts;
  } catch (error) {
    console.error("Fetch Departments Error:", error);
    return [];
  }
}

