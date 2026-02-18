"use client";

import { useEffect, useState } from "react";

interface UseBookmarkReturn {
  bookmarkedJobIds: string[];
  loading: boolean;
  handleBookmark: (jobId: string) => Promise<void>;
  handleUnbookmark: (jobId: string) => Promise<void>;
  refreshBookmarks: () => Promise<void>;
}

export function useBookmark(): UseBookmarkReturn {
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const res = await fetch("/api/bookmark");
      if (res.ok) {
        const data = await res.json();
        const jobIds = data.map((item: { jobId: string }) => item.jobId);
        setBookmarkedJobIds(jobIds);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (jobId: string) => {
    try {
      const res = await fetch("/api/bookmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId }),
      });

      if (res.ok) {
        setBookmarkedJobIds((prev) => [...prev, jobId]);
      }
    } catch (error) {
      console.error("Error bookmarking job:", error);
    }
  };

  const handleUnbookmark = async (jobId: string) => {
    try {
      const res = await fetch("/api/bookmark", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId }),
      });

      if (res.ok) {
        setBookmarkedJobIds((prev) => prev.filter((id) => id !== jobId));
      }
    } catch (error) {
      console.error("Error unbookmarking job:", error);
    }
  };

  const refreshBookmarks = async () => {
    setLoading(true);
    await fetchBookmarks();
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return {
    bookmarkedJobIds,
    loading,
    handleBookmark,
    handleUnbookmark,
    refreshBookmarks,
  };
}
