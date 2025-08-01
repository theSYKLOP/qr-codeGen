-- Migration pour ajouter la colonne qrType
-- Optimisée pour Vercel et PostgreSQL

-- Ajout de la colonne qrType avec une valeur par défaut
ALTER TABLE "qr_codes" ADD COLUMN "qrType" TEXT NOT NULL DEFAULT 'raw';

-- Création d'un index pour optimiser les requêtes sur qrType
CREATE INDEX "idx_qr_codes_qr_type" ON "qr_codes"("qrType");

-- Commentaire pour documenter la migration
COMMENT ON COLUMN "qr_codes"."qrType" IS 'Type de QR code: raw ou result';
