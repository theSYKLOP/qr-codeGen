import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding...')

  // Vider la base de données (ordre pour respecter les FK)
  console.log('🧹 Nettoyage de la base de données...')
  try { await prisma.barcode.deleteMany() } catch { /* ignore */ }
  try { await prisma.qrCode.deleteMany() } catch { /* ignore */ }
  try { await prisma.referralCode.deleteMany() } catch { /* ignore */ }
  try { await prisma.user.deleteMany() } catch { /* ignore */ }

  // Hash des mots de passe
  const adminPassword = await bcrypt.hash('admin123', 12)
  const moderateurPassword = await bcrypt.hash('mod123', 12)
  const userPassword = await bcrypt.hash('user123', 12)

  // Créer le compte admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@qr-add.com',
      password: adminPassword,
      nom: 'Administrateur',
      prenom: 'QR-Add',
      role: 'ADMIN',
      isActive: true,
      a2f: false // Admin sans 2FA
    }
  })

  console.log('✅ Compte admin créé avec succès:')
  console.log(`   Email: ${admin.email}`)
  console.log(`   Nom: ${admin.nom} ${admin.prenom}`)
  console.log(`   Rôle: ${admin.role}`)
  console.log(`   Actif: ${admin.isActive}`)
  console.log(`   2FA: ${admin.a2f ? 'Activé' : 'Désactivé'}`)
  console.log('   Mot de passe: admin123')

  // Codes de parrainage générés par l'admin (un code par compte à parrainer)
  const refMod = await prisma.referralCode.create({
    data: { code: 'REF-MOD-2025', adminId: admin.id }
  })
  const refUser = await prisma.referralCode.create({
    data: { code: 'REF-USER-2025', adminId: admin.id }
  })

  // Créer le compte modérateur (a2f: false) et le lier à l'admin + code de parrainage
  const moderateur = await prisma.user.create({
    data: {
      email: 'moderateur@qr-add.com',
      password: moderateurPassword,
      nom: 'Modérateur',
      prenom: 'QR-Add',
      role: 'MODERATEUR',
      isActive: true,
      a2f: false,
      adminId: admin.id,
      referralCodeId: refMod.id
    }
  })
  await prisma.referralCode.update({
    where: { id: refMod.id },
    data: { usedByUser: { connect: { id: moderateur.id } }, usedAt: new Date() }
  })

  console.log('✅ Compte modérateur créé avec succès:')
  console.log(`   Email: ${moderateur.email}`)
  console.log(`   Nom: ${moderateur.nom} ${moderateur.prenom}`)
  console.log(`   Rôle: ${moderateur.role}`)
  console.log(`   Actif: ${moderateur.isActive}`)
  console.log(`   2FA: ${moderateur.a2f ? 'Activé' : 'Désactivé'}`)
  console.log('   Mot de passe: mod123')
  console.log(`   Code de parrainage utilisé: ${refMod.code}`)

  // Créer un seul utilisateur (a2f: false) et le lier à l'admin + code de parrainage
  const user = await prisma.user.create({
    data: {
      email: 'user@qr-add.com',
      password: userPassword,
      nom: 'Utilisateur',
      prenom: 'QR-Add',
      role: 'USER',
      isActive: true,
      a2f: false,
      adminId: admin.id,
      referralCodeId: refUser.id
    }
  })
  await prisma.referralCode.update({
    where: { id: refUser.id },
    data: { usedByUser: { connect: { id: user.id } }, usedAt: new Date() }
  })
  console.log(`✅ Utilisateur créé: ${user.email} (${user.role})`)
  console.log(`   Code de parrainage utilisé: ${refUser.code}`)

  console.log('\n🎉 Seeding terminé avec succès!')
  console.log('\n📋 Comptes créés:')
  console.log('   👑 Admin: admin@qr-add.com / admin123')
  console.log('   🔧 Modérateur: moderateur@qr-add.com / mod123')
  console.log('   👤 User: user@qr-add.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 