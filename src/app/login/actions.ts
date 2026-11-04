"use server";

import { compare } from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { writeAuditEvent } from "@/lib/audit";

const credentials = z.object({ email: z.string().email(), password: z.string().min(1) });
export type LoginState = { error?: string };

export async function signIn(_: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = credentials.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "Enter a valid university email and password." };
  const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() }, include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } } });
  if (!user || user.status !== "ACTIVE" || !(await compare(parsed.data.password, user.passwordHash))) { await writeAuditEvent({ eventType: "LOGIN_FAILURE", module: "AUTH", recordType: "USER", result: "DENIED", metadata: { email: parsed.data.email } }); return { error: "Invalid email or password." }; }
  const permissions = [...new Set(user.roles.flatMap((item) => item.role.permissions.map((entry) => entry.permission.key)))];
  await db.$transaction([db.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } }), db.auditLog.create({ data: { actorId: user.id, eventType: "LOGIN_SUCCESS", module: "AUTH", recordType: "USER", recordId: user.id } })]);
  await createSession({ userId: user.id, name: user.fullName, permissions });
  redirect("/dashboard");
}
