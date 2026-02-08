import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";

// ============================================
// Bookmark API — TODO: ต้องสร้าง SavedJob model ใน Prisma ก่อนใช้งาน
// ============================================
//
// ขั้นตอนเปิดใช้งาน:
// 1. เพิ่ม SavedJob model ใน prisma/schema.prisma:
//
//    model SavedJob {
//      id        String   @id @default(cuid())
//      userId    String
//      user      User     @relation("savedJobs", fields: [userId], references: [id])
//      jobId     String
//      job       Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
//      createdAt DateTime @default(now())
//      @@unique([userId, jobId])
//      @@map("SavedJob")
//    }
//
// 2. เพิ่ม relation ใน User model:
//    savedJobs SavedJob[] @relation("savedJobs")
//
// 3. เพิ่ม relation ใน Job model:
//    savedBy   SavedJob[]
//
// 4. รัน: npx prisma migrate dev --name add_saved_job
//
// 5. Uncomment โค้ดด้านล่างแล้วลบ placeholder response
// ============================================

/**
 * GET /api/bookmark — ดึงรายการงานที่บันทึกไว้ของ user ปัจจุบัน
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { username: session.user.name } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const savedJobs = await prisma.savedJob.findMany({
    where: { userId: user.id },
    include: {
      job: {
        include: {
          postedByUser: { select: { fullName: true, username: true } },
          _count: { select: { applications: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(savedJobs);
}

/**
 * POST /api/bookmark — บันทึกงาน
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = await req.json();
  if (!jobId) return NextResponse.json({ error: "Missing jobId" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { username: session.user.name } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId: user.id, jobId } },
  });
  if (existing) return NextResponse.json({ error: "บันทึกไว้แล้ว" }, { status: 400 });

  const saved = await prisma.savedJob.create({
    data: { userId: user.id, jobId },
  });

  return NextResponse.json(saved, { status: 201 });
}

/**
 * DELETE /api/bookmark — ลบ bookmark
 */
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = await req.json();
  if (!jobId) return NextResponse.json({ error: "Missing jobId" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { username: session.user.name } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  await prisma.savedJob.deleteMany({
    where: { userId: user.id, jobId },
  });

  return NextResponse.json({ success: true });
}
