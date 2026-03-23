-- AlterTable
ALTER TABLE "Restaurant"
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "serviceLabel" TEXT NOT NULL DEFAULT 'Entrega e retirada disponíveis';
