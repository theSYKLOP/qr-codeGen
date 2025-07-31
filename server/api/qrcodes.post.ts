// server/api/qrcodes.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../lib/prisma'

// Types pour les données de requête
interface CreateQrCodeBody {
  typeProduit: string
  nomProduit: string
  franchise: string
  prixVente: string | number
  poids: string | number
  unitePoids: string
  fournisseur?: string
  qrType?: 'raw' | 'result'
  codePng?: string
  auteur?: string
}

// Types pour la réponse
interface CreateQrCodeResponse {
  success: boolean
  message: string
  data: unknown
}

export default defineEventHandler(async (event): Promise<CreateQrCodeResponse> => {
  try {
    const body = await readBody(event) as CreateQrCodeBody
    
    // Validation des données requises
    const requiredFields = ['typeProduit', 'nomProduit', 'franchise', 'prixVente', 'poids', 'unitePoids'] as const
    for (const field of requiredFields) {
      if (!body[field]) {
        throw createError({
          statusCode: 400,
          statusMessage: `Le champ ${field} est requis`
        })
      }
    }

    // Validation des types
    const prixVente = typeof body.prixVente === 'string' ? parseInt(body.prixVente) : body.prixVente
    const poids = typeof body.poids === 'string' ? parseFloat(body.poids) : body.poids

    if (isNaN(prixVente) || prixVente <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le prix de vente doit être un nombre positif'
      })
    }

    if (isNaN(poids) || poids <= 0) {
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
          nom: body.auteur || 'MEHDI',
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
        prixVente,
        poids,
        unitePoids: body.unitePoids,
        fournisseur: body.fournisseur || 'Non spécifié',
        qrType: body.qrType || 'raw',
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
  