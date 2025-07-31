// server/api/qrcodes.get.ts
import { defineEventHandler, getQuery, createError } from 'h3'
import prisma from '../../lib/prisma'

// Types pour les paramètres de requête
interface QueryParams {
  page?: string
  limit?: string
  typeProduit?: string
  search?: string
}

// Types pour la réponse
interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface ApiResponse {
  success: boolean
  data: unknown[]
  pagination: PaginationInfo
}

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const query = getQuery(event) as QueryParams
    
    // Options de pagination
    const page = parseInt(query.page || '1')
    const limit = Math.min(parseInt(query.limit || '5'), 100) // Limite par défaut de 5, max 100
    const skip = (page - 1) * limit

    // Options de filtrage
    const where: {
      typeProduit?: string
      OR?: Array<{
        nomProduit?: { contains: string; mode: 'insensitive' }
        franchise?: { contains: string; mode: 'insensitive' }
        fournisseur?: { contains: string; mode: 'insensitive' }
      }>
    } = {}
    
    if (query.typeProduit) {
      where.typeProduit = query.typeProduit
    }
    
    if (query.search) {
      where.OR = [
        { nomProduit: { contains: query.search, mode: 'insensitive' } },
        { franchise: { contains: query.search, mode: 'insensitive' } },
        { fournisseur: { contains: query.search, mode: 'insensitive' } }
      ]
    }

    // Récupérer les QR codes avec pagination
    const [qrCodes, total] = await Promise.all([
      prisma.qrCode.findMany({
        where,
        orderBy: { dateCreation: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          typeProduit: true,
          nomProduit: true,
          franchise: true,
          prixVente: true,
          poids: true,
          unitePoids: true,
          fournisseur: true,
          qrType: true,
          dateCreation: true,
          codePng: true,
          user: {
            select: {
              nom: true,
              prenom: true,
              email: true
            }
          }
        }
      }),
      prisma.qrCode.count({ where })
    ])

    return {
      success: true,
      data: qrCodes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    }

  } catch (error) {
    console.error('Erreur récupération QR Codes:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des QR codes'
    })
  }
})
  