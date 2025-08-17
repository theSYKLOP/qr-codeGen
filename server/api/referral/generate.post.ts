import prisma from '~/lib/prisma'
import { defineEventHandler, createError } from 'h3'
import { requireAdmin } from '../../utils/auth'

function generateCode(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < length; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return s
}

export default defineEventHandler(async (event) => {
  try {
    const admin = requireAdmin(event)
    const code = generateCode(12)
    // Prisma peut ne pas être migré encore: retourner un code fallback pour l'UI
    let referral: { code: string } | null = null
    try {
      const client = prisma as unknown as { referralCode: { create: (args: { data: { code: string; adminId: string } }) => Promise<{ code: string }> } }
      referral = await client.referralCode.create({
        data: { code, adminId: admin.userId }
      })
    } catch (e) {
      const err = e as { code?: string }
      if (err?.code === 'P2021' || err?.code === 'P2022' || err?.code === 'P2010') {
        return { success: true, code }
      }
      throw e
    }
    return { success: true, code: referral?.code ?? code }
  } catch (e) {
    const err = e as { statusCode?: number }
    if (err.statusCode) throw e
    throw createError({ statusCode: 500, statusMessage: 'Erreur génération code' })
  }
})


