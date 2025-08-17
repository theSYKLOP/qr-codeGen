import prisma from '~/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { defineEventHandler, readBody, createError } from 'h3'

// client importé depuis ~/lib/prisma

// Déclaration globale pour TypeScript
declare global {
  var temp2FACodes: Map<string, {
    code: string
    email: string
    expiresAt: number
  }> | undefined
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    // Validation des données
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email et mot de passe requis'
      })
    }

    // Rechercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Email ou mot de passe incorrect'
      })
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Email ou mot de passe incorrect'
      })
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Compte non vérifié. Veuillez vérifier votre email.'
      })
    }

    // Vérifier si l'utilisateur a activé la 2FA
    if (user.a2f) {
      // Générer un code 2FA
      const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString()
      
      // Stocker le code temporairement (en production, utilisez Redis ou similaire)
      // Pour cet exemple, on simule avec une variable globale
      if (!global.temp2FACodes) {
        global.temp2FACodes = new Map()
      }
      
      global.temp2FACodes.set(user.id, {
        code: twoFactorCode,
        email: user.email,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
      })

      // Envoyer le code par email (simulation)
      console.log(`Code 2FA pour ${user.email}: ${twoFactorCode}`)
      
      // En production, utilisez un service d'email comme SendGrid, Mailgun, etc.
      // await sendEmail({
      //   to: user.email,
      //   subject: 'Code de vérification QR-Add',
      //   html: `Votre code de vérification est: ${twoFactorCode}`
      // })

      return {
        success: true,
        requires2FA: true,
        a2f: true,
        message: 'Code de vérification envoyé à votre email'
      }
    } else {
      // Connexion directe sans 2FA → générer un vrai JWT pour la cohérence
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      )

      return {
        success: true,
        requires2FA: false,
        a2f: false,
        user: {
          id: user.id,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          role: user.role,
          isActive: user.isActive,
          a2f: user.a2f
        },
        token,
        message: 'Connexion réussie'
      }
    }

  } catch (error: unknown) {
    console.error('Erreur de connexion:', error)
    
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
}) 