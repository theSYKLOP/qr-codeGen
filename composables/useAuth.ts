import { computed, readonly, nextTick } from 'vue'
import type { User, Role } from '@prisma/client'
import { useState } from '#imports'

type LoginResponse = { success: boolean; requires2FA?: boolean; user?: User; token?: string; message?: string }
type Verify2FAResponse = { success: boolean; user?: User; token?: string; message?: string }
type RegisterResponse = { success: boolean; message?: string }

export const useAuth = () => {
  // État réactif
  const user = useState<User | null>('user', () => null)
  const token = useState<string | null>('token', () => null)
  const isAuthenticated = computed(() => !!user.value && !!token.value)

  // Initialiser l'état depuis localStorage
  const initializeAuth = () => {
    if (process.client) {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('user')
      
      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          // Vérifier que l'utilisateur est valide et actif
          if (userData.id && userData.email && userData.isActive) {
            token.value = storedToken
            user.value = userData
          } else {
            // Données invalides, nettoyer
            logout()
          }
        } catch (error) {
          console.error('Erreur lors de l\'initialisation de l\'auth:', error)
          logout()
        }
      }
    }
  }

  // Connexion
  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      if (response && response.success) {
        if (response.requires2FA) {
          return { success: true, requires2FA: true }
        } else {
          await setAuthData(response.user as User, String(response.token))
          return { success: true, requires2FA: false }
        }
      } else {
        return { success: false, message: response?.message || 'Erreur de connexion' }
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      return { success: false, message: 'Erreur de connexion' }
    }
  }

  // Vérification 2FA
  const verify2FA = async (code: string) => {
    try {
      const response = await $fetch<Verify2FAResponse>('/api/auth/verify-2fa', {
        method: 'POST',
        body: { code }
      })

      if (response && response.success) {
        await setAuthData(response.user as User, String(response.token))
        return { success: true }
      } else {
        return { success: false, message: response?.message || 'Erreur de vérification' }
      }
    } catch (error) {
      console.error('Erreur de vérification 2FA:', error)
      return { success: false, message: 'Erreur de vérification' }
    }
  }

  // Inscription
  const register = async (userData: Record<string, unknown>) => {
    try {
      const response = await $fetch<RegisterResponse>('/api/auth/register', {
        method: 'POST',
        body: userData
      })

      return {
        success: response?.success || false,
        message: response?.message || 'Erreur lors de l\'inscription'
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error)
      return { success: false, message: 'Erreur lors de l\'inscription' }
    }
  }

  // Déconnexion
  const logout = () => {
    user.value = null
    token.value = null
    
    if (process.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      // Notifier l'app que l'état d'auth a changé (pour redirections et sync UI)
      window.dispatchEvent(new CustomEvent('auth-state-changed', {
        detail: { user: null, token: null }
      }))
    }
  }

  // Définir les données d'authentification
  const setAuthData = async (userData: User, authToken: string) => {
    user.value = userData
    token.value = authToken
    
    if (process.client) {
      localStorage.setItem('auth_token', authToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Forcer la mise à jour de l'état réactif
      nextTick(() => {
        // Déclencher un événement personnalisé pour notifier les composants
        window.dispatchEvent(new CustomEvent('auth-state-changed', {
          detail: { user: userData, token: authToken }
        }))
      })
    }
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role: Role) => {
    return user.value?.role === role
  }

  // Vérifier si l'utilisateur est admin
  const isAdmin = computed(() => hasRole('ADMIN'))

  // Vérifier si le compte est vérifié
  const isVerified = computed(() => user.value?.isActive === true)

  // Forcer la mise à jour de l'état
  const refreshAuthState = () => {
    initializeAuth()
  }

  return {
    // État
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    isAdmin,
    isVerified,
    
    // Méthodes
    initializeAuth,
    login,
    verify2FA,
    register,
    logout,
    hasRole,
    refreshAuthState
  }
} 