import prisma from '~/lib/prisma'
import type { Role } from '@prisma/client'
import { defineEventHandler, createError } from 'h3'
import { requireAdminOrModerator } from '../utils/auth'

const DEFAULT_RBAC: Record<Role, Record<string, boolean>> = {
  ADMIN: {
    'dashboard.access': true,
    'qr.create': true,
    'barcode.create': true,
    'items.edit': true,
    'items.delete': true,
    'users.view': true,
    'users.edit': true,
  },
  MODERATEUR: {
    'dashboard.access': true,
    'qr.create': true,
    'barcode.create': true,
    'items.edit': true,
    'items.delete': false,
    'users.view': true,
    'users.edit': true,
  },
  USER: {
    'dashboard.access': true,
    'qr.create': true,
    'barcode.create': true,
    'items.edit': false,
    'items.delete': false,
    'users.view': false,
    'users.edit': false,
  },
}

export default defineEventHandler(async (event) => {
  try {
    requireAdminOrModerator(event)
    type FindMany = () => Promise<unknown>
    const hasRoleConfig = Boolean((prisma as unknown as { roleConfig?: { findMany?: FindMany } }).roleConfig?.findMany)
    if (!hasRoleConfig) {
      return { success: true, matrix: DEFAULT_RBAC }
    }
    type RoleConfigRow = { role: Role; permissions: Record<string, boolean> }
    const client = prisma as unknown as { roleConfig: { findMany: () => Promise<RoleConfigRow[]> } }
    const configs = await client.roleConfig.findMany()
    if (!configs || configs.length === 0) {
      return { success: true, matrix: DEFAULT_RBAC }
    }
    const matrix: Record<Role, Record<string, boolean>> = { ...DEFAULT_RBAC }
    for (const c of configs) {
      matrix[c.role] = c.permissions
    }
    return { success: true, matrix }
  } catch (e) {
    // Prisma table missing → renvoyer des permissions par défaut pour ne pas casser l'UI
    const err = e as { code?: string; statusCode?: number }
    if (err?.code === 'P2021' || err?.code === 'P2022' || err?.code === 'P2010') {
      return { success: true, matrix: DEFAULT_RBAC }
    }
    if (err?.statusCode) throw e
    throw createError({ statusCode: 500, statusMessage: 'Erreur RBAC' })
  }
})


