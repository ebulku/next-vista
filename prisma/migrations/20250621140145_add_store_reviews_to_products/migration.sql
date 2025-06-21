-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "store" TEXT NOT NULL DEFAULT 'walmart';

-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "reviews" INTEGER,
ADD COLUMN     "store" TEXT NOT NULL DEFAULT 'walmart';
