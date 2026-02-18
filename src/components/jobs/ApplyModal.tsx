"use client";

import { useState, useRef, useCallback } from "react";
import { UploadCloud, FileText, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ApplyModalProps {
  jobId: string;
  jobTitle: string;
  onClose: () => void;
}

// ✅ ลบคำว่า default ออกแล้ว
export function ApplyModal({ jobId, jobTitle, onClose }: ApplyModalProps) {
  const router = useRouter();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ฟังก์ชันจัดการเมื่อเลือกไฟล์
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("กรุณาอัปโหลดไฟล์ PDF เท่านั้น");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("ขนาดไฟล์ต้องไม่เกิน 5MB");
      e.target.value = "";
      return;
    }

    setResumeFile(file);
  }, []);

  // ฟังก์ชันกดยืนยันสมัคร
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      let resumeUrl: string | null = null;

      if (resumeFile) {
        const formData = new FormData();
        formData.append("file", resumeFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(uploadData.error || "อัปโหลดไฟล์ไม่สำเร็จ");
        }

        resumeUrl = uploadData.url;
      }

      const res = await fetch("/api/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, resumeUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "สมัครงานไม่สำเร็จ");
      }

      alert(`🎉 สมัครงาน "${jobTitle}" สำเร็จเรียบร้อย!`);
      onClose();
      router.push("/applications");
      router.refresh();

    } catch (err: any) {
      console.error(err);
      setError(err.message || "เกิดข้อผิดพลาด โปรดลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg text-gray-900">ยืนยันการสมัครงาน</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">ตำแหน่งงาน</p>
            <h4 className="text-xl font-bold text-blue-600">{jobTitle}</h4>
          </div>

          {/* Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              แนบเรซูเม่ / CV (PDF) <span className="text-gray-400 font-normal text-xs ml-1">(ไม่บังคับ)</span>
            </label>

            {!resumeFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 hover:border-blue-400 transition cursor-pointer group"
              >
                <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-blue-500 transition">
                  <UploadCloud size={32} />
                  <span className="text-sm font-medium">คลิกเพื่อเลือกไฟล์ PDF</span>
                  <span className="text-xs text-gray-400">ขนาดไม่เกิน 5MB</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-100 p-3 rounded-xl">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="bg-white p-2 rounded-lg text-red-500 shadow-sm">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-blue-900 truncate">{resumeFile.name}</p>
                    <p className="text-xs text-blue-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setResumeFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-gray-400 hover:text-red-500 transition p-1"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {error && (
              <div className="flex items-center gap-2 mt-3 text-red-600 text-sm bg-red-50 p-2 rounded-lg border border-red-100">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> กำลังส่ง...
                </>
              ) : (
                <>
                  <CheckCircle size={18} /> ยืนยันสมัคร
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}