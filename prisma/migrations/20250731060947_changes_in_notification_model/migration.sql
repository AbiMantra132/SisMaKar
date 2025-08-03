-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "originalDate" TIMESTAMP(3),
ADD COLUMN     "replacementDate" TIMESTAMP(3),
ADD COLUMN     "shiftEnd" TIMESTAMP(3),
ADD COLUMN     "shiftStart" TIMESTAMP(3);
