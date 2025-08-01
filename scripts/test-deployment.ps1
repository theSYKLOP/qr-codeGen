# SCRIPT DE TEST DE DÉPLOIEMENT (PowerShell)
# Usage: .\scripts\test-deployment.ps1

Write-Host "Démarrage des tests de déploiement..." -ForegroundColor Green

# Vérification des prérequis
Write-Host "Vérification des prérequis..." -ForegroundColor Yellow

# Vérifier Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js non installé" -ForegroundColor Red
    exit 1
}

# Vérifier npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "npm non installé" -ForegroundColor Red
    exit 1
}

# Vérifier npx
if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
    Write-Host "npx non disponible" -ForegroundColor Red
    exit 1
}

Write-Host "Prérequis vérifiés" -ForegroundColor Green

# Test de la configuration Prisma
Write-Host "Test de la configuration Prisma..." -ForegroundColor Yellow
try {
    npx prisma validate
    Write-Host "Configuration Prisma valide" -ForegroundColor Green
} catch {
    Write-Host "Erreur dans la configuration Prisma" -ForegroundColor Red
    exit 1
}

# Test de génération du client Prisma
Write-Host "Test de génération du client Prisma..." -ForegroundColor Yellow
try {
    npx prisma generate
    Write-Host "Client Prisma généré" -ForegroundColor Green
} catch {
    Write-Host "Erreur lors de la génération du client Prisma" -ForegroundColor Red
    exit 1
}

# Test de la configuration Nuxt
Write-Host "Test de la configuration Nuxt..." -ForegroundColor Yellow
try {
    npx nuxt build --dry-run
    Write-Host "Configuration Nuxt valide" -ForegroundColor Green
} catch {
    Write-Host "Erreur dans la configuration Nuxt" -ForegroundColor Red
    exit 1
}

# Test des variables d'environnement
Write-Host "Test des variables d'environnement..." -ForegroundColor Yellow
$databaseUrl = $env:DATABASE_URL
if (-not $databaseUrl) {
    Write-Host "DATABASE_URL non définie" -ForegroundColor Yellow
    Write-Host "Ajoutez-la à votre fichier .env ou comme variable d'environnement" -ForegroundColor Yellow
} else {
    Write-Host "DATABASE_URL configurée" -ForegroundColor Green
}

# Test de connexion à la base de données (si DATABASE_URL est définie)
if ($databaseUrl) {
    Write-Host "Test de connexion à la base de données..." -ForegroundColor Yellow
    try {
        npx prisma db pull --force
        Write-Host "Connexion à la base de données réussie" -ForegroundColor Green
    } catch {
        Write-Host "Impossible de se connecter à la base de données" -ForegroundColor Yellow
        Write-Host "Vérifiez votre URL de connexion" -ForegroundColor Yellow
    }
}

# Test de build complet
Write-Host "Test de build complet..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "Build réussi" -ForegroundColor Green
} catch {
    Write-Host "Erreur lors du build" -ForegroundColor Red
    exit 1
}

Write-Host "Tous les tests sont passés!" -ForegroundColor Green
Write-Host "Votre application est prête pour le déploiement sur Vercel" -ForegroundColor Green 