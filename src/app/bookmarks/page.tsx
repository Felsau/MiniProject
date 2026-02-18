"use client";

import { useEffect, useState, useCallback } from "react";
import { Bookmark, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { JobCard } from "@/components/recruitment/JobCard";
import type { JobWithCount } from "@/types";

interface SavedJob {
  id: string;
  createdAt: string;
  job: JobWithCount;
}

export default function BookmarksPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchSavedJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/bookmark");
      if (res.ok) {
        const data = await res.json();
        setSavedJobs(data);
      }
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  const handleRemoveBookmark = async (savedJobId: string, jobId: string) => {
    setRemovingId(savedJobId);
    try {
      const res = await fetch("/api/bookmark", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId }),
      });
      
      if (res.ok) {
        setSavedJobs((prev) => prev.filter((s) => s.id !== savedJobId));
      }
    } catch (error) {
      console.error("Error removing bookmark:", error);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">งานที่เล็งไว้</h1>
          <p className="text-gray-600">รายการงานที่คุณบันทึกไว้ ({savedJobs.length} รายการ)</p>
        </div>

        {savedJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-10 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bookmark className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-500 text-lg font-medium">ยังไม่มีงานที่บันทึกไว้</p>
              <p className="text-gray-400 text-sm mt-1">คลิกที่ปุ่มบันทึกในหน้าค้นหางานเพื่อเก็บงานที่สนใจไว้</p>
              <Link href="/jobs" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                ไปค้นหางาน
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map((saved) => (
              <div key={saved.id} className="relative">
                <JobCard
                  job={saved.job}
                  userRole="USER"
                />
                <button
                  onClick={() => handleRemoveBookmark(saved.id, saved.job?.id || '')}
                  disabled={removingId === saved.id}
                  className="absolute top-3 right-3 p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                  title="ลบออกจากรายการ"
                >
                  {removingId === saved.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
