import { readonly } from 'vue'
export type RoleKey = 'ADMIN' | 'MODERATEUR' | 'USER'
export type PermissionKey =
  | 'dashboard.access'
  | 'qr.create'
  | 'barcode.create'
  | 'items.edit'
  | 'items.delete'
  | 'users.view'
  | 'users.edit'

export type RBACMatrix = Record<RoleKey, Record<PermissionKey, boolean>>

const DEFAULT_RBAC: RBACMatrix = {
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

export const useRBAC = () => {
  const STORAGE_KEY = 'rbac_config'
  // @ts-expect-error Nuxt auto-import
  const matrix = useState<RBACMatrix>('rbac_matrix', () => {
    if (import.meta.client) {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          return JSON.parse(raw) as RBACMatrix
        } catch {
          // ignore invalid
        }
      }
    }
    return DEFAULT_RBAC
  })

  // @ts-expect-error Nuxt auto-import
  const { user } = useAuth()

  // Charger depuis l'API (prioritaire sur localStorage)
  const loadFromServer = async () => {
    try {
      const token = import.meta.client ? localStorage.getItem('auth_token') : null
      if (!token) return
      const res = await $fetch<{ success: boolean; matrix?: RBACMatrix }>('/api/rbac', { headers: token ? { authorization: `Bearer ${token}` } : {} })
      if (res && res.matrix) {
        // Remettre l'ordre des clés pour stabilité (optionnel)
        const normalized: RBACMatrix = {
          ADMIN: res.matrix.ADMIN,
          MODERATEUR: res.matrix.MODERATEUR,
          USER: res.matrix.USER,
        }
        matrix.value = normalized
        if (import.meta.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(matrix.value))
      }
    } catch {
      // fallback local
    }
  }

  const can = (permission: PermissionKey, roleOverride?: RoleKey) => {
    const role = (roleOverride || (user.value?.role as RoleKey)) || 'USER'
    const rolePerms = matrix.value[role]
    return Boolean(rolePerms && rolePerms[permission])
  }

  const updatePermissions = (next: RBACMatrix) => {
    matrix.value = next
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      window.dispatchEvent(new CustomEvent('rbac-updated'))
    }
  }

  const persistPermissions = async (next: RBACMatrix) => {
    try {
      const token = import.meta.client ? localStorage.getItem('auth_token') : null
      if (!token) throw new Error('Non authentifié')
      await $fetch('/api/rbac', {
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        body: { matrix: next },
      })
      updatePermissions(next)
      return true
    } catch {
      return false
    }
  }

  const resetPermissions = () => updatePermissions(DEFAULT_RBAC)

  return { matrix: readonly(matrix), can, updatePermissions, persistPermissions, resetPermissions, loadFromServer }
}


