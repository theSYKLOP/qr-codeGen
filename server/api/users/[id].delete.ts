import prisma from '~/lib/prisma'
import { defineEventHandler, createError } from 'h3'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    requireAdmin(event)
    const id = event.context.params?.id as string
    if (!id) throw createError({ statusCode: 400, statusMessage: 'ID requis' })

    const target = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } })
    if (!target) throw createError({ statusCode: 404, statusMessage: 'Utilisateur introuvable' })
    if (target.role === 'ADMIN') throw createError({ statusCode: 403, statusMessage: 'Impossible de supprimer un compte ADMIN' })

    await prisma.user.delete({ where: { id } })
    return { success: true }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Erreur interne' })
  }
})


