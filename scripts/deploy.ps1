# 🔥 SCRIPT DE DÉPLOIEMENT VERCEL OPTIMISÉ (PowerShell)
# Usage: .\scripts\deploy.ps1

param(
    [switch]$Force
)

Write-Host "🚀 Démarrage du déploiement Vercel..." -ForegroundColor Green

# Vérification des prérequis
Write-Host "📋 Vérification des prérequis..." -ForegroundColor Yellow

# Vérifier Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js non installé" -ForegroundColor Red
    exit 1
}

# Vérifier npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm non installé" -ForegroundColor Red
    exit 1
}

# Vérifier Vercel CLI
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI non installé. Installation..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "✅ Prérequis vérifiés" -ForegroundColor Green

# Vérification de la configuration Prisma
Write-Host "📋 Vérification de la configuration Prisma..." -ForegroundColor Yellow
if (-not (Test-Path "prisma/schema.prisma")) {
    Write-Host "❌ Fichier schema.prisma non trouvé" -ForegroundColor Red
    exit 1
}

# Génération du client Prisma
Write-Host "🔧 Génération du client Prisma..." -ForegroundColor Yellow
try {
    npx prisma generate
    Write-Host "✅ Client Prisma généré" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de la génération du client Prisma" -ForegroundColor Red
    exit 1
}

# Vérification des migrations
Write-Host "📊 Vérification des migrations..." -ForegroundColor Yellow
try {
    npx prisma migrate status
    Write-Host "✅ Migrations vérifiées" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Erreur lors de la vérification des migrations" -ForegroundColor Yellow
}

# Déploiement sur Vercel
Write-Host "🚀 Déploiement sur Vercel..." -ForegroundColor Yellow
try {
    if ($Force) {
        vercel --prod --force
    } else {
        vercel --prod
    }
    Write-Host "✅ Déploiement terminé avec succès!" -ForegroundColor Green
    Write-Host "🌐 Votre application est maintenant en ligne sur Vercel" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors du déploiement" -ForegroundColor Red
    Write-Host "💡 Essayez avec -Force pour forcer le déploiement" -ForegroundColor Yellow
    exit 1
} 