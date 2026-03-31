-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "almacenamiento" TEXT,
ADD COLUMN     "bateria" TEXT,
ALTER COLUMN "precioCompra" SET DEFAULT 0;
