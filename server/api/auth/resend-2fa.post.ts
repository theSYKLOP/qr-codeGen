import { PrismaClient } from '@prisma/client'
import { defineEventHandler, getHeader, createError } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Récupérer le token depuis les headers
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token d\'authentification requis'
      })
    }

    const token = authHeader.substring(7)
    
    // En production, vérifiez le token JWT ici
    // const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Pour cet exemple, on simule la récupération de l'utilisateur
    // En production, utilisez le token pour identifier l'utilisateur
    const user = await prisma.user.findFirst()
    
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utilisateur non trouvé'
      })
    }

    // Générer un nouveau code 2FA
    const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Stocker le nouveau code
    if (!global.temp2FACodes) {
      global.temp2FACodes = new Map()
    }
    
    global.temp2FACodes.set(user.id, {
      code: twoFactorCode,
      email: user.email,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    })

    // Envoyer le nouveau code par email (simulation)
    console.log(`Nouveau code 2FA pour ${user.email}: ${twoFactorCode}`)
    
    // En production, utilisez un service d'email
    // await sendEmail({
    //   to: user.email,
    //   subject: 'Nouveau code de vérification QR-Add',
    //   html: `Votre nouveau code de vérification est: ${twoFactorCode}`
    // })

    return {
      success: true,
      message: 'Nouveau code envoyé à votre email'
    }

  } catch (error: any) {
    console.error('Erreur d\'envoi du code 2FA:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
}) 