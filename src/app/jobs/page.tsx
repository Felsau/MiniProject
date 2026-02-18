"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import { JobFilterComponent } from "@/components/recruitment/JobFilterComponent";
import { useFilteredJobs } from "@/hooks/useJobFilter";
import type { JobFilterCriteria } from "@/lib/services/jobService";
import { JobCard } from "@/components/recruitment/JobCard";
import { useBookmark } from "@/hooks/useBookmark";
import { ApplyModal } from "@/components/jobs/ApplyModal";

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
  pages.push(1);

  if (current > 3) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

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

  const [applyModal, setApplyModal] = useState<ApplyModalData | null>(null);

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
    fetchJobs(newFilters, 1);
  };

  const handlePageChange = (page: number) => {
    fetchJobs(currentFiltersRef.current, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openApplyModal = useCallback((jobId: string, jobTitle: string) => {
    setApplyModal({ jobId, jobTitle });
  }, []);

  const closeApplyModal = useCallback(() => {
    setApplyModal(null);
    setApplyingJobId(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ค้นหางาน</h1>
          <p className="text-gray-600">ค้นหาตำแหน่งงานที่เหมาะสมกับคุณ</p>
        </div>

        {!optionsLoading && (
          <JobFilterComponent
            onFilterChange={handleFilterChange}
            options={filterOptions}
          />
        )}

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

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

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

      {applyModal && (
        <ApplyModal
          jobId={applyModal.jobId}
          jobTitle={applyModal.jobTitle}
          onClose={closeApplyModal}
        />
      )}
    </div>
  );
}