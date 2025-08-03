/*
  Warnings:

  - You are about to drop the column `leaveDate` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `leaveRequestId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `originalDate` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `ScheduleChangeRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_leaveRequestId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleChangeRequest" DROP CONSTRAINT "ScheduleChangeRequest_scheduleId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "leaveDate",
DROP COLUMN "leaveRequestId",
DROP COLUMN "originalDate",
ADD COLUMN     "leaveId" INTEGER,
ADD COLUMN     "relatedDate" TIMESTAMP(3),
ALTER COLUMN "scheduleId" DROP NOT NULL;

-- DropTable
DROP TABLE "ScheduleChangeRequest";

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_leaveId_fkey" FOREIGN KEY ("leaveId") REFERENCES "Leave"("id") ON DELETE SET NULL ON UPDATE CASCADE;
