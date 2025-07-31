#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Démarrage du déploiement Vercel...');

try {
  // 1. Générer le client Prisma
  console.log('📦 Génération du client Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // 2. Appliquer les migrations (avec gestion d'erreur)
  console.log('🗄️ Application des migrations...');
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Migrations appliquées avec succès');
  } catch (migrationError) {
    console.log('⚠️ Erreur lors des migrations, continuation...');
    console.log('Migration error:', migrationError.message);
  }
  
  // 3. Build de l'application
  console.log('🏗️ Build de l\'application...');
  execSync('npx nuxt build', { stdio: 'inherit' });
  
  console.log('✅ Déploiement terminé avec succès !');
  
} catch (error) {
  console.error('❌ Erreur lors du déploiement:', error.message);
  process.exit(1);
} 