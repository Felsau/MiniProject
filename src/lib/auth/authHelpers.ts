import { signOut } from "next-auth/react";

export async function handleLogoutUser(redirectUrl: string = "/") {
  await signOut({ callbackUrl: redirectUrl });
}
