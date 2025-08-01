// server/api/barcodes.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { 
      nomProduit, 
      franchise, 
      reference,
      prixVente, 
      categorie,
      fournisseur = 'PROXI NOVA',
      codePng = '',
      userId: _userId 
    } = body

    // Validation des champs requis
    if (!nomProduit || !franchise || !reference || !prixVente || !categorie) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tous les champs sont requis',
        data: { 
          missing: [
            !nomProduit && 'nomProduit',
            !franchise && 'franchise',
            !reference && 'reference',
            !prixVente && 'prixVente',
            !categorie && 'categorie'
          ].filter(Boolean)
        }
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

    // Créer ou récupérer l'utilisateur par défaut
    let defaultUser = await prisma.user.findFirst({
      where: { email: 'default@qr-generator.com' },
      select: { id: true, nom: true, prenom: true, email: true }
    })
    
    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          email: 'default@qr-generator.com',
          password: 'default-password-hash',
          nom: 'Utilisateur',
          prenom: 'Par défaut'
        },
        select: { id: true, nom: true, prenom: true, email: true }
      })
    }

    // Créer le code-barre
    const barcode = await prisma.barcode.create({
      data: {
        nomProduit,
        franchise,
        reference,
        prixVente: prixVenteNum,
        categorie,
        fournisseur,
        codePng,
        userId: defaultUser.id
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
      message: 'Code-barre créé avec succès',
      barcode
    }

  } catch (error) {
    console.error('Erreur lors de la création du code-barre:', error)
    
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