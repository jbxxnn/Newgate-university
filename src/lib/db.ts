import { PrismaClient } from "@prisma/client";

const globalForDb = globalThis as unknown as { prisma?: PrismaClient };
const databaseUrl = process.env.DATABASE_URL;
const prismaUrl = databaseUrl?.includes(".pooler.supabase.com")
  ? `${databaseUrl}${databaseUrl.includes("?") ? "&" : "?"}pgbouncer=true`
  : databaseUrl;

export const db = globalForDb.prisma ?? new PrismaClient(
  prismaUrl ? { datasources: { db: { url: prismaUrl } } } : undefined,
);
if (process.env.NODE_ENV !== "production") globalForDb.prisma = db;
