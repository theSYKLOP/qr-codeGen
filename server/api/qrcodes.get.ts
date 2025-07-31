// server/api/qrcodes.get.ts
import { defineEventHandler, getQuery, createError } from 'h3'
import prisma from '../../prisma.js'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { page = '1', limit = '10', search = '' } = query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const offset = (pageNum - 1) * limitNum

    // Construire les conditions de recherche
    const where = search ? {
      OR: [
        { nomProduit: { contains: search as string, mode: 'insensitive' as const } },
        { typeProduit: { contains: search as string, mode: 'insensitive' as const } },
        { franchise: { contains: search as string, mode: 'insensitive' as const } }
      ]
    } : {}

    // Récupérer les QR codes avec pagination
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

    return {
      qrCodes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des QR codes:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur'
    })
  }
})
  