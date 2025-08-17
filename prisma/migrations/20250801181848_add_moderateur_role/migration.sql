-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'MODERATEUR';

-- DropIndex
DROP INDEX "public"."idx_qr_codes_qr_type";

-- CreateTable
CREATE TABLE "public"."barcodes" (
    "id" TEXT NOT NULL,
    "nomProduit" TEXT NOT NULL,
    "franchise" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "prixVente" INTEGER NOT NULL,
    "categorie" TEXT NOT NULL,
    "fournisseur" TEXT NOT NULL,
    "codePng" TEXT NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "barcodes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."barcodes" ADD CONSTRAINT "barcodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
