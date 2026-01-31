import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import SessionProvider from "@/components/SessionProvider";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ระบบจัดหางานภายในองค์กร | Internal Job Portal",
  description: "ระบบจัดการและสรรหาบุคลากรภายในองค์กร - Internal Recruitment Management System",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;
  const showSidebar = session && (userRole === "HR" || userRole === "ADMIN");

  return (
    <html lang="th">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          min-h-screen
          bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50
          text-slate-900
        `}
      >
        <SessionProvider session={session}>
          {showSidebar ? (
            <>
              <Sidebar />
              <main className="ml-72 min-h-screen">
                {children}
              </main>
            </>
          ) : (
            children
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
