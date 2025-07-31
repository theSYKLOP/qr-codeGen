// server/api/qrcodes.put.ts
import { defineEventHandler, readBody, getQuery, createError } from 'h3'
import prisma from '../../prisma.js'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { id } = query
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID requis'
      })
    }

    const qrCode = await prisma.qrCode.update({
      where: { id: Number(id) },
      data: body
    })

    return qrCode
  } catch (error) {
    console.error('Erreur lors de la mise à jour du QR code:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur'
    })
  }
}) 