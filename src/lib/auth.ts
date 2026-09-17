import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { isAdminEmail } from "@/lib/admin";

export type AdminUser = { id: string; email: string; name: string | null };

/** Returns the signed-in user only if their email is on the ADMIN_EMAILS allowlist. */
export async function getAdminUser(): Promise<AdminUser | null> {
  const user = await getSignedInUser();
  if (!user || !isAdminEmail(user.email, process.env.ADMIN_EMAILS)) return null;
  return user;
}

/** Any signed-in Clerk user, or null when signed out or when Clerk isn't set up yet. */
export async function getSignedInUser(): Promise<AdminUser | null> {
  try {
    const { userId } = await auth();
    if (!userId) return null;
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!user || !email) return null;
    return { id: user.id, email, name: user.fullName };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.warn("Clerk is not ready:", (error as Error).message);
    return null;
  }
}

export class NotAdminError extends Error {
  constructor() {
    super("You need to sign in with an admin account to do this.");
  }
}

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) throw new NotAdminError();
  return admin;
}
