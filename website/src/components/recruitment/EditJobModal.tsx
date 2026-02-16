"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useJobForm, useJobApi } from "@/hooks/useJobForm";
import { JobFormFields } from "./JobFormFields";

interface Job {
  id: string;
  title: string;
  description: string | null;
  department: string | null;
  location: string | null;
  salary: string | null;
  employmentType: string;
  requirements: string | null;
  responsibilities: string | null;
  benefits: string | null;
}

interface EditJobModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

export function EditJobModal({
  job,
  isOpen,
  onClose,
}: EditJobModalProps) {
  const router = useRouter();
  
  const { formData, setAll, handleChange } = useJobForm({
    title: job.title,
    description: job.description || "",
    department: job.department || "",
    location: job.location || "",
    salary: job.salary || "",
    employmentType: job.employmentType,
    requirements: job.requirements || "",
    responsibilities: job.responsibilities || "",
    benefits: job.benefits || "",
  });

  const { loading, submitJob } = useJobApi();

  // Sync data when job changes
  useEffect(() => {
    setAll({
      title: job.title,
      description: job.description || "",
      department: job.department || "",
      location: job.location || "",
      salary: job.salary || "",
      employmentType: job.employmentType,
      requirements: job.requirements || "",
      responsibilities: job.responsibilities || "",
      benefits: job.benefits || "",
    });
  }, [job, setAll]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submitJob(formData, "PATCH", job.id);
      
      alert("บันทึกข้อมูลเรียบร้อยแล้ว");
      onClose();
      router.refresh();
    } catch {
      alert("เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-51">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">แก้ไขตำแหน่งงาน</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <JobFormFields 
            formData={formData} 
            onFieldChange={(field, value) => handleChange(field as keyof import("@/hooks/useJobForm").JobFormData, value)}
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400"
            >
              {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}