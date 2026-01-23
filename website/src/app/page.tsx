import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="text-center px-6">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Welcome to My Website
        </h1>

        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          นี่คือหน้าหลักอย่างง่าย เริ่มแก้ไขได้ที่ <code>page.tsx</code>
        </p>

        <div className="mt-8">
          <Link
            href="/about"
            className="inline-block rounded-full bg-black px-6 py-3 text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            ไปหน้า About
          </Link>
        </div>
      </main>
    </div>
  );
}
