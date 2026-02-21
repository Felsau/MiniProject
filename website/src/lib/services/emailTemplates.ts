export function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="max-width:600px; margin:0 auto; padding:20px;">
    <div style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding:30px; border-radius:16px 16px 0 0; text-align:center;">
      <h1 style="color:white; margin:0; font-size:24px;">💼 Job Recruitment System</h1>
    </div>
    <div style="background:white; padding:30px; border-radius:0 0 16px 16px; box-shadow:0 4px 6px rgba(0,0,0,0.05);">
      ${content}
    </div>
    <div style="text-align:center; padding:20px; color:#9ca3af; font-size:12px;">
      <p>อีเมลนี้ส่งจากระบบอัตโนมัติ กรุณาอย่าตอบกลับ</p>
      <p>© ${new Date().getFullYear()} Job Recruitment System</p>
    </div>
  </div>
</body>
</html>`;
}

interface JobInfo {
  jobTitle: string;
  jobDepartment?: string | null;
  jobLocation?: string | null;
}

/** Template: ยืนยันการสมัครงาน (ส่งให้ผู้สมัคร) */
export function applicationConfirmationHtml(applicantName: string, job: JobInfo): string {
  return baseTemplate(`
    <h2 style="color:#1f2937; margin-top:0;">สมัครงานสำเร็จ! 🎉</h2>
    <p style="color:#4b5563; font-size:16px;">
      สวัสดีคุณ <strong>${applicantName}</strong>,
    </p>
    <p style="color:#4b5563; font-size:16px;">
      ใบสมัครของคุณได้ถูกส่งเรียบร้อยแล้ว
    </p>
    
    <div style="background:#f0f9ff; border:1px solid #bfdbfe; border-radius:12px; padding:20px; margin:20px 0;">
      <h3 style="margin:0 0 12px 0; color:#1e40af;">📋 รายละเอียดตำแหน่ง</h3>
      <table style="width:100%; border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0; color:#6b7280; width:120px;">ตำแหน่ง:</td>
          <td style="padding:6px 0; color:#1f2937; font-weight:600;">${job.jobTitle}</td>
        </tr>
        ${job.jobDepartment ? `
        <tr>
          <td style="padding:6px 0; color:#6b7280;">แผนก:</td>
          <td style="padding:6px 0; color:#1f2937;">${job.jobDepartment}</td>
        </tr>` : ""}
        ${job.jobLocation ? `
        <tr>
          <td style="padding:6px 0; color:#6b7280;">สถานที่:</td>
          <td style="padding:6px 0; color:#1f2937;">${job.jobLocation}</td>
        </tr>` : ""}
      </table>
    </div>

    <div style="background:#fefce8; border:1px solid #fde68a; border-radius:12px; padding:16px; margin:20px 0; text-align:center;">
      <p style="margin:0; color:#92400e; font-size:14px;">
        ⏳ สถานะปัจจุบัน: <strong>รอพิจารณา (PENDING)</strong>
      </p>
      <p style="margin:8px 0 0 0; color:#a16207; font-size:13px;">
        เราจะแจ้งผลการพิจารณาให้ทราบทางอีเมล
      </p>
    </div>

    <p style="color:#6b7280; font-size:14px;">
      คุณสามารถติดตามสถานะใบสมัครได้ที่หน้า <strong>"งานที่สมัครไปแล้ว"</strong> ในระบบ
    </p>
  `);
}

/** Template: แจ้ง HR เมื่อมีใบสมัครใหม่ */
export function newApplicationNotifyHRHtml(
  applicantName: string,
  applicantEmail: string,
  job: JobInfo
): string {
  return baseTemplate(`
    <h2 style="color:#1f2937; margin-top:0;">📩 มีใบสมัครใหม่เข้ามา!</h2>
    <p style="color:#4b5563; font-size:16px;">
      มีผู้สมัครงานใหม่เข้ามาในระบบ
    </p>
    
    <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:20px; margin:20px 0;">
      <h3 style="margin:0 0 12px 0; color:#166534;">👤 ข้อมูลผู้สมัคร</h3>
      <table style="width:100%; border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0; color:#6b7280; width:120px;">ชื่อ:</td>
          <td style="padding:6px 0; color:#1f2937; font-weight:600;">${applicantName}</td>
        </tr>
        <tr>
          <td style="padding:6px 0; color:#6b7280;">อีเมล:</td>
          <td style="padding:6px 0; color:#1f2937;">${applicantEmail || "-"}</td>
        </tr>
      </table>
    </div>
    
    <div style="background:#f0f9ff; border:1px solid #bfdbfe; border-radius:12px; padding:20px; margin:20px 0;">
      <h3 style="margin:0 0 12px 0; color:#1e40af;">📋 ตำแหน่งที่สมัคร</h3>
      <table style="width:100%; border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0; color:#6b7280; width:120px;">ตำแหน่ง:</td>
          <td style="padding:6px 0; color:#1f2937; font-weight:600;">${job.jobTitle}</td>
        </tr>
        ${job.jobDepartment ? `
        <tr>
          <td style="padding:6px 0; color:#6b7280;">แผนก:</td>
          <td style="padding:6px 0; color:#1f2937;">${job.jobDepartment}</td>
        </tr>` : ""}
      </table>
    </div>

    <div style="text-align:center; margin:24px 0;">
      <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/applications" 
         style="display:inline-block; background:linear-gradient(135deg, #2563eb, #4f46e5); color:white; padding:12px 32px; border-radius:8px; text-decoration:none; font-weight:600; font-size:14px;">
        📋 ดูใบสมัครในระบบ
      </a>
    </div>
  `);
}

/** Template: แจ้งผลการพิจารณา (ACCEPTED / REJECTED) */
export function statusUpdateHtml(
  applicantName: string,
  job: JobInfo,
  newStatus: "ACCEPTED" | "REJECTED"
): string {
  const isAccepted = newStatus === "ACCEPTED";

  const statusConfig = isAccepted
    ? {
        emoji: "🎉",
        title: "ขอแสดงความยินดี! คุณผ่านการคัดเลือก",
        statusText: "ผ่านการคัดเลือก",
        statusColor: "#166534",
        statusBg: "#f0fdf4",
        statusBorder: "#bbf7d0",
        message: "ทีมงานจะติดต่อกลับเพื่อนัดหมายขั้นตอนถัดไป กรุณาเช็คอีเมลและเบอร์โทรศัพท์เป็นระยะ",
      }
    : {
        emoji: "📋",
        title: "ผลการพิจารณาใบสมัคร",
        statusText: "ไม่ผ่านการคัดเลือก",
        statusColor: "#991b1b",
        statusBg: "#fef2f2",
        statusBorder: "#fecaca",
        message: "ขอขอบคุณที่ให้ความสนใจสมัครงานกับเรา แม้ว่าครั้งนี้จะไม่ผ่านการคัดเลือก แต่เราเก็บข้อมูลของคุณไว้สำหรับโอกาสในอนาคต",
      };

  return baseTemplate(`
    <h2 style="color:#1f2937; margin-top:0;">${statusConfig.emoji} ${statusConfig.title}</h2>
    <p style="color:#4b5563; font-size:16px;">
      สวัสดีคุณ <strong>${applicantName}</strong>,
    </p>
    
    <div style="background:#f0f9ff; border:1px solid #bfdbfe; border-radius:12px; padding:20px; margin:20px 0;">
      <h3 style="margin:0 0 12px 0; color:#1e40af;">📋 ตำแหน่งที่สมัคร</h3>
      <table style="width:100%; border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0; color:#6b7280; width:120px;">ตำแหน่ง:</td>
          <td style="padding:6px 0; color:#1f2937; font-weight:600;">${job.jobTitle}</td>
        </tr>
        ${job.jobDepartment ? `
        <tr>
          <td style="padding:6px 0; color:#6b7280;">แผนก:</td>
          <td style="padding:6px 0; color:#1f2937;">${job.jobDepartment}</td>
        </tr>` : ""}
        ${job.jobLocation ? `
        <tr>
          <td style="padding:6px 0; color:#6b7280;">สถานที่:</td>
          <td style="padding:6px 0; color:#1f2937;">${job.jobLocation}</td>
        </tr>` : ""}
      </table>
    </div>

    <div style="background:${statusConfig.statusBg}; border:1px solid ${statusConfig.statusBorder}; border-radius:12px; padding:20px; margin:20px 0; text-align:center;">
      <p style="margin:0; font-size:18px; font-weight:700; color:${statusConfig.statusColor};">
        ${statusConfig.emoji} ${statusConfig.statusText}
      </p>
    </div>

    <p style="color:#4b5563; font-size:15px; line-height:1.6;">
      ${statusConfig.message}
    </p>

    ${isAccepted ? `
    <div style="text-align:center; margin:24px 0;">
      <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/applications" 
         style="display:inline-block; background:linear-gradient(135deg, #16a34a, #15803d); color:white; padding:12px 32px; border-radius:8px; text-decoration:none; font-weight:600; font-size:14px;">
        ✅ ดูรายละเอียดในระบบ
      </a>
    </div>` : `
    <div style="text-align:center; margin:24px 0;">
      <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/jobs" 
         style="display:inline-block; background:linear-gradient(135deg, #2563eb, #4f46e5); color:white; padding:12px 32px; border-radius:8px; text-decoration:none; font-weight:600; font-size:14px;">
        🔍 ค้นหาตำแหน่งอื่นๆ
      </a>
    </div>`}

    <p style="color:#9ca3af; font-size:13px; margin-top:24px;">
      หากมีข้อสงสัยเพิ่มเติม สามารถติดต่อฝ่าย HR ได้ตลอดเวลา
    </p>
  `);
}
