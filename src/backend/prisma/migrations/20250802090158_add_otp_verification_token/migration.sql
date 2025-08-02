/*
  Warnings:

  - A unique constraint covering the columns `[otpVerificationToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otpVerificationToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_otpVerificationToken_key" ON "User"("otpVerificationToken");
