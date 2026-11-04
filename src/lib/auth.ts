import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { redirect } from "next/navigation";

const COOKIE_NAME = "newgate_session";
const secret = new TextEncoder().encode(process.env.SESSION_SECRET ?? "development-only-secret-change-me");
export type Session = { userId: string; name: string; permissions: string[] };

export async function createSession(session: Session) {
  const token = await new SignJWT(session).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("8h").sign(secret);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try { return (await jwtVerify(token, secret)).payload as unknown as Session; } catch { return null; }
}

export async function requireSession() { const session = await getSession(); if (!session) redirect("/login"); return session; }
export async function requirePermission(permission: string) { const session = await requireSession(); if (!session.permissions.includes(permission)) redirect("/dashboard"); return session; }
export async function clearSession() { (await cookies()).delete(COOKIE_NAME); }
