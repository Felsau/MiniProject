"use client";

import React from "react";
import { JobFormData } from "@/hooks/useJobForm";

interface JobFormFieldsProps {
  formData: JobFormData;
  onFieldChange: (field: keyof JobFormData, value: string) => void;
}

/**
 * Reusable job form fields component
 */
export function JobFormFields({ formData, onFieldChange }: JobFormFieldsProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ชื่อตำแหน่ง <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => onFieldChange("title", e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="เช่น Senior Developer"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            แผนก
          </label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => onFieldChange("department", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="เช่น IT"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            สถานที่
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => onFieldChange("location", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="เช่น กรุงเทพ"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            เงินเดือน
          </label>
          <input
            type="text"
            value={formData.salary}
            onChange={(e) => onFieldChange("salary", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="เช่น 30,000 - 50,000 บาท"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ประเภทงาน
          </label>
          <select
            value={formData.employmentType}
            onChange={(e) => onFieldChange("employmentType", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="FULL_TIME">เต็มเวลา</option>
            <option value="PART_TIME">พาร์ทไทม์</option>
            <option value="CONTRACT">สัญญาจ้าง</option>
            <option value="INTERNSHIP">ฝึกงาน</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          รายละเอียดงาน
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onFieldChange("description", e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="อธิบายรายละเอียดงาน..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          คุณสมบัติผู้สมัคร
        </label>
        <textarea
          value={formData.requirements}
          onChange={(e) => onFieldChange("requirements", e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="ระบุคุณสมบัติที่ต้องการ..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          หน้าที่ความรับผิดชอบ
        </label>
        <textarea
          value={formData.responsibilities}
          onChange={(e) => onFieldChange("responsibilities", e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="ระบุหน้าที่ความรับผิดชอบ..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          สวัสดิการ
        </label>
        <textarea
          value={formData.benefits}
          onChange={(e) => onFieldChange("benefits", e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="ระบุสวัสดิการ..."
        />
      </div>
    </>
  );
}
