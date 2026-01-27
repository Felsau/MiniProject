"use client";

import { useEffect, useState } from "react";
import JobGrid from "@/components/jobs/JobGrid";
import CreateJobModal from "@/components/jobs/CreateJobModal";
import {
  getJobsAction,
  createJobAction,
  getDepartmentsAction,
} from "@/actions/jobActions";
import { Job } from "@/components/jobs/types";

export default function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [departments, setDepartments] = useState<
    { dept_id: number; dept_name: string }[]
  >([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [jobTitle, setJobTitle] = useState("");
  const [departmentId, setDepartmentId] = useState<number>(0);
  const [jobLevel, setJobLevel] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [specialConditions, setSpecialConditions] = useState("");
  const [hiringCount, setHiringCount] = useState("1");
  const [employmentType, setEmploymentType] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [closeDate, setCloseDate] = useState("");

  const fetchData = async () => {
    const [jobsData, deptData] = await Promise.all([
      getJobsAction(),
      getDepartmentsAction(),
    ]);
    setJobs(jobsData as Job[]);
    setDepartments(deptData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateJob = async () => {
    if (!departmentId) return alert("กรุณาเลือกแผนก");

    await createJobAction({
      job_title: jobTitle,
      department_id: departmentId,
      job_level: jobLevel,
      work_location: location,
      job_description: description,
      responsibilities,
      qualifications,
      special_conditions: specialConditions,
      hiring_count: Number(hiringCount),
      employment_type: employmentType,
      salary_min: Number(salaryMin),
      salary_max: Number(salaryMax),
      close_date: closeDate,
    });

    setJobTitle("");
    setDepartmentId(0);
    setJobLevel("");
    setLocation("");
    setDescription("");
    setResponsibilities("");
    setQualifications("");
    setSpecialConditions("");
    setHiringCount("1");
    setEmploymentType("");
    setSalaryMin("");
    setSalaryMax("");
    setCloseDate("");
    setIsModalOpen(false);

    fetchData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          ระบบรับสมัครงาน
        </h1>
        <p className="text-slate-600 mt-1">
          จัดการตำแหน่งงานและข้อมูลการรับสมัคร
        </p>
      </div>

      {/* Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="
          mb-6 
          rounded-lg 
          bg-blue-600 
          px-6 
          py-2.5 
          text-white 
          font-medium
          shadow-md
          hover:bg-blue-700
          transition
        "
      >
        + เพิ่มตำแหน่งงาน
      </button>

      {/* Job list */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <JobGrid jobs={jobs} />
      </div>

      {/* Modal */}
      <CreateJobModal
        isOpen={isModalOpen}
        jobTitle={jobTitle}
        department={departmentId}
        jobLevel={jobLevel}
        location={location}
        description={description}
        responsibilities={responsibilities}
        qualifications={qualifications}
        specialConditions={specialConditions}
        hiringCount={hiringCount}
        employmentType={employmentType}
        salaryMin={salaryMin}
        salaryMax={salaryMax}
        closeDate={closeDate}
        departments={departments}
        onChangeTitle={setJobTitle}
        onChangeDepartment={setDepartmentId}
        onChangeLevel={setJobLevel}
        onChangeLocation={setLocation}
        onChangeDescription={setDescription}
        onChangeResponsibilities={setResponsibilities}
        onChangeQualifications={setQualifications}
        onChangeSpecialConditions={setSpecialConditions}
        onChangeHiringCount={setHiringCount}
        onChangeEmploymentType={setEmploymentType}
        onChangeSalaryMin={setSalaryMin}
        onChangeSalaryMax={setSalaryMax}
        onChangeCloseDate={setCloseDate}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateJob}
      />
    </div>
  );
}
