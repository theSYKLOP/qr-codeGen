// server/api/qrcodes.get.ts
import { defineEventHandler, getQuery, createError } from 'h3'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { page = '1', limit = '10', search = '', type = '' } = query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const offset = (pageNum - 1) * limitNum

    // Construire les conditions de recherche optimisées pour Neon
    const where: any = {}
    
    if (search) {
      where.OR = [
        { nomProduit: { contains: search as string, mode: 'insensitive' as const } },
        { typeProduit: { contains: search as string, mode: 'insensitive' as const } },
        { franchise: { contains: search as string, mode: 'insensitive' as const } }
      ]
    }
    
    if (type) {
      where.typeProduit = type
    }

    // Récupérer les QR codes avec pagination optimisée
    const [qrCodes, total] = await Promise.all([
      prisma.qrCode.findMany({
        where,
        orderBy: { dateCreation: 'desc' },
        skip: offset,
        take: limitNum,
        include: {
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

    const totalPages = Math.ceil(total / limitNum)
    
    return {
      qrCodes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasPrev: pageNum > 1,
        hasNext: pageNum < totalPages
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des QR codes:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur',
      data: { error: error instanceof Error ? error.message : 'Erreur inconnue' }
    })
  }
})
  