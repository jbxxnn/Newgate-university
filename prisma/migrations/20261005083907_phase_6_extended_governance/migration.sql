-- CreateTable
CREATE TABLE "DisposalRecord" (
    "id" TEXT NOT NULL,
    "dataAssetId" TEXT NOT NULL,
    "proposedDisposalDate" TIMESTAMP(3) NOT NULL,
    "disposalMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PROPOSED',
    "evidenceReference" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DisposalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataQualityIssue" (
    "id" TEXT NOT NULL,
    "issueNumber" TEXT NOT NULL,
    "dataAssetId" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataQualityIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessReview" (
    "id" TEXT NOT NULL,
    "reviewNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThirdParty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "approvalStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "riskRating" TEXT NOT NULL,
    "nextReviewDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "ThirdParty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThirdPartyAsset" (
    "thirdPartyId" TEXT NOT NULL,
    "dataAssetId" TEXT NOT NULL,

    CONSTRAINT "ThirdPartyAsset_pkey" PRIMARY KEY ("thirdPartyId","dataAssetId")
);

-- CreateTable
CREATE TABLE "TrainingEvent" (
    "id" TEXT NOT NULL,
    "trainingNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "trainingDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DataQualityIssue_issueNumber_key" ON "DataQualityIssue"("issueNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AccessReview_reviewNumber_key" ON "AccessReview"("reviewNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ThirdParty_name_key" ON "ThirdParty"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingEvent_trainingNumber_key" ON "TrainingEvent"("trainingNumber");

-- AddForeignKey
ALTER TABLE "DisposalRecord" ADD CONSTRAINT "DisposalRecord_dataAssetId_fkey" FOREIGN KEY ("dataAssetId") REFERENCES "DataAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataQualityIssue" ADD CONSTRAINT "DataQualityIssue_dataAssetId_fkey" FOREIGN KEY ("dataAssetId") REFERENCES "DataAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThirdPartyAsset" ADD CONSTRAINT "ThirdPartyAsset_thirdPartyId_fkey" FOREIGN KEY ("thirdPartyId") REFERENCES "ThirdParty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThirdPartyAsset" ADD CONSTRAINT "ThirdPartyAsset_dataAssetId_fkey" FOREIGN KEY ("dataAssetId") REFERENCES "DataAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
