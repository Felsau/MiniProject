import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
  title: "ระบบรับสมัครงาน",
  description: "ระบบจัดการตำแหน่งงานภายในองค์กร",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          min-h-screen
          bg-slate-100
          text-slate-800
        `}
      >
        {/* Layout Wrapper */}
        <div className="flex min-h-screen w-full">

          {/* Sidebar */}
          <aside className="w-64 min-h-screen bg-white border-r border-slate-200">
            <Sidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 p-8 overflow-y-auto">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}
