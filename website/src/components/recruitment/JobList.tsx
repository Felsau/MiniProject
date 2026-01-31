"use client";

import { useState } from "react";
import { MapPin, Briefcase, Trash2, Edit2, DollarSign, Power, RotateCcw } from "lucide-react";
import EditJobModal from "./EditJobModal";
import { useRouter } from "next/navigation";

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
  createdAt: Date;
  isActive: boolean;
  killedAt: Date | null;
  postedByUser: {
    fullName: string | null;
    username: string;
  } | null;
}

interface JobListProps {
  jobs: Job[];
  userRole?: string;
  showInactive?: boolean;
}

export default function JobList({ jobs, userRole, showInactive = false }: JobListProps) {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);

  const handleKillJob = async (jobId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะปิดประกาศงานนี้?")) return;

    setLoadingJobId(jobId);
    try {
      const res = await fetch(`/api/job/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "kill" }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("ไม่สามารถปิดประกาศงานได้");
      }
    } catch (_error) {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setLoadingJobId(null);
    }
  };

  const handleRestoreJob = async (jobId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะเปิดประกาศงานนี้อีกครั้ง?")) return;

    setLoadingJobId(jobId);
    try {
      const res = await fetch(`/api/job/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore" }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("ไม่สามารถเปิดประกาศงานได้");
      }
    } catch (_error) {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setLoadingJobId(null);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบงานนี้ถาวร?")) return;

    try {
      const res = await fetch(`/api/job/${jobId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("ไม่สามารถลบงานได้");
      }
    } catch (_error) {
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };

  const getEmploymentTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      FULL_TIME: "เต็มเวลา",
      PART_TIME: "พาร์ทไทม์",
      CONTRACT: "สัญญาจ้าง",
      INTERNSHIP: "ฝึกงาน",
    };
    return labels[type] || type;
  };

  // Filter jobs based on showInactive prop
  const filteredJobs = showInactive ? jobs : jobs.filter((job) => job.isActive);

  if (filteredJobs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center border border-gray-200">
        <p className="text-gray-500">ยังไม่มีตำแหน่งงาน</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className={`bg-white rounded-lg shadow p-6 border transition-all ${
              job.isActive 
                ? "border-gray-200 hover:shadow-md" 
                : "border-yellow-200 bg-yellow-50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {job.title}
                      </h3>
                      {!job.isActive && (
                        <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded">
                          ปิดแล้ว
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600">
                      {job.department && (
                        <div className="flex items-center gap-1">
                          <Briefcase size={16} />
                          {job.department}
                        </div>
                      )}
                      {job.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          {job.location}
                        </div>
                      )}
                      {job.salary && (
                        <div className="flex items-center gap-1">
                          <DollarSign size={16} />
                          {job.salary}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {getEmploymentTypeLabel(job.employmentType)}
                      </span>
                    </div>

                    {job.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {job.description}
                      </p>
                    )}

                    <p className="text-xs text-gray-400">
                      โพสต์โดย: {job.postedByUser?.fullName || job.postedByUser?.username || "ไม่ระบุ"} •{" "}
                      {new Date(job.createdAt).toLocaleDateString("th-TH")}
                      {job.killedAt && (
                        <>
                          {" "}• ปิดเมื่อ: {new Date(job.killedAt).toLocaleDateString("th-TH")}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {(userRole === "HR" || userRole === "ADMIN") && (
                <div className="flex items-center gap-2 ml-4">
                  {job.isActive ? (
                    <>
                      <button
                        onClick={() => handleEdit(job)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        title="แก้ไข"
                        disabled={loadingJobId === job.id}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleKillJob(job.id)}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50"
                        title="ปิดประกาศงาน"
                        disabled={loadingJobId === job.id}
                      >
                        <Power size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="ลบถาวร"
                        disabled={loadingJobId === job.id}
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleRestoreJob(job.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                        title="เปิดประกาศงานอีกครั้ง"
                        disabled={loadingJobId === job.id}
                      >
                        <RotateCcw size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="ลบถาวร"
                        disabled={loadingJobId === job.id}
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedJob && (
        <EditJobModal
          job={selectedJob}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedJob(null);
          }}
        />
      )}
    </>
  );
}
