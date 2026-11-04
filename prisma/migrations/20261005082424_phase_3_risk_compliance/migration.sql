-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('NOT_ASSESSED', 'COMPLIANT', 'PARTIALLY_COMPLIANT', 'NON_COMPLIANT', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "RiskStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'TREATMENT_PLANNED', 'IN_TREATMENT', 'ACCEPTED', 'MITIGATED', 'CLOSED');

-- CreateTable
CREATE TABLE "Risk" (
    "id" TEXT NOT NULL,
    "riskNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "likelihood" INTEGER NOT NULL,
    "impact" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "treatmentPlan" TEXT,
    "status" "RiskStatus" NOT NULL DEFAULT 'OPEN',
    "reviewDate" TIMESTAMP(3),
    "dataAssetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Risk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplianceRequirement" (
    "id" TEXT NOT NULL,
    "requirementNumber" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComplianceRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Control" (
    "id" TEXT NOT NULL,
    "controlNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reviewFrequency" TEXT NOT NULL,
    "status" "ComplianceStatus" NOT NULL DEFAULT 'NOT_ASSESSED',
    "lastReviewDate" TIMESTAMP(3),
    "nextReviewDate" TIMESTAMP(3),
    "requirementId" TEXT NOT NULL,
    "dataAssetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Control_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControlReview" (
    "id" TEXT NOT NULL,
    "controlId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "result" "ComplianceStatus" NOT NULL,
    "notes" TEXT,
    "evidenceReference" TEXT,
    "reviewDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextReviewDate" TIMESTAMP(3),

    CONSTRAINT "ControlReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Finding" (
    "id" TEXT NOT NULL,
    "findingNumber" TEXT NOT NULL,
    "controlReviewId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Finding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Risk_riskNumber_key" ON "Risk"("riskNumber");

-- CreateIndex
CREATE INDEX "Risk_status_level_idx" ON "Risk"("status", "level");

-- CreateIndex
CREATE UNIQUE INDEX "ComplianceRequirement_requirementNumber_key" ON "ComplianceRequirement"("requirementNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Control_controlNumber_key" ON "Control"("controlNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Finding_findingNumber_key" ON "Finding"("findingNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Finding_controlReviewId_key" ON "Finding"("controlReviewId");

-- AddForeignKey
ALTER TABLE "Risk" ADD CONSTRAINT "Risk_dataAssetId_fkey" FOREIGN KEY ("dataAssetId") REFERENCES "DataAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Control" ADD CONSTRAINT "Control_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "ComplianceRequirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Control" ADD CONSTRAINT "Control_dataAssetId_fkey" FOREIGN KEY ("dataAssetId") REFERENCES "DataAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControlReview" ADD CONSTRAINT "ControlReview_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "Control"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finding" ADD CONSTRAINT "Finding_controlReviewId_fkey" FOREIGN KEY ("controlReviewId") REFERENCES "ControlReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
