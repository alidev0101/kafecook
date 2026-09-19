import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Get session on server side
export async function getSession() {
  return await getServerSession(authOptions);
}

// Get current user (server)
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

// Check if user is authenticated (server)
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

// Check if user is admin (server)
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}

// Helper to check role
export function hasRole(user, role) {
  return user?.role === role;
}

export function isAdmin(user) {
  return user?.role === "ADMIN";
}
