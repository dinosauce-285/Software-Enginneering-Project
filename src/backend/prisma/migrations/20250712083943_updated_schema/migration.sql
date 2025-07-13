/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Emotion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `ShareLink` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `type` on the `Media` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updated_at` to the `Memory` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `frequency` on the `Reminder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `access_level` on the `ShareLink` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'AUDIO', 'VIDEO');

-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "ReminderFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'ONCE');

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_memoryID_fkey";

-- DropForeignKey
ALTER TABLE "Memory" DROP CONSTRAINT "Memory_userID_fkey";

-- DropForeignKey
ALTER TABLE "MemoryTag" DROP CONSTRAINT "MemoryTag_memoryID_fkey";

-- DropForeignKey
ALTER TABLE "MemoryTag" DROP CONSTRAINT "MemoryTag_tagID_fkey";

-- DropForeignKey
ALTER TABLE "Reminder" DROP CONSTRAINT "Reminder_userID_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_userID_fkey";

-- DropForeignKey
ALTER TABLE "ShareLink" DROP CONSTRAINT "ShareLink_memoryID_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "type",
ADD COLUMN     "type" "MediaType" NOT NULL;

-- AlterTable
ALTER TABLE "Memory" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "frequency",
ADD COLUMN     "frequency" "ReminderFrequency" NOT NULL;

-- AlterTable
ALTER TABLE "ShareLink" DROP COLUMN "access_level",
ADD COLUMN     "access_level" "AccessLevel" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Emotion_name_key" ON "Emotion"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ShareLink_url_key" ON "ShareLink"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_memoryID_fkey" FOREIGN KEY ("memoryID") REFERENCES "Memory"("memoryID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareLink" ADD CONSTRAINT "ShareLink_memoryID_fkey" FOREIGN KEY ("memoryID") REFERENCES "Memory"("memoryID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryTag" ADD CONSTRAINT "MemoryTag_memoryID_fkey" FOREIGN KEY ("memoryID") REFERENCES "Memory"("memoryID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryTag" ADD CONSTRAINT "MemoryTag_tagID_fkey" FOREIGN KEY ("tagID") REFERENCES "Tag"("tagID") ON DELETE CASCADE ON UPDATE CASCADE;
