import { useRBAC } from '~/composables/useRBAC'
import type { PermissionKey } from '~/composables/useRBAC'
import { useToast } from '~/composables/useToast'

export const usePermissionToasts = () => {
  const { can } = useRBAC()
  const toastApi = useToast()

  const requirePermission = (key: PermissionKey, title?: string, message?: string): boolean => {
    if (can(key)) return true
    // Messages par défaut si non fournis
    const defaultTitle = title || 'Permission insuffisante'
    const defaultMessage = message || 'Action non autorisée pour votre rôle'
    // Utilise la méthode sans déstructuration (évite les soucis de référence)
    toastApi.error(defaultTitle, defaultMessage)
    return false
  }

  return { requirePermission }
}


