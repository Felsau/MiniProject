import { prisma } from "@/lib/db/prisma";

/**
 * Get user by username from session
 */
export async function getUserByUsername(username: string) {
  try {
    return await prisma.user.findUnique({
      where: { username },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

/**
 * Check if user is admin or HR
 */
export async function isUserAdminOrHR(username: string): Promise<boolean> {
  const user = await getUserByUsername(username);
  return user?.role === "ADMIN" || user?.role === "HR";
}

/**
 * Validate session user
 */
export async function validateSessionUser(username: string | null | undefined) {
  if (!username) return null;
  return await getUserByUsername(username);
}
