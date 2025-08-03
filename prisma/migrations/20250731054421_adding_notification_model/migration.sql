-- AlterTable
ALTER TABLE "Absence" ALTER COLUMN "status" SET DEFAULT 'present';

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverRole" "Role" NOT NULL DEFAULT 'HR',
    "leaveRequestId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unread',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_leaveRequestId_fkey" FOREIGN KEY ("leaveRequestId") REFERENCES "Leave"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
