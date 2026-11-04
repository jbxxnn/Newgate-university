"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
const input = z.object({ title: z.string().trim().min(3), description: z.string().trim().min(10), category: z.string().trim().min(2), likelihood: z.coerce.number().int().min(1).max(5), impact: z.coerce.number().int().min(1).max(5), dataAssetId: z.string().min(1), treatmentPlan: z.string().trim().optional() });
export type RiskState = { error?: string; success?: string };
export async function createRisk(_: RiskState, data: FormData): Promise<RiskState> { const session = await requirePermission("risks.manage"); const parsed = input.safeParse(Object.fromEntries(data)); if (!parsed.success) return { error: "Complete all required risk fields." }; const score = parsed.data.likelihood * parsed.data.impact; const level = score <= 4 ? "LOW" : score <= 9 ? "MEDIUM" : score <= 16 ? "HIGH" : "CRITICAL"; const count = await db.risk.count(); const risk = await db.$transaction(async (tx) => { const created = await tx.risk.create({ data: { ...parsed.data, treatmentPlan: parsed.data.treatmentPlan || null, riskNumber: `RISK-${String(count + 1).padStart(4, "0")}`, score, level } }); await tx.auditLog.create({ data: { actorId: session.userId, eventType: "RISK_CREATED", module: "COMPLIANCE", recordType: "RISK", recordId: created.id, metadata: { score, level } } }); return created; }); revalidatePath("/risks"); return { success: `${risk.riskNumber} recorded as ${level}.` }; }
