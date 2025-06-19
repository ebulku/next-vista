-- CreateTable
CREATE TABLE "Seller" (
    "id" BIGSERIAL NOT NULL,
    "seller_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "status_id" INTEGER NOT NULL,
    "price" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSellers" (
    "product_id" BIGINT NOT NULL,
    "seller_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductSellers_pkey" PRIMARY KEY ("product_id","seller_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seller_seller_id_key" ON "Seller"("seller_id");

-- CreateIndex
CREATE UNIQUE INDEX "Product_product_id_key" ON "Product"("product_id");

-- AddForeignKey
ALTER TABLE "ProductSellers" ADD CONSTRAINT "ProductSellers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSellers" ADD CONSTRAINT "ProductSellers_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "Seller"("seller_id") ON DELETE RESTRICT ON UPDATE CASCADE;
