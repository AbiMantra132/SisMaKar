-- CreateTable
CREATE TABLE "Barcode" (
    "id" SERIAL NOT NULL,
    "barcode" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "absenceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Barcode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Barcode_barcode_key" ON "Barcode"("barcode");

-- AddForeignKey
ALTER TABLE "Barcode" ADD CONSTRAINT "Barcode_absenceId_fkey" FOREIGN KEY ("absenceId") REFERENCES "Absence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
