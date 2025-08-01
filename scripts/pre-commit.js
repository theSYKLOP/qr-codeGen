#!/usr/bin/env node

/**
 * Script de vérification rapide pour les hooks pre-commit
 * Vérifie uniquement les éléments essentiels sans faire un build complet
 */

import { execSync } from 'child_process';

console.log('🔍 Vérifications pré-commit...');

try {
  // 1. Vérifier que le schema Prisma est valide
  console.log('📋 Vérification du schema Prisma...');
  execSync('npx prisma validate', { stdio: 'inherit' });
  console.log('✅ Schema Prisma valide');

  // 2. Générer le client Prisma (rapide)
  console.log('🔧 Génération du client Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Client Prisma généré');

  // 3. Vérifier la syntaxe TypeScript (rapide)
  console.log('⚙️ Vérification TypeScript...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript valide');

  console.log('✅ Toutes les vérifications pré-commit sont passées !');
  process.exit(0);

} catch (error) {
  console.error('❌ Erreur lors des vérifications pré-commit:', error.message);
  process.exit(1);
} 