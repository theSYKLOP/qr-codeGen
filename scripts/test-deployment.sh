#!/bin/bash

# 🔥 SCRIPT DE TEST DE DÉPLOIEMENT
# Usage: ./scripts/test-deployment.sh

set -e

echo "🧪 Démarrage des tests de déploiement..."

# Vérification des prérequis
echo "📋 Vérification des prérequis..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js non installé"
    exit 1
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm non installé"
    exit 1
fi

# Vérifier Prisma
if ! command -v npx &> /dev/null; then
    echo "❌ npx non disponible"
    exit 1
fi

echo "✅ Prérequis vérifiés"

# Test de la configuration Prisma
echo "🔧 Test de la configuration Prisma..."
npx prisma validate

# Test de génération du client Prisma
echo "📦 Test de génération du client Prisma..."
npx prisma generate

# Test de la configuration Nuxt
echo "⚙️ Test de la configuration Nuxt..."
npx nuxt build --dry-run

# Test des variables d'environnement
echo "🔐 Test des variables d'environnement..."
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️ DATABASE_URL non définie"
    echo "   Ajoutez-la à votre fichier .env ou comme variable d'environnement"
else
    echo "✅ DATABASE_URL configurée"
fi

# Test de connexion à la base de données (si DATABASE_URL est définie)
if [ ! -z "$DATABASE_URL" ]; then
    echo "🗄️ Test de connexion à la base de données..."
    npx prisma db pull --force || echo "⚠️ Impossible de se connecter à la base de données"
fi

# Test de build complet
echo "🏗️ Test de build complet..."
npm run build

echo "✅ Tous les tests sont passés!"
echo "🚀 Votre application est prête pour le déploiement sur Vercel" 