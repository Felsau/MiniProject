"use client";

import { useState } from "react";
import { Job } from "./types";

type Props = {
  jobs: Job[];
};

export default function JobGrid({ jobs }: Props) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const BOX_SIZE = 120;
  const GAP = 16;
  const STEP = BOX_SIZE + GAP;
  const CONTAINER_WIDTH = 600;
  const CONTAINER_HEIGHT = 300;
  const COLUMNS = Math.floor(CONTAINER_WIDTH / STEP);

  return (
    <>
      {/* Grid */}
      <div
        className="relative overflow-y-auto border border-dashed border-zinc-400"
        style={{ width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT }}
      >
        <div
          className="relative"
          style={{
            height: Math.ceil(jobs.length / COLUMNS) * STEP,
          }}
        >
          {jobs.map((job, index) => {
            const col = index % COLUMNS;
            const row = Math.floor(index / COLUMNS);

            return (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="absolute h-[120px] w-[120px] rounded-md
                           bg-blue-600 text-white cursor-pointer
                           transition-transform duration-300 hover:scale-105
                           flex flex-col items-center justify-center
                           text-center px-2"
                style={{
                  transform: `translate(${col * STEP}px, ${row * STEP}px)`,
                }}
              >
                <div className="text-sm font-bold">{job.title}</div>
                <div className="mt-1 text-xs text-blue-100">
                  {job.salary}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[350px] shadow-lg">
            <h2 className="text-lg font-bold mb-2">
              {selectedJob.title}
            </h2>

            <p className="text-sm text-gray-600 mb-2">
              💰 เงินเดือน: {selectedJob.salary}
            </p>

            {/* เพิ่ม field อื่นได้ */}
            <p className="text-sm text-gray-700">
              รายละเอียดงานสามารถใส่ตรงนี้ได้
            </p>

            <button
              onClick={() => setSelectedJob(null)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </>
  );
}
