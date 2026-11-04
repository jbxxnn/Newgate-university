-- CreateEnum
CREATE TYPE "DataAssetStatus" AS ENUM ('DRAFT', 'ACTIVE', 'UNDER_REVIEW', 'ARCHIVED');

-- CreateTable
CREATE TABLE "DataClassification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "DataClassification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataAsset" (
    "id" TEXT NOT NULL,
    "assetNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dataCategory" TEXT NOT NULL,
    "processingPurpose" TEXT NOT NULL,
    "lawfulBasis" TEXT,
    "status" "DataAssetStatus" NOT NULL DEFAULT 'DRAFT',
    "reviewDate" TIMESTAMP(3),
    "notes" TEXT,
    "departmentId" TEXT NOT NULL,
    "classificationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataAssetOwner" (
    "dataAssetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataAssetOwner_pkey" PRIMARY KEY ("dataAssetId","userId")
);

-- CreateTable
CREATE TABLE "DataAssetSteward" (
    "dataAssetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataAssetSteward_pkey" PRIMARY KEY ("dataAssetId","userId")
);

-- CreateTable
CREATE TABLE "RetentionRule" (
    "id" TEXT NOT NULL,
    "dataAssetId" TEXT NOT NULL,
    "retentionPeriod" TEXT NOT NULL,
    "retentionTrigger" TEXT NOT NULL,
    "legalPolicyBasis" TEXT,
    "reviewDate" TIMESTAMP(3),
    "disposalMethod" TEXT,
    "approvalRequired" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RetentionRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DataClassification_name_key" ON "DataClassification"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DataClassification_rank_key" ON "DataClassification"("rank");

-- CreateIndex
CREATE UNIQUE INDEX "DataAsset_assetNumber_key" ON "DataAsset"("assetNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DataAsset_name_key" ON "DataAsset"("name");

-- CreateIndex
CREATE INDEX "DataAsset_status_departmentId_idx" ON "DataAsset"("status", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "RetentionRule_dataAssetId_key" ON "RetentionRule"("dataAssetId");

-- AddForeignKey
ALTER TABLE "DataAsset" ADD CONSTRAINT "DataAsset_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataAsset" ADD CONSTRAINT "DataAsset_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "DataClassification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataAssetOwner" ADD CONSTRAINT "DataAssetOwner_dataAssetId_fkey" FOREIGN KEY ("dataAssetId") REFERENCES "DataAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataAssetOwner" ADD CONSTRAINT "DataAssetOwner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataAssetSteward" ADD CONSTRAINT "DataAssetSteward_dataAssetId_fkey" FOREIGN KEY ("dataAssetId") REFERENCES "DataAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataAssetSteward" ADD CONSTRAINT "DataAssetSteward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetentionRule" ADD CONSTRAINT "RetentionRule_dataAssetId_fkey" FOREIGN KEY ("dataAssetId") REFERENCES "DataAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
