/*
  Warnings:

  - You are about to drop the column `frequency` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Reminder` table. All the data in the column will be lost.
  - Added the required column `content` to the `Reminder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Reminder" DROP COLUMN "frequency",
DROP COLUMN "isActive",
DROP COLUMN "message",
DROP COLUMN "time",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "emailNotificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "reminderTime" INTEGER NOT NULL DEFAULT 9;
