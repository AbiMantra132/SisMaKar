-- AlterTable
ALTER TABLE "Absence" ADD COLUMN     "isLeave" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "reason" SET DEFAULT '';

-- CreateTable
CREATE TABLE "Leave" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "leaveAmmount" INTEGER NOT NULL DEFAULT 12,
    "leaveTotal" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Leave_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Leave" ADD CONSTRAINT "Leave_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
