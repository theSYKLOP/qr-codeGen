import prisma from '~/lib/prisma'
import { defineEventHandler, readBody, createError } from 'h3'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const payload = requireAuth(event)
    const body = await readBody(event)

    const data: any = {}
    if (typeof body.nom === 'string') data.nom = body.nom
    if (typeof body.prenom === 'string') data.prenom = body.prenom
    if (typeof body.email === 'string') data.email = body.email.toLowerCase()

    const user = await prisma.user.update({
      where: { id: payload.userId },
      data,
      select: { id: true, email: true, nom: true, prenom: true, role: true, isActive: true, updatedAt: true }
    })
    return { success: true, user }
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw createError({ statusCode: 409, statusMessage: 'Email déjà utilisé' })
    }
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Erreur interne' })
  }
})


