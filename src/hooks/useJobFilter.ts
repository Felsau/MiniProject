"use client";

import { useState, useCallback } from "react";
import type { JobFilterCriteria } from "@/lib/services/jobService";
import type { JobWithCount } from "@/types";

/**
 * Hook for managing job filters
 */
export function useJobFilter() {
  const [filters, setFilters] = useState<JobFilterCriteria>({
    searchKeyword: "",
    department: "",
    location: "",
    employmentType: "",
    salaryMin: undefined,
    salaryMax: undefined,
    isActive: true,
  });

  const updateFilter = useCallback((field: keyof JobFilterCriteria, value: string | number | boolean | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const updateMultipleFilters = useCallback((newFilters: Partial<JobFilterCriteria>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      searchKeyword: "",
      department: "",
      location: "",
      employmentType: "",
      salaryMin: undefined,
      salaryMax: undefined,
      isActive: true,
    });
  }, []);

  const hasActiveFilters = useCallback(() => {
    return (
      filters.searchKeyword ||
      filters.department ||
      filters.location ||
      filters.employmentType ||
      filters.salaryMin !== undefined ||
      filters.salaryMax !== undefined ||
      filters.isActive === false
    );
  }, [filters]);

  return {
    filters,
    updateFilter,
    updateMultipleFilters,
    resetFilters,
    hasActiveFilters,
  };
}

/**
 * Hook for fetching filtered jobs with pagination
 */
export function useFilteredJobs() {
  const [jobs, setJobs] = useState<JobWithCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchJobs = useCallback(async (filters: JobFilterCriteria, page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();

      if (filters.searchKeyword) queryParams.append("search", filters.searchKeyword);
      if (filters.department) queryParams.append("department", filters.department);
      if (filters.location) queryParams.append("location", filters.location);
      if (filters.employmentType) queryParams.append("employmentType", filters.employmentType);
      if (filters.salaryMin !== undefined) queryParams.append("salaryMin", filters.salaryMin.toString());
      if (filters.salaryMax !== undefined) queryParams.append("salaryMax", filters.salaryMax.toString());
      if (filters.isActive !== undefined) queryParams.append("isActive", filters.isActive.toString());

      queryParams.append("page", page.toString());
      queryParams.append("limit", "6");

      const response = await fetch(`/api/job?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error("ไม่สามารถดึงข้อมูลงานได้");
      }

      const data = await response.json();
      setJobs(data.jobs);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (err) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    jobs,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    fetchJobs,
  };
}
