import prisma from '~/lib/prisma'
import jwt from 'jsonwebtoken'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { code } = body

    // Validation des données
    if (!code) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Code de vérification requis'
      })
    }

    // Vérifier le code 2FA
    if (!global.temp2FACodes) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Code de vérification expiré ou invalide'
      })
    }

    let userId: string | null = null
    let userEmail: string | null = null

    // Chercher l'utilisateur avec ce code
    for (const [id, data] of global.temp2FACodes.entries()) {
      if (data.code === code && data.expiresAt > Date.now()) {
        userId = id
        userEmail = data.email
        break
      }
    }

    if (!userId || !userEmail) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Code de vérification incorrect ou expiré'
      })
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utilisateur non trouvé'
      })
    }

    // Supprimer le code utilisé
    global.temp2FACodes.delete(userId)

    // Générer le token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    // Retourner les données utilisateur (sans le mot de passe)
    const userData = {
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    return {
      success: true,
      user: userData,
      token,
      message: 'Connexion réussie'
    }

  } catch (error: any) {
    console.error('Erreur de vérification 2FA:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
}) 