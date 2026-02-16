"use client";

import { useState, useCallback } from "react";

export interface JobFormData {
  title: string;
  description: string;
  department: string;
  location: string;
  salary: string;
  employmentType: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
}

const initialFormData: JobFormData = {
  title: "",
  description: "",
  department: "",
  location: "",
  salary: "",
  employmentType: "FULL_TIME",
  requirements: "",
  responsibilities: "",
  benefits: "",
};

/**
 * Hook for managing job form state
 */
export function useJobForm(initialData?: Partial<JobFormData>) {
  const [formData, setFormData] = useState<JobFormData>(
    initialData ? { ...initialFormData, ...initialData } : initialFormData
  );

  const handleChange = useCallback((field: keyof JobFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  const setAll = useCallback((data: Partial<JobFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  return {
    formData,
    handleChange,
    resetForm,
    setAll,
  };
}

/**
 * Hook for managing job API calls
 */
export function useJobApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitJob = useCallback(
    async (formData: JobFormData, method: "POST" | "PUT" | "PATCH" = "POST", jobId?: string) => {
      setLoading(true);
      setError(null);

      try {
        const isUpdate = (method === "PUT" || method === "PATCH") && jobId;
        const url = isUpdate ? `/api/job/${jobId}` : "/api/job";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "ไม่สามารถบันทึกข้อมูลได้");
        }

        return await res.json();
      } catch (err) {
        const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
        console.error("Submit Error:", err);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const killJob = useCallback(async (jobId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/job/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "kill" }),
      });
      if (!res.ok) throw new Error("ไม่สามารถปิดประกาศงานได้");
      return await res.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const restoreJob = useCallback(async (jobId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/job/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore" }),
      });
      if (!res.ok) throw new Error("ไม่สามารถเปิดประกาศงานได้");
      return await res.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    submitJob,
    killJob,
    restoreJob,
  };
}