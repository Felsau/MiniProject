import { LayoutDashboard, Briefcase, Search, FileText, Bookmark, User, ClipboardList } from "lucide-react";

export interface MenuItem {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
  description: string;
}

export function getSidebarMenuItems(userRole: string): MenuItem[] {
  if (userRole === "USER") {
    return [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        description: "ภาพรวมของคุณ",
      },
      {
        name: "ค้นหางาน",
        icon: Search,
        href: "/jobs",
        description: "ค้นหาตำแหน่งงาน",
      },
      {
        name: "งานที่สมัครไปแล้ว",
        icon: FileText,
        href: "/applications",
        description: "ติดตามสถานะ",
      },
      {
        name: "งานที่เล็งไว้",
        icon: Bookmark,
        href: "/bookmarks",
        description: "งานที่บันทึกไว้",
      },
      {
        name: "โปรไฟล์",
        icon: User,
        href: "/profile",
        description: "จัดการโปรไฟล์",
      },
    ];
  }

  return [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      description: "ภาพรวมระบบ",
    },
    {
      name: "จัดการตำแหน่งงาน",
      icon: Briefcase,
      href: "/recruitment",
      description: "ระบบสรรหา",
    },
    {
      name: "จัดการใบสมัคร",
      icon: ClipboardList,
      href: "/applications",
      description: "ตรวจสอบผู้สมัคร",
    },
    {
      name: "โปรไฟล์",
      icon: User,
      href: "/profile",
      description: "ข้อมูลส่วนตัว",
    },
  ];
}
