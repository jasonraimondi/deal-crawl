-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "brand" TEXT,
    "description" TEXT,
    "price_sale" INTEGER NOT NULL,
    "price_original" INTEGER NOT NULL,
    "discount_cents" INTEGER NOT NULL,
    "percent_off" SMALLINT NOT NULL,
    "sale_date" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_sale_date_title_brand_idx" ON "Product"("sale_date", "title", "brand");
