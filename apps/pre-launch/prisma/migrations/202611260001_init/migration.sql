-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "SubscriberStatus" AS ENUM ('PENDING', 'ACTIVE', 'UNSUBSCRIBED', 'DELETION_PENDING');

-- CreateEnum
CREATE TYPE "ConsentKind" AS ENUM ('GRANTED', 'VERIFIED', 'REVOKED');

-- CreateEnum
CREATE TYPE "TokenPurpose" AS ENUM ('VERIFY', 'UNSUBSCRIBE', 'PRIVACY');

-- CreateEnum
CREATE TYPE "MailKind" AS ENUM ('VERIFY', 'CONFIRM', 'PRIVACY', 'TEST', 'LAUNCH');

-- CreateEnum
CREATE TYPE "WorkState" AS ENUM ('QUEUED', 'LEASED', 'RETRY', 'ACCEPTED', 'DELIVERED', 'DELAYED', 'BOUNCED', 'COMPLAINED', 'FAILED', 'SKIPPED', 'CANCELED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "CampaignState" AS ENUM ('DRAFT', 'APPROVED', 'MATERIALIZING', 'RUNNING', 'COMPLETED', 'PAUSED', 'CANCELED');

-- CreateEnum
CREATE TYPE "GrantRole" AS ENUM ('OPERATOR', 'OWNER');

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" UUID NOT NULL,
    "lookup" TEXT NOT NULL,
    "ciphertext" TEXT NOT NULL,
    "status" "SubscriberStatus" NOT NULL DEFAULT 'PENDING',
    "generation" INTEGER NOT NULL DEFAULT 1,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "verifiedAt" TIMESTAMP(3),
    "verifiedEpoch" INTEGER,
    "unsubscribedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentEvent" (
    "id" UUID NOT NULL,
    "subscriberId" UUID NOT NULL,
    "generation" INTEGER NOT NULL,
    "kind" "ConsentKind" NOT NULL,
    "version" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailToken" (
    "selector" TEXT NOT NULL,
    "subscriberId" UUID NOT NULL,
    "generation" INTEGER NOT NULL,
    "purpose" "TokenPurpose" NOT NULL,
    "digest" TEXT NOT NULL,
    "keyVersion" INTEGER NOT NULL DEFAULT 1,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "consumedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "EmailToken_pkey" PRIMARY KEY ("selector")
);

-- CreateTable
CREATE TABLE "Suppression" (
    "lookup" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "provenance" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Suppression_pkey" PRIMARY KEY ("lookup","reason")
);

-- CreateTable
CREATE TABLE "EnrollmentEpoch" (
    "id" INTEGER NOT NULL,
    "epoch" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EnrollmentEpoch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "state" "CampaignState" NOT NULL DEFAULT 'DRAFT',
    "activeRevisionId" UUID,
    "cutoffEpoch" INTEGER,
    "recipientCap" INTEGER,
    "remaining" INTEGER,
    "cursor" UUID,
    "materialized" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignRevision" (
    "id" UUID NOT NULL,
    "campaignId" UUID NOT NULL,
    "number" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "bodyVersion" TEXT NOT NULL,
    "launchUrl" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "digest" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "previewedAt" TIMESTAMP(3),

    CONSTRAINT "CampaignRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approval" (
    "campaignId" UUID NOT NULL,
    "revisionId" UUID NOT NULL,
    "actor" TEXT NOT NULL,
    "digest" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "maxRecipients" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("campaignId")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" UUID NOT NULL,
    "logicalKey" TEXT NOT NULL,
    "kind" "MailKind" NOT NULL,
    "subscriberId" UUID,
    "generation" INTEGER,
    "campaignId" UUID,
    "revisionId" UUID,
    "tokenSelector" TEXT,
    "testRecipientId" TEXT,
    "providerId" TEXT,
    "state" "WorkState" NOT NULL DEFAULT 'QUEUED',
    "firstSubmission" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" UUID NOT NULL,
    "deliveryId" UUID NOT NULL,
    "state" "WorkState" NOT NULL DEFAULT 'QUEUED',
    "runAfter" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leaseToken" UUID,
    "leaseUntil" TIMESTAMP(3),
    "attemptLimit" INTEGER NOT NULL DEFAULT 6,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryAttempt" (
    "jobId" UUID NOT NULL,
    "number" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "outcome" TEXT,

    CONSTRAINT "DeliveryAttempt_pkey" PRIMARY KEY ("jobId","number")
);

-- CreateTable
CREATE TABLE "WebhookReceipt" (
    "provider" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "eventTime" TIMESTAMP(3) NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "WebhookReceipt_pkey" PRIMARY KEY ("provider","eventId")
);

-- CreateTable
CREATE TABLE "OperatorGrant" (
    "issuer" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "role" "GrantRole" NOT NULL,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "OperatorGrant_pkey" PRIMARY KEY ("issuer","subject")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" UUID NOT NULL,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "requestDigest" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateBucket" (
    "scope" TEXT NOT NULL,
    "identity" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "RateBucket_pkey" PRIMARY KEY ("scope","identity","start")
);

-- CreateTable
CREATE TABLE "PrivacyRequest" (
    "id" UUID NOT NULL,
    "supportReference" TEXT NOT NULL,
    "subscriberId" UUID,
    "tokenSelector" TEXT,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "PrivacyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapturedMail" (
    "deliveryId" UUID NOT NULL,
    "sealed" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CapturedMail_pkey" PRIMARY KEY ("deliveryId")
);

-- CreateTable
CREATE TABLE "RecoveryEvent" (
    "id" UUID NOT NULL,
    "lookup" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exportedAt" TIMESTAMP(3),

    CONSTRAINT "RecoveryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkerLease" (
    "id" TEXT NOT NULL,
    "token" UUID NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkerLease_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_lookup_key" ON "Subscriber"("lookup");

-- CreateIndex
CREATE INDEX "Subscriber_status_verifiedAt_id_idx" ON "Subscriber"("status", "verifiedAt", "id");

-- CreateIndex
CREATE UNIQUE INDEX "ConsentEvent_subscriberId_generation_kind_key" ON "ConsentEvent"("subscriberId", "generation", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "EmailToken_digest_key" ON "EmailToken"("digest");

-- CreateIndex
CREATE INDEX "EmailToken_subscriberId_generation_purpose_idx" ON "EmailToken"("subscriberId", "generation", "purpose");

-- CreateIndex
CREATE INDEX "EmailToken_expiresAt_idx" ON "EmailToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_key_key" ON "Campaign"("key");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignRevision_campaignId_number_key" ON "CampaignRevision"("campaignId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Approval_revisionId_key" ON "Approval"("revisionId");

-- CreateIndex
CREATE UNIQUE INDEX "Approval_key_key" ON "Approval"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_logicalKey_key" ON "Delivery"("logicalKey");

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_providerId_key" ON "Delivery"("providerId");

-- CreateIndex
CREATE INDEX "Delivery_campaignId_state_idx" ON "Delivery"("campaignId", "state");

-- CreateIndex
CREATE INDEX "Delivery_subscriberId_generation_idx" ON "Delivery"("subscriberId", "generation");

-- CreateIndex
CREATE UNIQUE INDEX "Job_deliveryId_key" ON "Job"("deliveryId");

-- CreateIndex
CREATE INDEX "Job_state_runAfter_idx" ON "Job"("state", "runAfter");

-- CreateIndex
CREATE INDEX "WebhookReceipt_messageId_processedAt_idx" ON "WebhookReceipt"("messageId", "processedAt");

-- CreateIndex
CREATE INDEX "AuditEvent_createdAt_idx" ON "AuditEvent"("createdAt");

-- CreateIndex
CREATE INDEX "RateBucket_expires_idx" ON "RateBucket"("expires");

-- CreateIndex
CREATE UNIQUE INDEX "PrivacyRequest_supportReference_key" ON "PrivacyRequest"("supportReference");

-- CreateIndex
CREATE UNIQUE INDEX "PrivacyRequest_tokenSelector_key" ON "PrivacyRequest"("tokenSelector");

-- AddForeignKey
ALTER TABLE "ConsentEvent" ADD CONSTRAINT "ConsentEvent_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "Subscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailToken" ADD CONSTRAINT "EmailToken_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "Subscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignRevision" ADD CONSTRAINT "CampaignRevision_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "CampaignRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "Subscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "CampaignRevision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_tokenSelector_fkey" FOREIGN KEY ("tokenSelector") REFERENCES "EmailToken"("selector") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryAttempt" ADD CONSTRAINT "DeliveryAttempt_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivacyRequest" ADD CONSTRAINT "PrivacyRequest_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "Subscriber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivacyRequest" ADD CONSTRAINT "PrivacyRequest_tokenSelector_fkey" FOREIGN KEY ("tokenSelector") REFERENCES "EmailToken"("selector") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapturedMail" ADD CONSTRAINT "CapturedMail_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Initialize the single transactional enrollment boundary.
INSERT INTO "EnrollmentEpoch" ("id","epoch") VALUES (1,0);
ALTER TABLE "EnrollmentEpoch" ADD CONSTRAINT "enrollment_singleton" CHECK ("id"=1 AND "epoch">=0);
ALTER TABLE "Subscriber" ADD CONSTRAINT "subscriber_generation_positive" CHECK ("generation">0);
ALTER TABLE "Subscriber" ADD CONSTRAINT "active_subscriber_verified" CHECK ("status"<>'ACTIVE' OR ("verifiedAt" IS NOT NULL AND "verifiedEpoch" IS NOT NULL));
ALTER TABLE "Approval" ADD CONSTRAINT "approval_recipient_cap" CHECK ("maxRecipients">0);
ALTER TABLE "Job" ADD CONSTRAINT "job_lease_fence" CHECK (("state"='LEASED') = ("leaseToken" IS NOT NULL AND "leaseUntil" IS NOT NULL));
CREATE UNIQUE INDEX "one_current_verification" ON "EmailToken" ("subscriberId","generation","purpose") WHERE "purpose"='VERIFY' AND "revokedAt" IS NULL AND "consumedAt" IS NULL;
CREATE UNIQUE INDEX "one_campaign_launch_per_subscriber" ON "Delivery" ("campaignId","subscriberId") WHERE "kind"='LAUNCH';
CREATE INDEX "job_due" ON "Job" ("runAfter","id") WHERE "state" IN ('QUEUED','RETRY');
CREATE INDEX "job_expired_lease" ON "Job" ("leaseUntil","id") WHERE "state"='LEASED';
