export default defineNuxtRouteMiddleware((to, from) => {
  // Protection des routes admin uniquement
  if (to.path.startsWith('/admin')) {
    // Vérification côté client uniquement
    if (process.client) {
      const token = localStorage.getItem('auth_token')
      const user = localStorage.getItem('user')
      
      if (!token || !user) {
        return navigateTo('/auth')
      }
      
      try {
        const userData = JSON.parse(user)
        if (!userData.id || !userData.email || userData.isActive !== true) {
          return navigateTo('/auth')
        }
      } catch (_error) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        return navigateTo('/auth')
      }
    }
  }
}) 