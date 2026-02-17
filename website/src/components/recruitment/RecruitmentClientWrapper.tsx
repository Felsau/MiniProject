"use client";

import { useBookmark } from "@/hooks/useBookmark";
import JobList from "@/components/recruitment/JobList";
import { JobWithCount } from "@/types";

interface RecruitmentClientWrapperProps {
  jobs: JobWithCount[];
  userRole?: string;
}

export default function RecruitmentClientWrapper({ jobs, userRole }: RecruitmentClientWrapperProps) {
  const { bookmarkedJobIds, handleBookmark, handleUnbookmark, loading } = useBookmark();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <JobList 
      jobs={jobs} 
      userRole={userRole}
      bookmarkedJobIds={bookmarkedJobIds}
      onBookmark={handleBookmark}
      onUnbookmark={handleUnbookmark}
    />
  );
}
