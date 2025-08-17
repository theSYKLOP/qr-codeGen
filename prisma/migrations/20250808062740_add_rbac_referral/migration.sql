/*
  Warnings:

  - A unique constraint covering the columns `[referralCodeId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "adminId" TEXT,
ADD COLUMN     "referralCodeId" TEXT;

-- CreateTable
CREATE TABLE "public"."RoleConfig" (
    "id" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "permissions" JSONB NOT NULL,
    "configuredById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoleConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReferralCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoleConfig_role_key" ON "public"."RoleConfig"("role");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralCode_code_key" ON "public"."ReferralCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "users_referralCodeId_key" ON "public"."users"("referralCodeId");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_referralCodeId_fkey" FOREIGN KEY ("referralCodeId") REFERENCES "public"."ReferralCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RoleConfig" ADD CONSTRAINT "RoleConfig_configuredById_fkey" FOREIGN KEY ("configuredById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReferralCode" ADD CONSTRAINT "ReferralCode_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
