"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

interface Job {
  id: string;
  title: string;
  description: string | null;
  department: string | null;
  location: string | null;
  salary: string | null;
  employmentType: string;
  requirements: string | null;
  responsibilities: string | null;
  benefits: string | null;
}

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<Job>({
    id: "",
    title: "",
    description: "",
    department: "",
    location: "",
    salary: "",
    employmentType: "FULL_TIME",
    requirements: "",
    responsibilities: "",
    benefits: "",
  });

  useEffect(() => {
    if (jobId) {
      const fetchJob = async () => {
        try {
          const res = await fetch(`/api/job/${jobId}`);
          if (res.ok) {
            const data = await res.json();
            setFormData(data.job);
          } else {
            alert("ไม่สามารถโหลดข้อมูลงาน");
            router.back();
          }
        } catch (error) {
          console.error("Error fetching job:", error);
          alert("เกิดข้อผิดพลาด");
        } finally {
          setFetching(false);
        }
      };

      fetchJob();
    }
  }, [jobId, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/job/${jobId}`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("บันทึกการแก้ไขสำเร็จ");
        router.push("/recruitment");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "ไม่สามารถบันทึกการแก้ไขได้");
      }
    } catch (error) {
      console.error("Error saving job:", error);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 mb-8 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">กลับไป</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">แก้ไขตำแหน่งงาน</h1>
          <p className="text-gray-600 mt-2">อัปเดตข้อมูลตำแหน่งงานของคุณ</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-blue-100">
                📋 ข้อมูลทั่วไป
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ชื่อตำแหน่ง <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="เช่น Senior Frontend Developer"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    แผนก
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department || ""}
                    onChange={handleChange}
                    placeholder="เช่น IT / Engineering"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    สถานที่ทำงาน
                  </label>
                  <select
                    name="location"
                    value={formData.location || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">เลือกสถานที่</option>
                    <option value="Remote">Remote</option>
                    <option value="Bangkok">กรุงเทพ</option>
                    <option value="Chiang Mai">เชียงใหม่</option>
                    <option value="Phuket">ภูเก็ต</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    เงินเดือน
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary || ""}
                    onChange={handleChange}
                    placeholder="เช่น 50,000 - 80,000 บาท"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ประเภทสัญญา <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="FULL_TIME">เต็มเวลา</option>
                    <option value="PART_TIME">พาร์ทไทม์</option>
                    <option value="CONTRACT">สัญญาจ้าง</option>
                    <option value="INTERNSHIP">ฝึกงาน</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-blue-100">
                📝 รายละเอียดงาน
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  คำอธิบายตำแหน่ง
                </label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  rows={6}
                  placeholder="อธิบายรายละเอียดของตำแหน่งงาน..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  คุณสมบัติและความต้องการ
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements || ""}
                  onChange={handleChange}
                  rows={5}
                  placeholder="ระบุคุณสมบัติที่ต้องการ (หนึ่งข้อต่อหนึ่งบรรทัด)..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  หน้าที่ความรับผิดชอบ
                </label>
                <textarea
                  name="responsibilities"
                  value={formData.responsibilities || ""}
                  onChange={handleChange}
                  rows={5}
                  placeholder="ระบุหน้าที่ที่จะทำ (หนึ่งข้อต่อหนึ่งบรรทัด)..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  สวัสดิการและสิทธิประโยชน์
                </label>
                <textarea
                  name="benefits"
                  value={formData.benefits || ""}
                  onChange={handleChange}
                  rows={5}
                  placeholder="ระบุสวัสดิการที่บริษัทมี (หนึ่งข้อต่อหนึ่งบรรทัด)..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    บันทึกการแก้ไข
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}