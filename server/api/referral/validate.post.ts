import prisma from '~/lib/prisma'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const code = String(body?.code || '').trim().toUpperCase()

  if (!code) {
    throw createError({ statusCode: 400, statusMessage: 'Code de parrainage requis' })
  }

  const ref = await prisma.referralCode.findUnique({ where: { code } })
  if (!ref) {
    throw createError({ statusCode: 404, statusMessage: 'Code de parrainage introuvable' })
  }

  if (ref.usedByUserId) {
    throw createError({ statusCode: 400, statusMessage: 'Code déjà utilisé' })
  }

  if (ref.expiresAt && new Date(ref.expiresAt) < new Date()) {
    throw createError({ statusCode: 400, statusMessage: 'Code expiré' })
  }

  return {
    success: true,
    code: ref.code,
    adminId: ref.adminId,
    expiresAt: ref.expiresAt || null
  }
})


