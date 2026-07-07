-- AlterTable
ALTER TABLE "tenants" ADD COLUMN "scalev_store_numeric_id" INTEGER,
ADD COLUMN "scalev_store_unique_id" TEXT,
ADD COLUMN "scalev_store_name" TEXT,
ADD COLUMN "scalev_storefront_api_key" TEXT,
ADD COLUMN "catalog_connected_at" TIMESTAMP(3),
ADD COLUMN "catalog_product_count" INTEGER;
