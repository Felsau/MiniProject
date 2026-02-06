// src/components/ui/Pagination.tsx
'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  // ถ้ามีหน้าเดียว ไม่ต้องแสดง
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {/* ปุ่มย้อนกลับ */}
      <button
        disabled={currentPage <= 1}
        onClick={() => createPageURL(currentPage - 1)}
        className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      {/* เลขหน้า (แสดงแบบง่าย: 1 2 3 ... หรือแสดงทั้งหมดถ้าไม่เยอะ) */}
      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        // Logic ซ่อนเลขหน้าถ้ายาวเกินไป (Optional) สามารถเพิ่มได้
        return (
          <button
            key={page}
            onClick={() => createPageURL(page)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-blue-600 text-white shadow-md' // Active state (สีน้ำเงินตามรูป)
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* ปุ่มถัดไป */}
      <button
        disabled={currentPage >= totalPages}
        onClick={() => createPageURL(currentPage + 1)}
        className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}