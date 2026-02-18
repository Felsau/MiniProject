import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { isUserAdminOrHR } from "@/lib/auth/sessionHelpers";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.name) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อน" }, { status: 401 });
    }

    const isAdmin = await isUserAdminOrHR(session.user.name as string);
    if (!isAdmin) {
      return NextResponse.json({ error: "คุณไม่มีสิทธิ์ดูข้อมูลผู้สมัคร" }, { status: 403 });
    }

    const { id } = await params;

    const jobWithApplicants = await prisma.job.findUnique({
      where: { id },
      include: {
        applications: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                username: true,
                email: true,

              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!jobWithApplicants) {
      return NextResponse.json({ error: "ไม่พบตำแหน่งงานนี้" }, { status: 404 });
    }

    return NextResponse.json(jobWithApplicants);
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}