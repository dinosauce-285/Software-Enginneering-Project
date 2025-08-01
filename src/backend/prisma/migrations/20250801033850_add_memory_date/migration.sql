/*
  Warnings:

  - Added the required column `memoryDate` to the `Memory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Memory" ADD COLUMN     "memoryDate" TIMESTAMP(3) NOT NULL;
