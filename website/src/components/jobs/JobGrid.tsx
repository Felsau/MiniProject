"use client";

import { useState } from "react";
import { Job } from "./types";

type Props = {
  jobs: Job[];
};

export default function JobGrid({ jobs }: Props) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <>
      {/* GRID LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <div
            key={job.job_id}
            onClick={() => setSelectedJob(job)}
            className="
              cursor-pointer rounded-xl p-4
              bg-white border border-slate-200
              hover:shadow-lg hover:border-sky-300
              transition
            "
          >
            <h3 className="font-semibold text-sky-600 text-lg">
              {job.job_title}
            </h3>
            <p className="text-sm text-slate-600">
              {job.departments?.dept_name || "ไม่ระบุแผนก"}
            </p>
            <p className="text-xs text-slate-500">
              {job.work_location}
            </p>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-[#F8FAFF] p-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-sky-600 mb-4">
              {selectedJob.job_title}
            </h2>

            <div className="grid grid-cols-2 gap-3 text-sm text-slate-700 mb-4">
              <p><span className="font-medium">แผนก:</span> {selectedJob.departments?.dept_name || "-"}</p>
              <p><span className="font-medium">ระดับ:</span> {selectedJob.job_level || "-"}</p>
              <p><span className="font-medium">สถานที่:</span> {selectedJob.work_location || "-"}</p>
              <p><span className="font-medium">ประเภท:</span> {selectedJob.employment_type || "-"}</p>
              <p><span className="font-medium">จำนวนรับ:</span> {selectedJob.hiring_count || 1}</p>
              {selectedJob.salary_min && selectedJob.salary_max && (
                <p>
                  <span className="font-medium">เงินเดือน:</span>{" "}
                  {selectedJob.salary_min.toLocaleString()} –{" "}
                  {selectedJob.salary_max.toLocaleString()} บาท
                </p>
              )}
            </div>

            <section className="space-y-4 text-sm text-slate-700">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">
                  รายละเอียดงาน
                </h4>
                <p className="whitespace-pre-wrap">
                  {selectedJob.job_description}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-1">
                  หน้าที่ความรับผิดชอบ
                </h4>
                <p className="whitespace-pre-wrap">
                  {selectedJob.responsibilities}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-1">
                  คุณสมบัติ
                </h4>
                <p className="whitespace-pre-wrap">
                  {selectedJob.qualifications}
                </p>
              </div>

              {selectedJob.special_conditions && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">
                    เงื่อนไขพิเศษ
                  </h4>
                  <p className="whitespace-pre-wrap">
                    {selectedJob.special_conditions}
                  </p>
                </div>
              )}
            </section>

            {selectedJob.close_date && (
              <p className="mt-4 text-sm text-slate-600">
                <span className="font-medium">วันปิดรับสมัคร:</span>{" "}
                {new Date(selectedJob.close_date).toLocaleDateString("th-TH")}
              </p>
            )}

            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedJob(null)}
                className="
                  px-5 py-2 rounded-xl
                  bg-sky-500 text-white
                  hover:bg-sky-600
                  transition
                "
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
