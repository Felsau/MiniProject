"use client"; // สำหรับใช้ useState ใน Next.js

import React, { useState } from 'react';
import { Users, Briefcase, Calendar, Clock, Search, Filter, MoreHorizontal, ChevronRight } from 'lucide-react';

const HRDashboardUpdated = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // สมมติข้อมูลผู้สมัคร (ในอนาคตดึงมาจาก Prisma)
  const [applicants, setApplicants] = useState([
    { id: 1, name: 'สมชาย รักดี', role: 'Frontend Developer', fullDate: '27 ม.ค. 2026 เวลา 10:42', relativeDate: '2 ชม.ที่แล้ว', status: 'รอการตรวจสอบ' },
    { id: 2, name: 'วิภาดา สายงาน', role: 'HR Manager', fullDate: '27 ม.ค. 2026 เวลา 08:15', relativeDate: '5 ชม.ที่แล้ว', status: 'นัดสัมภาษณ์' },
    { id: 3, name: 'ธนพล มุ่งมั่น', role: 'UI/UX Designer', fullDate: '26 ม.ค. 2026 เวลา 14:20', relativeDate: 'วานนี้', status: 'ผ่านเกณฑ์เริ่มต้น' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'รอการตรวจสอบ': return 'text-yellow-600 bg-yellow-100';
      case 'นัดสัมภาษณ์': return 'text-blue-600 bg-blue-100';
      case 'ผ่านเกณฑ์เริ่มต้น': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* --- ส่วน Header & Stats --- */}
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">ระบบบริหารจัดการผู้สมัคร</h1>
          <p className="text-gray-500 text-sm">ภาพรวมการสรรหาบุคลากรประจำวัน</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Conversion Rate (สมัคร ➔ สัมภาษณ์)</p>
          <p className="text-lg font-bold text-green-600">64% ↑</p>
        </div>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* ... (Stat Cards เหมือนเดิม แต่เพิ่มขนาดตัวเลขให้เด่น) ... */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase">ใบสมัครใหม่</p>
              <h3 className="text-2xl font-bold mt-1">45</h3>
            </div>
            <span className="p-2 bg-purple-50 rounded-lg text-purple-600"><Users size={20}/></span>
          </div>
        </div>
        {/* เพิ่ม Card อื่นๆ ได้ที่นี่ */}
      </div>

      {/* --- ส่วน Filter & Search (แนะนำมาก) --- */}
      <div className="bg-white p-4 rounded-t-xl border border-gray-100 border-b-0 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1">
          {/* Search Input */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อหรือตำแหน่ง..." 
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Filter Dropdown */}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Filter size={16}/> กรองข้อมูล
          </button>
        </div>
        
        <button className="flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm transition-all group">
          ดูผู้สมัครทั้งหมด <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/>
        </button>
      </div>

      {/* --- ส่วน Table --- */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">ผู้สมัคร</th>
              <th className="px-6 py-4 font-semibold">ตำแหน่งงาน</th>
              <th className="px-6 py-4 font-semibold text-center">วันที่สมัคร</th>
              <th className="px-6 py-4 font-semibold">สถานะปัจจุบัน</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {applicants.filter(a => a.name.includes(searchTerm)).map((item) => (
              <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-800">{item.name}</div>
                  <div className="text-xs text-gray-400 underline cursor-help" title={item.fullDate}>
                    ID: #{item.id + 1000}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.role}</td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-gray-500 cursor-default" title={item.fullDate}>
                    {item.relativeDate}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {/* Dropdown เปลี่ยนสถานะแบบง่าย */}
                  <select 
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border-none focus:ring-2 focus:ring-blue-300 cursor-pointer ${getStatusColor(item.status)}`}
                    defaultValue={item.status}
                  >
                    <option>รอการตรวจสอบ</option>
                    <option>นัดสัมภาษณ์</option>
                    <option>ผ่านเกณฑ์เริ่มต้น</option>
                    <option>ปฏิเสธ</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1 hover:bg-gray-100 rounded-full text-gray-400 group-hover:text-gray-600">
                    <MoreHorizontal size={20}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HRDashboardUpdated;