import type { Role } from '@prisma/client'
import prisma from '~/lib/prisma'
import { defineEventHandler, readBody, createError } from 'h3'
import { requireAdminOrModerator, requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const requester = requireAdminOrModerator(event)
    const id = event.context.params?.id as string
    if (!id) throw createError({ statusCode: 400, statusMessage: 'ID requis' })

    const body = await readBody(event)
    const patch: { role?: Role; isActive?: boolean } = {}

    if (typeof body.isActive === 'boolean') {
      patch.isActive = body.isActive
    }

    if (body.role) {
      // Seul un ADMIN peut attribuer le rôle ADMIN
      if (body.role === 'ADMIN' && requester.role !== 'ADMIN') {
        throw createError({ statusCode: 403, statusMessage: 'Droits insuffisants pour définir ADMIN' })
      }
      if (!['USER', 'MODERATEUR', 'ADMIN'].includes(body.role)) {
        throw createError({ statusCode: 400, statusMessage: 'Rôle invalide' })
      }
      patch.role = body.role
    }

    // Garde supplémentaire: on interdit de modifier un compte ADMIN si le demandeur n'est pas ADMIN
    if (requester.role !== 'ADMIN') {
      const target = await prisma.user.findUnique({ where: { id }, select: { role: true } })
      if (target?.role === 'ADMIN') {
        throw createError({ statusCode: 403, statusMessage: 'Impossible de modifier un compte ADMIN' })
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: patch,
      select: {
        id: true, email: true, nom: true, prenom: true, role: true, isActive: true, updatedAt: true
      }
    })
    return { success: true, user: updated }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Erreur interne' })
  }
})


