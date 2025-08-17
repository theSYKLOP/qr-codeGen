import prisma from '~/lib/prisma'
import { defineEventHandler, createError } from 'h3'
import { requireAdminOrModerator } from '../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    requireAdminOrModerator(event)
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    })
    return { success: true, users }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Erreur interne' })
  }
})


