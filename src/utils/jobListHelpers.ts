"use client";

/**
 * Get employment type label in Thai
 */
export function getEmploymentTypeLabel(type: string): string {
  const labels: { [key: string]: string } = {
    FULL_TIME: "เต็มเวลา",
    PART_TIME: "พาร์ทไทม์",
    CONTRACT: "สัญญาจ้าง",
    INTERNSHIP: "ฝึกงาน",
  };
  return labels[type] || type;
}

/**
 * Job action handlers
 */
export async function killJob(jobId: string): Promise<boolean> {
  if (!confirm("คุณแน่ใจหรือไม่ที่จะปิดประกาศงานนี้?")) return false;

  try {
    const res = await fetch(`/api/job/${jobId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "kill" }),
    });

    if (!res.ok) {
      alert("ไม่สามารถปิดประกาศงานได้");
      return false;
    }

    return true;
  } catch {
    alert("เกิดข้อผิดพลาด");
    return false;
  }
}

/**
 * Restore a killed job
 */
export async function restoreJob(jobId: string): Promise<boolean> {
  if (!confirm("คุณแน่ใจหรือไม่ที่จะเปิดประกาศงานนี้อีกครั้ง?")) return false;

  try {
    const res = await fetch(`/api/job/${jobId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "restore" }),
    });

    if (!res.ok) {
      alert("ไม่สามารถเปิดประกาศงานได้");
      return false;
    }

    return true;
  } catch {
    alert("เกิดข้อผิดพลาด");
    return false;
  }
}

/**
 * Delete a job permanently
 */
export async function deleteJob(jobId: string): Promise<boolean> {
  if (!confirm("คุณแน่ใจหรือไม่ที่จะลบงานนี้ถาวร?")) return false;

  try {
    const res = await fetch(`/api/job/${jobId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("ไม่สามารถลบงานได้");
      return false;
    }

    return true;
  } catch {
    alert("เกิดข้อผิดพลาด");
    return false;
  }
}
