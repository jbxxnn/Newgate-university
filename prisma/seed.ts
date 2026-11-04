import { PrismaClient, SystemRole } from "@prisma/client";
import { hash } from "bcryptjs";
import { ROLE_PERMISSIONS } from "../src/lib/permissions";

const db = new PrismaClient();
async function main() {
  for (const [name, code] of [["Registry", "REG"], ["ICT Directorate", "ICT"], ["Examinations", "EXM"], ["Academic Affairs", "ACA"]]) {
    await db.department.upsert({ where: { code }, update: { name }, create: { name, code } });
  }
  for (const [name, rank, description] of [["Public", 1, "Approved for public disclosure"], ["Internal", 2, "For internal university use"], ["Confidential", 3, "Sensitive student or institutional information"], ["Restricted", 4, "Highly sensitive information requiring strongest safeguards"]] as const) {
    await db.dataClassification.upsert({ where: { name }, update: { rank, description }, create: { name, rank, description } });
  }
  for (const key of Object.keys(ROLE_PERMISSIONS)) await db.role.upsert({ where: { key: key as SystemRole }, update: { name: key.replaceAll("_", " ") }, create: { key: key as SystemRole, name: key.replaceAll("_", " ") } });
  for (const key of new Set(Object.values(ROLE_PERMISSIONS).flat())) await db.permission.upsert({ where: { key }, update: {}, create: { key } });
  for (const [roleKey, permissionKeys] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await db.role.findUniqueOrThrow({ where: { key: roleKey as SystemRole } });
    for (const key of permissionKeys) {
      const permission = await db.permission.findUniqueOrThrow({ where: { key } });
      await db.rolePermission.upsert({ where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } }, update: {}, create: { roleId: role.id, permissionId: permission.id } });
    }
  }
  const registry = await db.department.findUniqueOrThrow({ where: { code: "REG" } });
  const passwordHash = await hash("NewgateDemo!2026", 12);
  const demoUsers = [
    ["Amina Bello", "privacy.officer@newgate.edu.ng", "Privacy Officer", "PRIVACY_OFFICER"],
    ["Chinedu Okafor", "ict.officer@newgate.edu.ng", "ICT Officer", "ICT_OFFICER"],
    ["Fatima Ibrahim", "data.steward@newgate.edu.ng", "Data Steward", "DATA_STEWARD"],
    ["Musa Abdullahi", "data.owner@newgate.edu.ng", "Registrar", "DATA_OWNER"],
    ["Ibrahim Musa", "management@newgate.edu.ng", "Management Viewer", "MANAGEMENT_VIEWER"],
    ["System Administrator", "admin@newgate.edu.ng", "ICT Administrator", "SUPER_ADMIN"],
  ] as const;
  for (const [fullName, email, jobTitle, roleKey] of demoUsers) {
    const user = await db.user.upsert({ where: { email }, update: { fullName, jobTitle, passwordHash, status: "ACTIVE" }, create: { fullName, email, jobTitle, passwordHash, departmentId: registry.id } });
    const role = await db.role.findUniqueOrThrow({ where: { key: roleKey } });
    await db.userRole.upsert({ where: { userId_roleId: { userId: user.id, roleId: role.id } }, update: {}, create: { userId: user.id, roleId: role.id } });
  }
  const confidential = await db.dataClassification.findUniqueOrThrow({ where: { name: "Confidential" } });
  const owner = await db.user.findUniqueOrThrow({ where: { email: "data.owner@newgate.edu.ng" } });
  const steward = await db.user.findUniqueOrThrow({ where: { email: "data.steward@newgate.edu.ng" } });
  const examination = await db.department.findUniqueOrThrow({ where: { code: "EXM" } });
  const results = await db.dataAsset.upsert({ where: { name: "Examination Results" }, update: {}, create: { assetNumber: "AST-0001", name: "Examination Results", description: "Student examination outcomes and assessment records.", dataCategory: "Academic Records", processingPurpose: "Academic assessment, progression and award decisions", lawfulBasis: "Institutional academic administration", status: "ACTIVE", departmentId: examination.id, classificationId: confidential.id } });
  await db.dataAssetOwner.upsert({ where: { dataAssetId_userId: { dataAssetId: results.id, userId: owner.id } }, update: {}, create: { dataAssetId: results.id, userId: owner.id } });
  await db.dataAssetSteward.upsert({ where: { dataAssetId_userId: { dataAssetId: results.id, userId: steward.id } }, update: {}, create: { dataAssetId: results.id, userId: steward.id } });
  await db.retentionRule.upsert({ where: { dataAssetId: results.id }, update: {}, create: { dataAssetId: results.id, retentionPeriod: "7 years", retentionTrigger: "Graduation or last academic activity", legalPolicyBasis: "University records retention policy", disposalMethod: "Approved secure disposal" } });
  const requirement = await db.complianceRequirement.upsert({ where: { requirementNumber: "REQ-0001" }, update: {}, create: { requirementNumber: "REQ-0001", framework: "NDPA 2023", reference: "Access control", title: "Authorised access to student records", description: "Access to confidential academic records must be limited to authorised personnel." } });
  const control = await db.control.upsert({ where: { controlNumber: "CTL-0001" }, update: { status: "PARTIALLY_COMPLIANT" }, create: { controlNumber: "CTL-0001", name: "Examination results access review", description: "Review access to examination results for appropriateness.", reviewFrequency: "Quarterly", status: "PARTIALLY_COMPLIANT", requirementId: requirement.id, dataAssetId: results.id } });
  await db.risk.upsert({ where: { riskNumber: "RISK-0001" }, update: {}, create: { riskNumber: "RISK-0001", title: "Excessive access to examination results", description: "A periodic access review identified a user whose permission exceeded their current duty.", category: "Access Control", likelihood: 4, impact: 5, score: 20, level: "CRITICAL", treatmentPlan: "Remove excess permission and verify the access group.", dataAssetId: results.id } });
  let review = await db.controlReview.findFirst({ where: { controlId: control.id } });
  if (!review) review = await db.controlReview.create({ data: { controlId: control.id, reviewerId: (await db.user.findUniqueOrThrow({ where: { email: "privacy.officer@newgate.edu.ng" } })).id, result: "PARTIALLY_COMPLIANT", notes: "One excessive permission identified during periodic access review.", evidenceReference: "Synthetic access-review evidence AR-2026-001" } });
  const finding = await db.finding.upsert({ where: { controlReviewId: review.id }, update: {}, create: { findingNumber: "FND-0001", controlReviewId: review.id, description: "Remove excessive Examination Results permission and confirm least-privilege access.", severity: "HIGH" } });
  await db.correctiveAction.upsert({ where: { actionNumber: "ACT-0001" }, update: {}, create: { actionNumber: "ACT-0001", title: "Remove excessive results access", requiredAction: "Remove the obsolete access grant and retain remediation evidence.", priority: "HIGH", dueDate: new Date("2026-10-20"), findingId: finding.id, assignedOfficerId: (await db.user.findUniqueOrThrow({ where: { email: "ict.officer@newgate.edu.ng" } })).id } });
}
main().then(() => db.$disconnect()).catch(async (error) => { console.error(error); await db.$disconnect(); process.exit(1); });
