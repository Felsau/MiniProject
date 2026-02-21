import { useState } from "react";

export function useJobActions() {
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);

  const updateJobStatus = async (jobId: string, action: "kill" | "restore") => {
    setLoadingJobId(jobId);
    try {
      const res = await fetch(`/api/job/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) throw new Error("Failed");
      return true;
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด");
      return false;
    } finally {
      setLoadingJobId(null);
    }
  };

  const handleKillJob = async (jobId: string): Promise<boolean> => {
    if (!confirm("คุณต้องการ 'ปิด' รับสมัครงานนี้ใช่หรือไม่?")) {
      return false;
    }
    return await updateJobStatus(jobId, "kill");
  };

  const handleRestoreJob = async (jobId: string): Promise<boolean> => {
    if (!confirm("คุณต้องการ 'เปิด' รับสมัครงานนี้อีกครั้งใช่หรือไม่?")) {
      return false;
    }
    return await updateJobStatus(jobId, "restore");
  };

  const handleDeleteJob = async (jobId: string): Promise<boolean> => {
    if (!confirm("⚠️ ลบถาวร: คุณแน่ใจหรือไม่ที่จะลบงานนี้?\n(กู้คืนไม่ได้นะครับ)")) {
      return false;
    }

    setLoadingJobId(jobId);
    try {
      await fetch(`/api/job/${jobId}`, { method: "DELETE" });
      return true;
    } catch {
      alert("ลบไม่สำเร็จ");
      return false;
    } finally {
      setLoadingJobId(null);
    }
  };

  return { loadingJobId, handleKillJob, handleRestoreJob, handleDeleteJob };
}