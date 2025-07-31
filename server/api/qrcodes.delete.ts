// server/api/qrcodes.delete.ts
import { defineEventHandler, getQuery, createError } from 'h3'
import prisma from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
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

    // Supprimer le QR code
    await prisma.qrCode.delete({
      where: { id: qrCodeId }
    })

    return {
      success: true,
      message: 'QR Code supprimé avec succès'
    }

  } catch (error) {
    console.error('Erreur suppression QR Code:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
}) 