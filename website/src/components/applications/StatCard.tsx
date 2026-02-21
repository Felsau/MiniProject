"use client";

import React from "react";

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export function StatCard({ title, count, icon, active, onClick }: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-xl p-4 md:p-6 shadow-sm border-2 text-left transition-all hover:shadow-md w-full ${
        active ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 text-xs md:text-sm font-medium">{title}</span>
        {icon}
      </div>
      <p className="text-2xl md:text-3xl font-bold text-gray-900">{count}</p>
    </button>
  );
}
