"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Users, LayoutDashboard, LogOut, Briefcase, Building2 } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      description: "ภาพรวมระบบ"
    },
    {
      name: "จัดการตำแหน่งงาน",
      icon: Briefcase,
      href: "/recruitment",
      description: "ระบบสรรหา"
    },
    {
      name: "โปรไฟล์",
      icon: Home,
      href: "/profile",
      description: "ข้อมูลส่วนตัว"
    },
  ];

  return (
    <div className="w-72 min-h-screen bg-white shadow-2xl flex flex-col relative">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 opacity-10"></div>
      
      {/* Header with Logo */}
      <div className="relative p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Internal Jobs
            </h1>
            <p className="text-xs text-gray-500 font-medium">ระบบจัดหางานภายใน</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    group flex items-start gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md"
                    }
                  `}
                >
                  <Icon size={22} className={isActive ? "text-white" : "text-gray-400 group-hover:text-blue-600"} />
                  <div className="flex-1">
                    <div className={isActive ? "font-semibold" : ""}>{item.name}</div>
                    <div className={`text-xs mt-0.5 ${isActive ? "text-blue-100" : "text-gray-400"}`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-100 bg-gradient-to-b from-transparent to-gray-50">
        {/* User Info Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-3 border border-blue-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {session?.user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">
                {session?.user?.name || "admin"}
              </p>
              <p className="text-xs font-semibold text-blue-600 uppercase">
                {(session?.user as { role?: string })?.role || "ADMIN"}
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 hover:text-white hover:bg-red-600 rounded-xl transition-all duration-200 border-2 border-red-200 hover:border-red-600"
        >
          <LogOut size={18} />
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
}
