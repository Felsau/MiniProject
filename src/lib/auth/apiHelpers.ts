import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { isUserAdminOrHR } from "@/lib/auth/sessionHelpers";

/**
 * Extract session and validate user
 */
export async function getSessionUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.name) {
    return null;
  }

  return session.user;
}

/**
 * Check authorization (admin/hr only)
 */
export async function requireAdminOrHR() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.name) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อน" },
        { status: 401 }
      ),
    };
  }

  const isAdmin = await isUserAdminOrHR(session.user.name as string);
  if (!isAdmin) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้" },
        { status: 403 }
      ),
    };
  }

  return { authorized: true };
}

/**
 * Get user authorization status for job queries
 */
export async function getUserAuthStatus(username: string) {
  let isAdminOrHR = false;
  if (username) {
    isAdminOrHR = await isUserAdminOrHR(username);
  }
  return isAdminOrHR;
}
