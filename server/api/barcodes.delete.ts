// server/api/barcodes.delete.ts
import { defineEventHandler, getQuery, createError } from 'h3'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { id } = query
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID requis'
      })
    }
    
    const existingBarcode = await prisma.barcode.findUnique({
      where: { id: String(id) }
    })
    
    if (!existingBarcode) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Code-barre non trouvé'
      })
    }
    
    await prisma.barcode.delete({
      where: { id: String(id) }
    })
    
    return {
      success: true,
      message: 'Code-barre supprimé avec succès'
    }
    
  } catch (error) {
    console.error('Erreur lors de la suppression du code-barre:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur',
      data: { error: error instanceof Error ? error.message : 'Erreur inconnue' }
    })
  }
}) 