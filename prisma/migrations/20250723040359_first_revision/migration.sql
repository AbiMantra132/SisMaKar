/*
  Warnings:

  - The values [HEADS] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `salary` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Job` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobApplication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Paycheck` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recruitment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `task` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `jobDescription` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `managerId` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('EMPLOYEE', 'HR', 'ADMIN', 'HEAD');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'EMPLOYEE';
COMMIT;

-- DropForeignKey
ALTER TABLE "JobApplication" DROP CONSTRAINT "JobApplication_jobId_fkey";

-- DropForeignKey
ALTER TABLE "Paycheck" DROP CONSTRAINT "Paycheck_userId_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_assignedTo_fkey";

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "jobDescription" TEXT NOT NULL,
ADD COLUMN     "managerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "salary";

-- DropTable
DROP TABLE "Job";

-- DropTable
DROP TABLE "JobApplication";

-- DropTable
DROP TABLE "Paycheck";

-- DropTable
DROP TABLE "Recruitment";

-- DropTable
DROP TABLE "task";

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "assignedTo" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleChangeRequest" (
    "id" SERIAL NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "requestReason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduleChangeRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
