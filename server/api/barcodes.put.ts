// server/api/barcodes.put.ts
import { defineEventHandler, readBody, getQuery, createError } from 'h3'
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
    
    const body = await readBody(event)
    const { 
      nomProduit, 
      franchise, 
      reference,
      prixVente, 
      categorie,
      fournisseur,
      codePng
    } = body

    // Validation des champs requis
    if (!nomProduit || !franchise || !reference || !prixVente || !categorie) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tous les champs sont requis'
      })
    }

    // Vérifier que le code-barre existe
    const existingBarcode = await prisma.barcode.findUnique({
      where: { id: String(id) }
    })
    
    if (!existingBarcode) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Code-barre non trouvé'
      })
    }

    // Validation des types de données
    const prixVenteNum = parseInt(prixVente)
    
    if (isNaN(prixVenteNum) || prixVenteNum <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Prix de vente invalide'
      })
    }

    // Mettre à jour le code-barre
    const barcode = await prisma.barcode.update({
      where: { id: String(id) },
      data: {
        nomProduit,
        franchise,
        reference,
        prixVente: prixVenteNum,
        categorie,
        fournisseur,
        codePng
      },
      include: {
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true
          }
        }
      }
    })

    return {
      success: true,
      message: 'Code-barre modifié avec succès',
      barcode
    }

  } catch (error) {
    console.error('Erreur lors de la modification du code-barre:', error)
    
    if ((error as any).statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur',
      data: { error: error instanceof Error ? error.message : 'Erreur inconnue' }
    })
  }
}) 