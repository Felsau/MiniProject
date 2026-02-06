"use client";

import { Bookmark } from "lucide-react";
import Link from "next/link";

export default function BookmarksPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">งานที่เล็งไว้</h1>
          <p className="text-gray-600">รายการงานที่คุณบันทึกไว้</p>
        </div>

        {/* Bookmarked Jobs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Empty State */}
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-500 text-lg font-medium">ยังไม่มีงานที่บันทึกไว้</p>
            <p className="text-gray-400 text-sm mt-1">คลิกที่ปุ่มบันทึกในหน้าค้นหางานเพื่อเก็บงานที่สนใจไว้</p>
            <Link href="/jobs" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              ไปค้นหางาน
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
