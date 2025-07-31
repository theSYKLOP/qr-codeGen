// server/api/qrcodes.delete.ts
import { defineEventHandler, getQuery, createError } from 'h3'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

    await prisma.qRCode.delete({
      where: { id: Number(id) }
    })

    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la suppression du QR code:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur'
    })
  }
}) 