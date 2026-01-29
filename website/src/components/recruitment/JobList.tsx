"use client";

import { useState } from "react";
import { MapPin, Briefcase, Trash2, Edit2, DollarSign } from "lucide-react";
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
  postedByUser: {
    fullName: string | null;
    username: string;
  } | null;
}

interface JobListProps {
  jobs: Job[];
  userRole?: string;
}

export default function JobList({ jobs, userRole }: JobListProps) {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async (jobId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบงานนี้?")) return;

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

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center border border-gray-200">
        <p className="text-gray-500">ยังไม่มีตำแหน่งงาน</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {job.title}
                    </h3>

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
                    </p>
                  </div>
                </div>
              </div>

              {(userRole === "HR" || userRole === "ADMIN") && (
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(job)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="แก้ไข"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="ลบ"
                  >
                    <Trash2 size={18} />
                  </button>
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
