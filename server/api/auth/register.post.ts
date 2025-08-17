import prisma from '~/lib/prisma'
import { defineEventHandler, readBody, createError } from 'h3'
import bcrypt from 'bcryptjs'

// utilisation du client unique de ~/lib/prisma

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { prenom, nom, email, password, referralCode } = body

    // Validation des données
    if (!prenom || !nom || !email || !password || !referralCode) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tous les champs sont requis (code de parrainage inclus)'
      })
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Format d\'email invalide'
      })
    }

    // Validation du mot de passe
    if (password.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le mot de passe doit contenir au moins 8 caractères'
      })
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Un compte avec cet email existe déjà'
      })
    }

    // Hasher le mot de passe
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Code de parrainage obligatoire et valide
    const ref = await (prisma as any).referralCode.findUnique({ where: { code: referralCode } })
    if (!ref) {
      throw createError({ statusCode: 400, statusMessage: 'Code de parrainage introuvable' })
    }
    if (ref.usedByUserId) {
      throw createError({ statusCode: 400, statusMessage: 'Code de parrainage déjà utilisé' })
    }
    if (ref.expiresAt && new Date(ref.expiresAt) < new Date()) {
      throw createError({ statusCode: 400, statusMessage: 'Code de parrainage expiré' })
    }
    const adminId: string | null = ref.adminId
    const referralCodeId: string | null = ref.id

    // Créer l'utilisateur
    const newUser = await (prisma as any).user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        prenom,
        nom,
        role: 'USER',
        isActive: false,
        adminId,
        referralCodeId
      }
    })

    // Marquer le code comme utilisé
    await (prisma as any).referralCode.update({
      where: { id: referralCodeId },
      data: { usedByUser: { connect: { id: newUser.id } }, usedAt: new Date() }
    })

    // Envoyer un email de vérification (simulation)
    console.log(`Nouveau compte créé pour ${email}`)
    console.log(`Email de vérification envoyé à ${email}`)
    
    // En production, utilisez un service d'email
    // await sendVerificationEmail({
    //   to: email,
    //   userId: newUser.id,
    //   verificationToken: verificationToken
    // })

    return {
      success: true,
      message: 'Compte créé avec succès. Veuillez vérifier votre email pour activer votre compte.'
    }

  } catch (error: any) {
    console.error('Erreur d\'inscription:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
}) 