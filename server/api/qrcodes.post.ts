// server/api/qrcodes.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../prisma.js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { 
      typeProduit, 
      nomProduit, 
      franchise, 
      prixVente, 
      poids, 
      unitePoids, 
      fournisseur = 'Non spécifié',
      qrType = 'raw',
      codePng = '',
      userId 
    } = body

    // Validation des champs requis
    if (!typeProduit || !nomProduit || !franchise || !prixVente || !poids || !unitePoids) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tous les champs sont requis'
      })
    }

    const qrCode = await prisma.qrCode.create({
      data: {
        typeProduit,
        nomProduit,
        franchise,
        prixVente: parseInt(prixVente),
        poids: parseFloat(poids),
        unitePoids,
        fournisseur,
        qrType,
        codePng,
        userId: userId || 'default-user-id'
      }
    })

    return qrCode
  } catch (error) {
    console.error('Erreur lors de la création du QR code:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur'
    })
  }
})
  