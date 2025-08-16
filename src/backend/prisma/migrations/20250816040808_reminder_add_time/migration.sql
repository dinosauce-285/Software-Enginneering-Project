-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "reminderTime" DROP NOT NULL,
ALTER COLUMN "reminderTime" SET DEFAULT '09:00',
ALTER COLUMN "reminderTime" SET DATA TYPE TEXT;
