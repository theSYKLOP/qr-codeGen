#!/bin/bash

# 🔥 SCRIPT DE DÉPLOIEMENT VERCEL OPTIMISÉ
# Usage: ./scripts/deploy.sh

set -e

echo "🚀 Démarrage du déploiement Vercel..."

# Vérification des prérequis
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI non installé. Installation..."
    npm install -g vercel
fi

# Vérification de la configuration Prisma
echo "📋 Vérification de la configuration Prisma..."
if [ ! -f "prisma/schema.prisma" ]; then
    echo "❌ Fichier schema.prisma non trouvé"
    exit 1
fi

# Génération du client Prisma
echo "🔧 Génération du client Prisma..."
npx prisma generate

# Vérification des migrations
echo "📊 Vérification des migrations..."
npx prisma migrate status

# Déploiement sur Vercel
echo "🚀 Déploiement sur Vercel..."
vercel --prod

echo "✅ Déploiement terminé avec succès!"
echo "🌐 Votre application est maintenant en ligne sur Vercel" 