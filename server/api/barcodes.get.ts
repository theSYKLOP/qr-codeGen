// server/api/barcodes.get.ts
import { defineEventHandler, getQuery, createError } from 'h3'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { page = '1', limit = '10', search = '', categorie = '' } = query
    
    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const offset = (pageNum - 1) * limitNum
    
    const where: any = {}
    
    if (search) {
      where.OR = [
        {
          nomProduit: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          franchise: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          reference: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }
    
    if (categorie) {
      where.categorie = categorie
    }
    
    // Compter le total
    const total = await prisma.barcode.count({ where })
    
    // Récupérer les codes-barres
    const barcodes = await prisma.barcode.findMany({
      where,
      skip: offset,
      take: limitNum,
      orderBy: {
        dateCreation: 'desc'
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
    
    const totalPages = Math.ceil(total / limitNum)
    
    return {
      success: true,
      barcodes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    }
    
  } catch (error) {
    console.error('Erreur lors de la récupération des codes-barres:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur',
      data: { error: error instanceof Error ? error.message : 'Erreur inconnue' }
    })
  }
}) 