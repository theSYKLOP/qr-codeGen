#!/usr/bin/env node
import { execSync } from 'node:child_process'

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' })
}

console.log('🚀 Déploiement Vercel...')
try {
  run('npx prisma generate')
  try { run('npx prisma migrate status') } catch {}
  run('npx vercel --prod')
  console.log('✅ Déploiement terminé avec succès!')
} catch (err) {
  console.error('❌ Échec du déploiement:', err?.message || err)
  process.exit(1)
}


