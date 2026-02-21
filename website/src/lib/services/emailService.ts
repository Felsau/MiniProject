import nodemailer from "nodemailer";
import {
  applicationConfirmationHtml,
  newApplicationNotifyHRHtml,
  statusUpdateHtml,
} from "./emailTemplates";

/**
 * สร้าง transporter สำหรับส่ง email
 * รองรับ 2 โหมด:
 *   1. Production: ใช้ SMTP จริง (Gmail, SendGrid, etc.)
 *   2. Development: ใช้ Ethereal (fake SMTP สำหรับ test)
 */
function createTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.ETHEREAL_USER || "",
      pass: process.env.ETHEREAL_PASS || "",
    },
  });
}

const transporter = createTransporter();

const FROM_EMAIL = process.env.SMTP_FROM || "Job Recruitment System <noreply@recruitment.com>";

interface ApplicationEmailData {
  applicantName: string;
  applicantEmail: string;
  jobTitle: string;
  jobDepartment?: string | null;
  jobLocation?: string | null;
}

/**
 * ✉️ ส่ง email แจ้ง User เมื่อสมัครงานสำเร็จ
 */
export async function sendApplicationConfirmationEmail(data: ApplicationEmailData) {
  if (!data.applicantEmail) {
    console.log("⚠️ ไม่มี email ของผู้สมัคร, ข้ามการส่ง email");
    return { success: false, reason: "no_email" };
  }

  const html = applicationConfirmationHtml(data.applicantName, {
    jobTitle: data.jobTitle,
    jobDepartment: data.jobDepartment,
    jobLocation: data.jobLocation,
  });

  return sendEmail({
    to: data.applicantEmail,
    subject: `✅ สมัครงานสำเร็จ - ตำแหน่ง ${data.jobTitle}`,
    html,
  });
}

/**
 * ✉️ ส่ง email แจ้ง HR/Admin เมื่อมีคนสมัครงานใหม่
 */
export async function sendNewApplicationNotifyHR(
  data: ApplicationEmailData & { hrEmails: string[] }
) {
  if (data.hrEmails.length === 0) {
    console.log("⚠️ ไม่พบ email ของ HR/Admin, ข้ามการส่ง email");
    return { success: false, reason: "no_hr_emails" };
  }

  const html = newApplicationNotifyHRHtml(
    data.applicantName,
    data.applicantEmail,
    {
      jobTitle: data.jobTitle,
      jobDepartment: data.jobDepartment,
    }
  );

  return sendEmail({
    to: data.hrEmails.join(", "),
    subject: `📩 ใบสมัครใหม่ - ${data.applicantName} สมัครตำแหน่ง ${data.jobTitle}`,
    html,
  });
}

interface StatusUpdateEmailData {
  applicantName: string;
  applicantEmail: string;
  jobTitle: string;
  jobDepartment?: string | null;
  jobLocation?: string | null;
  newStatus: "ACCEPTED" | "REJECTED";
}

/**
 * ✉️ ส่ง email แจ้งผลการพิจารณาใบสมัคร (ACCEPTED / REJECTED)
 */
export async function sendApplicationStatusUpdateEmail(data: StatusUpdateEmailData) {
  if (!data.applicantEmail) {
    console.log("⚠️ ไม่มี email ของผู้สมัคร, ข้ามการส่ง email");
    return { success: false, reason: "no_email" };
  }

  const isAccepted = data.newStatus === "ACCEPTED";

  const html = statusUpdateHtml(data.applicantName, {
    jobTitle: data.jobTitle,
    jobDepartment: data.jobDepartment,
    jobLocation: data.jobLocation,
  }, data.newStatus);

  return sendEmail({
    to: data.applicantEmail,
    subject: isAccepted
      ? `🎉 ยินดีด้วย! คุณผ่านการคัดเลือกตำแหน่ง ${data.jobTitle}`
      : `📋 ผลการพิจารณา - ตำแหน่ง ${data.jobTitle}`,
    html,
  });
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(options: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log(`✅ Email sent: ${options.subject} -> ${options.to}`);
    console.log(`   Message ID: ${info.messageId}`);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`   📧 Preview URL: ${previewUrl}`);
    }

    return { success: true, messageId: info.messageId, previewUrl: previewUrl || null };
  } catch (error) {
    console.error(`❌ Email send failed: ${options.subject}`, error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
