"use client";

import { useState } from "react";
import type { JobFilterCriteria } from "@/lib/services/jobService";
import { useJobFilter } from "@/hooks/useJobFilter";

interface FilterOptions {
  departments: string[];
  locations: string[];
  employmentTypes: { value: string; label: string }[];
}

interface JobFilterComponentProps {
  onFilterChange: (filters: JobFilterCriteria) => void;
  options: FilterOptions;
}

/**
 * Job Filter Component
 */
export function JobFilterComponent({ onFilterChange, options }: JobFilterComponentProps) {
  const { filters, updateFilter, resetFilters } = useJobFilter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = (keyword: string) => {
    updateFilter("searchKeyword", keyword);
    onFilterChange({ ...filters, searchKeyword: keyword });
  };

  const handleFilterChange = (field: keyof JobFilterCriteria, value: string | number | boolean | undefined) => {
    updateFilter(field, value);
    onFilterChange({ ...filters, [field]: value });
  };

  const handleReset = () => {
    resetFilters();
    onFilterChange({
      searchKeyword: "",
      department: "",
      location: "",
      employmentType: "",
      salaryMin: undefined,
      salaryMax: undefined,
      isActive: true,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="ค้นหาชื่องาน, รายละเอียด, หรือคุณสมบัติ..."
          value={filters.searchKeyword || ""}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        />
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-10 w-10 flex items-center justify-center border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-800 transition-colors"
          aria-label={isExpanded ? "ปิดตัวกรอง" : "เปิดตัวกรอง"}
          title={isExpanded ? "ปิดตัวกรอง" : "เปิดตัวกรอง"}
        >
          <span className="text-base">{isExpanded ? "✕" : "⚙"}</span>
        </button>
      </div>

      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                แผนก
              </label>
              <select
                value={filters.department || ""}
                onChange={(e) => handleFilterChange("department", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="">ทั้งหมด</option>
                {options.departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สถานที่
              </label>
              <select
                value={filters.location || ""}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="">ทั้งหมด</option>
                {options.locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ประเภทงาน
              </label>
              <select
                value={filters.employmentType || ""}
                onChange={(e) => handleFilterChange("employmentType", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="">ทั้งหมด</option>
                {options.employmentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ช่วงเงินเดือน (฿)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="number"
                  placeholder="ต่ำสุด"
                  value={filters.salaryMin || ""}
                  onChange={(e) =>
                    handleFilterChange("salaryMin", e.target.value ? parseInt(e.target.value) : undefined)
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="สูงสุด"
                  value={filters.salaryMax || ""}
                  onChange={(e) =>
                    handleFilterChange("salaryMax", e.target.value ? parseInt(e.target.value) : undefined)
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium text-sm"
            >
              ล้างตัวกรอง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
