import prisma from '~/lib/prisma'
import { defineEventHandler, readBody, createError } from 'h3'
import { requireAuth } from '../../utils/auth'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  try {
    const payload = requireAuth(event)
    const { currentPassword, newPassword, confirmNewPassword } = await readBody(event)

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      throw createError({ statusCode: 400, statusMessage: 'Champs manquants' })
    }
    if (newPassword !== confirmNewPassword) {
      throw createError({ statusCode: 400, statusMessage: 'Les mots de passe ne correspondent pas' })
    }
    if (newPassword.length < 8) {
      throw createError({ statusCode: 400, statusMessage: 'Le nouveau mot de passe doit contenir au moins 8 caractères' })
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) throw createError({ statusCode: 404, statusMessage: 'Utilisateur non trouvé' })

    const ok = await bcrypt.compare(currentPassword, user.password)
    if (!ok) throw createError({ statusCode: 401, statusMessage: 'Mot de passe actuel incorrect' })

    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } })

    return { success: true, message: 'Mot de passe mis à jour' }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Erreur interne' })
  }
})


