import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { uploadToUploadcare } from "@/lib/services/uploadcareService";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["application/pdf"];

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("[UPLOAD] session:", session);
    if (!session?.user?.name) {
      console.log("[UPLOAD] Unauthorized: no session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      console.log("[UPLOAD] ไม่พบไฟล์ที่อัปโหลด");
      return NextResponse.json({ error: "ไม่พบไฟล์ที่อัปโหลด" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      console.log("[UPLOAD] ไฟล์ไม่ใช่ PDF", file.type);
      return NextResponse.json(
        { error: "รองรับเฉพาะไฟล์ PDF เท่านั้น" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      console.log("[UPLOAD] ไฟล์ใหญ่เกินไป", file.size);
      return NextResponse.json(
        { error: "ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const sanitizedUsername = session.user.name.replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `resume_${sanitizedUsername}_${timestamp}.pdf`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // อัปโหลดไปยัง Google Drive
    // สร้างไฟล์ใหม่จาก buffer เพื่อส่งไป Uploadcare
    const uploadcareFile = new File([buffer], fileName, { type: file.type });
    const uploadcareResult = await uploadToUploadcare(uploadcareFile);
    console.log("[UPLOAD] Success:", uploadcareResult);
    return NextResponse.json(
      { success: true, ...uploadcareResult, fileName },
      { status: 201 }
    );
  } catch (error) {
    console.error("[UPLOAD] Upload Error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปโหลดไฟล์" },
      { status: 500 }
    );
  }
}
