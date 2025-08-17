import prisma from '~/lib/prisma'
import type { Role } from '@prisma/client'
import { defineEventHandler, readBody, createError } from 'h3'
import { requireAdminOrModerator } from '../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const requester = requireAdminOrModerator(event)
    const body = await readBody(event)
    const matrix = body?.matrix as Record<Role, Record<string, boolean>>
    if (!matrix) throw createError({ statusCode: 400, statusMessage: 'Matrix requise' })

    // Upsert pour chaque rôle
    const hasRoleConfig = Boolean((prisma as any).roleConfig?.upsert)
    if (hasRoleConfig) {
      const roles = Object.keys(matrix) as Role[]
      // Si le demandeur est MODERATEUR, il ne peut mettre à jour que USER
      if (requester.role !== 'ADMIN') {
        const invalid = roles.filter((r) => r !== 'USER')
        if (invalid.length > 0) {
          throw createError({ statusCode: 403, statusMessage: 'Seules les permissions USER peuvent être modifiées par un modérateur' })
        }
      }
      for (const role of roles) {
        if (requester.role !== 'ADMIN' && role !== 'USER') continue
        await (prisma as any).roleConfig.upsert({
          where: { role },
          create: { role, permissions: matrix[role], configuredById: requester.userId },
          update: { permissions: matrix[role], configuredById: requester.userId },
        })
      }
    }
    return { success: true }
  } catch (e: any) {
    if (e.statusCode) throw e
    throw createError({ statusCode: 500, statusMessage: 'Erreur RBAC' })
  }
})


