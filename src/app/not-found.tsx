export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)' }}>
      <h1 style={{ fontSize: '3rem', color: '#6366f1', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.5rem', color: '#334155' }}>ไม่พบหน้าที่คุณต้องการ</p>
      <a href="/" style={{ marginTop: '2rem', color: '#6366f1', textDecoration: 'underline' }}>กลับหน้าหลัก</a>
    </div>
  );
}
