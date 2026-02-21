"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log error to monitoring service if needed
    // console.error(error);
  }, [error]);

  return (
    <html lang="th">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#ef4444', marginBottom: '1rem' }}>เกิดข้อผิดพลาด</h1>
        <p style={{ fontSize: '1.2rem', color: '#334155' }}>{error.message || "ขออภัย เกิดข้อผิดพลาดบางอย่าง"}</p>
        <button onClick={reset} style={{ marginTop: '2rem', color: '#6366f1', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
          ลองใหม่อีกครั้ง
        </button>
      </body>
    </html>
  );
}
