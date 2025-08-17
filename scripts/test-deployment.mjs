#!/usr/bin/env node
import { execSync } from 'node:child_process'

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' })
}

console.log('🧪 Tests de déploiement...')
try {
  run('npx prisma validate')
  run('npx prisma generate')
  run('npx nuxt build --dry-run')
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️ DATABASE_URL non définie')
  }
  run('npm run build')
  console.log('✅ Prêt pour le déploiement')
} catch (err) {
  console.error('❌ Échec des tests:', err?.message || err)
  process.exit(1)
}


