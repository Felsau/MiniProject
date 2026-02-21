"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/login") {
    return <>{children}</>;
  }

  const userRole = (session?.user as { role?: string })?.role;
  const showSidebar = status !== "loading" && session && (userRole === "HR" || userRole === "ADMIN" || userRole === "USER");

  return (
    <main className={showSidebar ? "ml-72 min-h-screen" : "min-h-screen"}>
      {children}
    </main>
  );
}
