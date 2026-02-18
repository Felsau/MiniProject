import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";

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
