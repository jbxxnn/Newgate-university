import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const control = await db.control.findUniqueOrThrow({ where: { controlNumber: "CTL-0001" } });
  const statuses = ["COMPLIANT", "COMPLIANT", "COMPLIANT", "COMPLIANT", "COMPLIANT", "PARTIALLY_COMPLIANT", "PARTIALLY_COMPLIANT"] as const;
  for (const [index, status] of statuses.entries()) {
    const number = `T8-CTL-${String(index + 1).padStart(2, "0")}`;
    await db.control.upsert({ where: { controlNumber: number }, update: { status }, create: { controlNumber: number, name: `Dashboard calculation test control ${index + 1}`, description: "Synthetic T-008 dashboard calculation fixture.", reviewFrequency: "Test", status, requirementId: control.requirementId, dataAssetId: control.dataAssetId } });
  }
}

main().then(() => db.$disconnect()).catch(async (error) => { console.error(error); await db.$disconnect(); process.exit(1); });
