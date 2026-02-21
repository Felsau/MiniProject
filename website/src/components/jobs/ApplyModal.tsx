"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";

interface ApplyModalProps {
  jobId: string;
  jobTitle: string;
  onClose: () => void;
}

export function ApplyModal({ jobId, jobTitle, onClose }: ApplyModalProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("❌ รองรับเฉพาะไฟล์ PDF เท่านั้น");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("❌ ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)");
      e.target.value = "";
      return;
    }

    setResumeFile(file);
  }, []);

  const handleSubmit = async () => {
    setUploadProgress(true);

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
      if (!res.ok) throw new Error(data.error || "สมัครไม่สำเร็จ");

      alert(`🎉 สมัครงาน "${jobTitle}" สำเร็จเรียบร้อย!`);
      onClose();
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "สมัครไม่สำเร็จ";
      alert("❌ " + message);
    } finally {
      setUploadProgress(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">สมัครงาน</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-1">ตำแหน่งที่สมัคร:</p>
          <p className="text-lg font-bold text-gray-900 mb-6">{jobTitle}</p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              แนบ Resume / CV (PDF)
              <span className="text-gray-400 font-normal ml-1">— ไม่บังคับ</span>
            </label>

            {!resumeFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
              >
                <Upload className="mx-auto mb-3 text-gray-400 group-hover:text-blue-500 transition" size={36} />
                <p className="text-gray-600 text-sm font-medium">คลิกเพื่อเลือกไฟล์ PDF</p>
                <p className="text-gray-400 text-xs mt-1">ขนาดไม่เกิน 5MB</p>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                <FileText className="text-green-600 shrink-0" size={24} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-800 truncate">{resumeFile.name}</p>
                  <p className="text-xs text-green-600">
                    {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setResumeFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-green-500 hover:text-red-500 transition"
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
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            disabled={uploadProgress}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploadProgress}
            className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {uploadProgress ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                กำลังส่ง...
              </>
            ) : (
              "ยืนยันสมัครงาน"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
