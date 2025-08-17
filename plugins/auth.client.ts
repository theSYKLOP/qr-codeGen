export default defineNuxtPlugin(() => {
  // Initialiser l'authentification au démarrage de l'application
  const { initializeAuth, refreshAuthState } = useAuth()
  const { loadFromServer, resetPermissions } = useRBAC()
  
  // Initialiser immédiatement
  initializeAuth()
  
  // Écouter les changements de localStorage (pour synchroniser entre onglets)
  if (process.client) {
    window.addEventListener('storage', async (event) => {
      if (event.key === 'auth_token' || event.key === 'user') {
        refreshAuthState()
        const token1 = localStorage.getItem('auth_token')
        if (token1) {
          await loadFromServer()
          window.dispatchEvent(new CustomEvent('rbac-updated'))
        } else {
          resetPermissions()
        }
        const token2 = localStorage.getItem('auth_token')
        if (!token2 && window.location.pathname.startsWith('/admin')) {
          // Si on perd l'auth en étant sur /admin -> redirection vers /auth
          window.location.replace('/auth')
        }
      }
    })
    
    // Écouter les événements personnalisés de changement d'état
    window.addEventListener('auth-state-changed', async () => {
      refreshAuthState()
      const token1 = localStorage.getItem('auth_token')
      if (token1) {
        await loadFromServer()
        window.dispatchEvent(new CustomEvent('rbac-updated'))
      } else {
        resetPermissions()
      }
      const token2 = localStorage.getItem('auth_token')
      if (!token2 && window.location.pathname.startsWith('/admin')) {
        window.location.replace('/auth')
      }
    })
  }
}) 