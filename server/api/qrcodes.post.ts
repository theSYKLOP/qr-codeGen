// server/api/qrcodes.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../lib/prisma'

export default defineEventHandler(async (event) => {
    try {
      const body = await readBody(event)
      
      // Validation des données requises
      const requiredFields = ['typeProduit', 'nomProduit', 'franchise', 'prixVente', 'poids', 'unitePoids']
      for (const field of requiredFields) {
        if (!body[field]) {
          throw createError({
            statusCode: 400,
            statusMessage: `Le champ ${field} est requis`
          })
        }
      }
  
      // Validation des types
      if (isNaN(body.prixVente) || body.prixVente <= 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Le prix de vente doit être un nombre positif'
        })
      }
  
      if (isNaN(body.poids) || body.poids <= 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Le poids doit être un nombre positif'
        })
      }

      // Créer ou récupérer un utilisateur par défaut
      let defaultUser = await prisma.user.findFirst({
        where: { email: 'default@qr-generator.com' }
      })

      if (!defaultUser) {
        defaultUser = await prisma.user.create({
          data: {
            email: 'default@qr-generator.com',
            password: 'default-password-hash',
            nom: 'Utilisateur',
            prenom: 'Par défaut'
          }
        })
      }
  
      // Créer le QR code en base de données
      const qrCode = await prisma.qrCode.create({
        data: {
          typeProduit: body.typeProduit,
          nomProduit: body.nomProduit,
          franchise: body.franchise,
          prixVente: parseInt(body.prixVente),
          poids: parseFloat(body.poids),
          unitePoids: body.unitePoids,
          fournisseur: body.fournisseur || 'Non spécifié',
          codePng: body.codePng || '',
          userId: defaultUser.id
        },
        include: {
          user: {
            select: {
              nom: true,
              prenom: true,
              email: true
            }
          }
        }
      })
  
      return {
        success: true,
        message: 'QR Code créé avec succès',
        data: qrCode
      }
  
    } catch (error) {
      console.error('Erreur création QR Code:', error)
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur interne du serveur'
      })
    }
  })
  