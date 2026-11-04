export type AuditEvent = { actorId?: string; eventType: string; module: string; recordType: string; recordId?: string; result?: "SUCCESS" | "DENIED" | "FAILURE"; metadata?: Record<string, unknown> };
// Invoke from every sensitive server action in the same database transaction as its write.
export async function writeAuditEvent(event: AuditEvent) { console.info("AUDIT", { ...event, createdAt: new Date().toISOString() }); }
