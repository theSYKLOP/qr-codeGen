// server/api/qrcodes.put.ts
import { defineEventHandler, readBody, getQuery, createError } from 'h3'
import prisma from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const query = getQuery(event)
    
    // Validation de l'ID du QR code
    const qrCodeId = query.id as string
    if (!qrCodeId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'L\'ID du QR code est requis'
      })
    }

    // Vérifier que le QR code existe
    const existingQrCode = await prisma.qrCode.findUnique({
      where: { id: qrCodeId }
    })

    if (!existingQrCode) {
      throw createError({
        statusCode: 404,
        statusMessage: 'QR Code non trouvé'
      })
    }

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

    // Mettre à jour le QR code
    const updatedQrCode = await prisma.qrCode.update({
      where: { id: qrCodeId },
      data: {
        typeProduit: body.typeProduit,
        nomProduit: body.nomProduit,
        franchise: body.franchise,
        prixVente: parseInt(body.prixVente),
        poids: parseFloat(body.poids),
        unitePoids: body.unitePoids,
        fournisseur: body.fournisseur || 'Non spécifié',
        codePng: body.codePng || existingQrCode.codePng
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
      message: 'QR Code modifié avec succès',
      data: updatedQrCode
    }

  } catch (error) {
    console.error('Erreur modification QR Code:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
}) 