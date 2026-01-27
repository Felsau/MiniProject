"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "หน้าหลัก", href: "/" },
    { name: "ระบบรับสมัครงาน", href: "/about" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 px-4 py-6">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-sky-600">
          HR Management
        </h1>
        <p className="text-sm text-slate-500">
          ระบบรับสมัครงาน
        </p>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-2
                px-4 py-2 rounded-xl text-sm font-medium
                transition-all
                ${
                  isActive
                    ? "bg-sky-100 text-sky-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                }
              `}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
