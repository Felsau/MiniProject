"use client";

type Department = {
  dept_id: number;
  dept_name: string;
};

type Props = {
  isOpen: boolean;
  jobTitle: string;
  department: number;
  jobLevel: string;
  location: string;
  description: string;
  responsibilities: string;
  qualifications: string;
  specialConditions: string;
  hiringCount: string;
  employmentType: string;
  salaryMin: string;
  salaryMax: string;
  closeDate: string;
  departments: Department[];

  onChangeTitle: (v: string) => void;
  onChangeDepartment: (v: number) => void;
  onChangeLevel: (v: string) => void;
  onChangeLocation: (v: string) => void;
  onChangeDescription: (v: string) => void;
  onChangeResponsibilities: (v: string) => void;
  onChangeQualifications: (v: string) => void;
  onChangeSpecialConditions: (v: string) => void;
  onChangeHiringCount: (v: string) => void;
  onChangeEmploymentType: (v: string) => void;
  onChangeSalaryMin: (v: string) => void;
  onChangeSalaryMax: (v: string) => void;
  onChangeCloseDate: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

const baseInput =
  "w-full rounded-xl border border-slate-300 bg-white " +
  "px-3 py-2 text-sm text-slate-800 " +
  "placeholder:text-slate-400 " +
  "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 " +
  "transition";

const InputField = ({ label, value, onChange, type = "text" }: any) => (
  <div>
    <label className="text-sm font-medium text-slate-700 mb-1 block">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={baseInput}
    />
  </div>
);

const TextareaField = ({ label, value, onChange, rows = 3 }: any) => (
  <div>
    <label className="text-sm font-medium text-slate-700 mb-1 block">
      {label}
    </label>
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={baseInput}
    />
  </div>
);

export default function CreateJobModal(props: Props) {
  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 z-50">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.onSubmit();
        }}
        className="bg-[#F8FAFF] w-full max-w-2xl rounded-2xl p-6 shadow-xl"
      >
        <h2 className="text-xl font-semibold text-sky-600 mb-5">
          ➕ เพิ่มตำแหน่งงาน
        </h2>

        <InputField
          label="ชื่อตำแหน่ง"
          value={props.jobTitle}
          onChange={props.onChangeTitle}
        />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              แผนก
            </label>
            <select
              value={props.department}
              onChange={(e) =>
                props.onChangeDepartment(Number(e.target.value))
              }
              className={baseInput}
            >
              <option value={0}>-- เลือกแผนก --</option>
              {props.departments.map((d) => (
                <option key={d.dept_id} value={d.dept_id}>
                  {d.dept_name}
                </option>
              ))}
            </select>
          </div>

          <InputField
            label="ระดับงาน"
            value={props.jobLevel}
            onChange={props.onChangeLevel}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <InputField
            label="สถานที่ทำงาน"
            value={props.location}
            onChange={props.onChangeLocation}
          />

          <div>
            <label className="text-sm font-medium text-slate-700">
              ประเภทการจ้างงาน
            </label>
            <select
              value={props.employmentType}
              onChange={(e) =>
                props.onChangeEmploymentType(e.target.value)
              }
              className={baseInput}
            >
              <option value="">-- เลือก --</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <InputField
            label="จำนวนรับ"
            value={props.hiringCount}
            onChange={props.onChangeHiringCount}
            type="number"
          />
          <InputField
            label="เงินเดือนต่ำสุด"
            value={props.salaryMin}
            onChange={props.onChangeSalaryMin}
            type="number"
          />
          <InputField
            label="เงินเดือนสูงสุด"
            value={props.salaryMax}
            onChange={props.onChangeSalaryMax}
            type="number"
          />
        </div>

        <div className="mt-4 space-y-3">
          <TextareaField
            label="รายละเอียดงาน"
            value={props.description}
            onChange={props.onChangeDescription}
          />
          <TextareaField
            label="หน้าที่รับผิดชอบ"
            value={props.responsibilities}
            onChange={props.onChangeResponsibilities}
          />
          <TextareaField
            label="คุณสมบัติ"
            value={props.qualifications}
            onChange={props.onChangeQualifications}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={props.onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 transition"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition"
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
}
