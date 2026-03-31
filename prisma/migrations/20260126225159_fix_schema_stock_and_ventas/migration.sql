/*
  Warnings:

  - A unique constraint covering the columns `[imei]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Venta_productoId_key";

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "imei" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Producto_imei_key" ON "Producto"("imei");
