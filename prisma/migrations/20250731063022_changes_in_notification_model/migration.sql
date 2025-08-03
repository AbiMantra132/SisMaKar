/*
  Warnings:

  - Added the required column `scheduleId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "leaveDate" TIMESTAMP(3),
ADD COLUMN     "receiverId" INTEGER,
ADD COLUMN     "scheduleId" INTEGER NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'schedule change';
