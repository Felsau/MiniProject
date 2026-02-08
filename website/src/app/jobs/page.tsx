"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Briefcase, ChevronLeft, ChevronRight, Upload, FileText, X, Loader2 } from "lucide-react";
import { JobFilterComponent } from "@/components/recruitment/JobFilterComponent";
import { useFilteredJobs } from "@/hooks/useJobFilter";
import type { JobFilterCriteria } from "@/lib/services/jobService";
import { JobCard } from "@/components/recruitment/JobCard";
import { useBookmark } from "@/hooks/useBookmark";

interface FilterOptions {
  departments: string[];
  locations: string[];
  employmentTypes: { value: string; label: string }[];
}

/** ข้อมูล Modal สมัครงาน */
interface ApplyModalData {
  jobId: string;
  jobTitle: string;
}

/**
 * สร้างรายการเลขหน้าแบบย่อ เช่น [1, 2, "...", 5, 6, 7, "...", 10]
 */
function generatePageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  // เริ่มต้นเสมอด้วยหน้า 1
  pages.push(1);

  if (current > 3) {
    pages.push("...");
  }

  // หน้ารอบๆ หน้าปัจจุบัน
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  // จบด้วยหน้าสุดท้ายเสมอ
  pages.push(total);

  return pages;
}

export default function JobsPage() {
  const { jobs, loading, error, currentPage, totalPages, totalCount, fetchJobs } = useFilteredJobs();
  const { bookmarkedJobIds, handleBookmark, handleUnbookmark } = useBookmark();
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    departments: [],
    locations: [],
    employmentTypes: [],
  });
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const currentFiltersRef = useRef<JobFilterCriteria>({});

  // Resume Upload Modal State
  const [applyModal, setApplyModal] = useState<ApplyModalData | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const response = await fetch("/api/job/filter-options");
        if (response.ok) {
          const data = await response.json();
          setFilterOptions(data);
        }
      } catch (err) {
        console.error("Error loading filter options:", err);
      } finally {
        setOptionsLoading(false);
      }
    };

    loadFilterOptions();
    fetchJobs({});
  }, [fetchJobs]);

  const handleFilterChange = (newFilters: JobFilterCriteria) => {
    currentFiltersRef.current = newFilters;
    fetchJobs(newFilters, 1); // reset to page 1 on filter change
  };

  const handlePageChange = (page: number) => {
    fetchJobs(currentFiltersRef.current, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // เปิด Modal สมัครงาน (ให้เลือกแนบ Resume)
  const openApplyModal = useCallback((jobId: string, jobTitle: string) => {
    setApplyModal({ jobId, jobTitle });
    setResumeFile(null);
  }, []);

  // ปิด Modal
  const closeApplyModal = useCallback(() => {
    setApplyModal(null);
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // เลือกไฟล์ Resume
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("❌ รองรับเฉพาะไฟล์ PDF เท่านั้น");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("❌ ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)");
      e.target.value = "";
      return;
    }

    setResumeFile(file);
  }, []);

  // ส่งใบสมัคร (พร้อมอัปโหลด Resume ถ้ามี)
  const handleSubmitApplication = async () => {
    if (!applyModal) return;

    setApplyingJobId(applyModal.jobId);
    setUploadProgress(true);

    try {
      let resumeUrl: string | null = null;

      // อัปโหลด Resume ก่อน (ถ้ามีไฟล์แนบ)
      if (resumeFile) {
        const formData = new FormData();
        formData.append("file", resumeFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(uploadData.error || "อัปโหลดไฟล์ไม่สำเร็จ");
        }

        resumeUrl = uploadData.url;
      }

      // ส่งใบสมัคร
      const res = await fetch("/api/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: applyModal.jobId, resumeUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "สมัครไม่สำเร็จ");

      alert(`🎉 สมัครงาน "${applyModal.jobTitle}" สำเร็จเรียบร้อย!`);
      closeApplyModal();
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "สมัครไม่สำเร็จ";
      alert("❌ " + message);
    } finally {
      setApplyingJobId(null);
      setUploadProgress(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ค้นหางาน</h1>
          <p className="text-gray-600">ค้นหาตำแหน่งงานที่เหมาะสมกับคุณ</p>
        </div>

        {/* Filter Component */}
        {!optionsLoading && (
          <JobFilterComponent
            onFilterChange={handleFilterChange}
            options={filterOptions}
          />
        )}

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center border border-gray-200 border-dashed">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-500 text-lg font-medium">ไม่พบตำแหน่งงานที่ค้นหา</p>
            <p className="text-gray-400 text-sm mt-1">ลองค้นหาด้วยคำอื่น หรือปรับเปลี่ยนตัวกรอง</p>
          </div>
        ) : (
          <>
            {/* แสดงจำนวนผลลัพธ์ */}
            <div className="mb-4 text-sm text-gray-500">
              แสดง {jobs.length} จาก {totalCount} ตำแหน่ง (หน้า {currentPage} / {totalPages})
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  userRole="USER"
                  isApplying={applyingJobId === job.id}
                  onApply={() => openApplyModal(job.id, job.title)}
                  isBookmarked={bookmarkedJobIds.includes(job.id)}
                  onBookmark={handleBookmark}
                  onUnbookmark={handleUnbookmark}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                {/* ปุ่มย้อนกลับ */}
                <button
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                {/* เลขหน้า */}
                {generatePageNumbers(currentPage, totalPages).map((page, index) =>
                  page === "..." ? (
                    <span key={`dots-${index}`} className="px-2 py-2 text-gray-400 text-sm">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page as number)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                {/* ปุ่มถัดไป */}
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ===== Modal สมัครงาน + แนบ Resume ===== */}
      {applyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">สมัครงาน</h2>
              <button
                onClick={closeApplyModal}
                className="text-white/80 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-gray-700 mb-1">ตำแหน่งที่สมัคร:</p>
              <p className="text-lg font-bold text-gray-900 mb-6">{applyModal.jobTitle}</p>

              {/* Upload Area */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  แนบ Resume / CV (PDF)
                  <span className="text-gray-400 font-normal ml-1">— ไม่บังคับ</span>
                </label>

                {!resumeFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
                  >
                    <Upload className="mx-auto mb-3 text-gray-400 group-hover:text-blue-500 transition" size={36} />
                    <p className="text-gray-600 text-sm font-medium">คลิกเพื่อเลือกไฟล์ PDF</p>
                    <p className="text-gray-400 text-xs mt-1">ขนาดไม่เกิน 5MB</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                    <FileText className="text-green-600 shrink-0" size={24} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-green-800 truncate">{resumeFile.name}</p>
                      <p className="text-xs text-green-600">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setResumeFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="text-green-500 hover:text-red-500 transition"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 bg-gray-50">
              <button
                onClick={closeApplyModal}
                disabled={uploadProgress}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSubmitApplication}
                disabled={uploadProgress || applyingJobId === applyModal.jobId}
                className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {uploadProgress ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    กำลังส่ง...
                  </>
                ) : (
                  "ยืนยันสมัครงาน"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}