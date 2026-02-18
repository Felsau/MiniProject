"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useJobForm, useJobApi } from "@/hooks/useJobForm";
import { JobFormFields } from "./JobFormFields";

export default function AddJobModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { formData, handleChange, resetForm } = useJobForm();
  const { loading, submitJob } = useJobApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submitJob(formData);
      setIsOpen(false);
      resetForm();
      router.refresh();
    } catch {
      // Error is handled by the hook's state
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <Plus size={20} />
        เพิ่มตำแหน่งงาน
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                เพิ่มตำแหน่งงานใหม่
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <JobFormFields 
                formData={formData} 
                onFieldChange={handleChange}
              />

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400"
                >
                  {loading ? "กำลังบันทึก..." : "เพิ่มงาน"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
