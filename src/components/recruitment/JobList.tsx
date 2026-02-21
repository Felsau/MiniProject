"use client";

import { useState } from "react";
import { Briefcase, Search, Eye, EyeOff } from "lucide-react";
import {EditJobModal} from "./EditJobModal";
import { useRouter } from "next/navigation";
import { useJobActions } from "@/hooks/useJobActions";
import { JobCard } from "./JobCard";
import { JobWithCount } from "@/types";

interface JobListProps {
  jobs: JobWithCount[];
  userRole?: string;
  bookmarkedJobIds?: string[];
  onBookmark?: (jobId: string) => Promise<void>;
  onUnbookmark?: (jobId: string) => Promise<void>;
}

export function JobList({ jobs, userRole, bookmarkedJobIds, onBookmark, onUnbookmark }: JobListProps) {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const [selectedJob, setSelectedJob] = useState<JobWithCount | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { handleKillJob, handleRestoreJob, handleDeleteJob } = useJobActions();

  const handleEdit = (job: JobWithCount) => {
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };

  const handleJobAction = async (
    actionFn: (jobId: string) => Promise<boolean>,
    jobId: string
  ): Promise<boolean> => {
    const success = await actionFn(jobId);
    if (success) {
      router.refresh();
    }
    return success;
  };

  const filteredJobs = jobs.filter((job) => {
    if (!showInactive && !job.isActive) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        job.title.toLowerCase().includes(term) ||
        job.department?.toLowerCase().includes(term) ||
        job.location?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <>
      {/* --- ✅ 3. เพิ่มส่วน Header (ช่องค้นหา + ปุ่ม) กลับมาไว้ตรงนี้ --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Briefcase size={24} className="text-blue-600" />
          รายการตำแหน่งงาน ({filteredJobs.length})
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="ค้นหาตำแหน่ง, แผนก..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowInactive(!showInactive)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${showInactive
                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
          >
            {showInactive ? <Eye size={16} /> : <EyeOff size={16} />}
            {showInactive ? "ซ่อนงานปิด" : "ดูงานที่ปิด"}
          </button>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center border border-gray-200 border-dashed">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="text-gray-400" size={32} />
          </div>
          <p className="text-gray-500 text-lg font-medium">ไม่พบข้อมูลตามเงื่อนไข</p>
          {searchTerm && <p className="text-gray-400 text-sm mt-1">ลองเปลี่ยนคำค้นหาดูใหม่</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              userRole={userRole}
              isBookmarked={bookmarkedJobIds?.includes(job.id)}
              onBookmark={onBookmark}
              onUnbookmark={onUnbookmark}
              onEdit={handleEdit}
              onKill={(jobId) => handleJobAction(handleKillJob, jobId)}
              onRestore={(jobId) => handleJobAction(handleRestoreJob, jobId)}
              onDelete={(jobId) => handleJobAction(handleDeleteJob, jobId)}
            />
          ))}
        </div>
      )}

      {selectedJob && (
        <EditJobModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedJob(null);
          }}
          job={selectedJob as JobWithCount}
        />
      )}
    </>
  );
}

export default JobList;