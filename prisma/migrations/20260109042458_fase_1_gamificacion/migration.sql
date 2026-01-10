/*
  Warnings:

  - A unique constraint covering the columns `[specsId]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "specsId" TEXT;

-- CreateTable
CREATE TABLE "EspecificacionesTecnicas" (
    "id" TEXT NOT NULL,
    "camaraScore" INTEGER NOT NULL DEFAULT 50,
    "bateriaScore" INTEGER NOT NULL DEFAULT 50,
    "gamingScore" INTEGER NOT NULL DEFAULT 50,
    "resistencia" INTEGER NOT NULL DEFAULT 50,
    "procesador" TEXT,
    "screenHz" INTEGER DEFAULT 60,
    "screenType" TEXT,

    CONSTRAINT "EspecificacionesTecnicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_userId_productoId_key" ON "Wishlist"("userId", "productoId");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_specsId_key" ON "Producto"("specsId");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_specsId_fkey" FOREIGN KEY ("specsId") REFERENCES "EspecificacionesTecnicas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
