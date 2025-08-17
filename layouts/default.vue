<!-- Layout par défaut -->
<template>
  <div class="default-layout">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="header__content">
          <div class="header__brand">
            <NuxtLink to="/" class="brand-link">
              <div class="header__logo">
                <FontAwesomeIcon icon="fa-qrcode" class="logo-icon" />
              </div>
              <div class="header__text">
                <h1 class="header__title">QR-Add</h1>
                <p class="header__subtitle">Générateur de codes QR</p>
              </div>
            </NuxtLink>
          </div>
          
          <div class="header__nav">
            <ClientOnly>
              <!-- Navigation pour utilisateurs non connectés -->
              <template v-if="!authState.isAuthenticated">
                <NuxtLink to="/" class="nav-link">
                  <FontAwesomeIcon icon="fa-home" class="nav-icon" />
                  Accueil
                </NuxtLink>
                <NuxtLink to="/auth" class="nav-link">
                  <FontAwesomeIcon icon="fa-sign-in-alt" class="nav-icon" />
                  Connexion
                </NuxtLink>
              </template>

              <!-- Navigation pour utilisateurs connectés -->
              <template v-else>
                <NuxtLink
                  :to="navPrimary.to"
                  class="nav-link"
                  :class="{ 'nav-link--disabled': !isAllowedNav }"
                  @click.prevent="handleNavPrimary"
                >
                  <FontAwesomeIcon :icon="navPrimary.icon" class="nav-icon" />
                  {{ navPrimary.label }}
                </NuxtLink>
                <div class="user-menu">
                  <button class="user-menu__trigger" @click="toggleUserMenu">
                    <FontAwesomeIcon icon="fa-user-circle" class="user-icon" />
                    <span class="user-name">{{ authState.user?.prenom || 'Utilisateur' }}</span>
                    <FontAwesomeIcon icon="fa-chevron-down" class="chevron-icon" />
                  </button>

                  <div v-if="showUserMenu" class="user-menu__dropdown">
                    <div class="user-menu__header">
                      <FontAwesomeIcon icon="fa-user" class="user-menu__icon" />
                      <div class="user-menu__info">
                        <p class="user-menu__name">{{ authState.user?.prenom }} {{ authState.user?.nom }}</p>
                        <p class="user-menu__email">{{ authState.user?.email }}</p>
                        <p class="user-menu__role">{{ authState.user?.role }}</p>
                      </div>
                    </div>

                    <div class="user-menu__actions">
                      <button v-if="can('users.edit')" class="user-menu__action" @click="generateReferralCode">
                        <FontAwesomeIcon icon="fa-key" class="action-icon" />
                        Code parrainage
                      </button>
                      <button class="user-menu__action" @click="openProfileModal">
                        <FontAwesomeIcon icon="fa-user" class="action-icon" />
                        Profil
                      </button>
                      <NuxtLink
                        v-if="isAdminOrModerator"
                        to="/admin/users"
                        class="user-menu__action"
                        :class="{ 'is-disabled': !can('users.view') }"
                        @click.prevent="handleOpenUsers"
                      >
                        <FontAwesomeIcon icon="fa-users" class="action-icon" />
                        Utilisateurs
                      </NuxtLink>
                      <button class="user-menu__action" @click="handleLogout">
                        <FontAwesomeIcon icon="fa-sign-out-alt" class="action-icon" />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </ClientOnly>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="main">
      <slot />
    </main>

    <!-- Modal Profil (design modernisé) -->
    <div v-if="showProfileModal" class="modal-overlay" @click.self="closeProfileModal">
      <div class="modal profile-modal">
        <div class="modal__header">
          <h3 class="modal__title">
            <FontAwesomeIcon icon="fa-user" />
            Modifier mon profil
          </h3>
          <button class="modal__close" @click="closeProfileModal">
            <FontAwesomeIcon icon="fa-times" />
          </button>
        </div>
        <div class="modal__body">
          <p class="modal__subtitle">Mettez à jour vos informations personnelles et votre mot de passe.</p>

          <div class="section">
            <h4 class="section__title">Informations</h4>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Prénom</label>
                <input v-model="profileForm.prenom" class="form-input" type="text">
              </div>
              <div class="form-group">
                <label class="form-label">Nom</label>
                <input v-model="profileForm.nom" class="form-input" type="text">
              </div>
              <div class="form-group form-grid__full">
                <label class="form-label">Email</label>
                <input v-model="profileForm.email" class="form-input" type="email">
              </div>
            </div>
          </div>

          <div class="section">
            <h4 class="section__title">Sécurité</h4>
            <div class="form-grid">
              <div class="form-group form-grid__full">
                <label class="form-label">Mot de passe actuel</label>
                <input v-model="profileForm.currentPassword" class="form-input" type="password">
              </div>
              <div class="form-group">
                <label class="form-label">Nouveau mot de passe</label>
                <input v-model="profileForm.newPassword" class="form-input" type="password">
                <p class="field-hint">8 caractères minimum</p>
              </div>
              <div class="form-group">
                <label class="form-label">Confirmer le nouveau mot de passe</label>
                <input v-model="profileForm.confirmNewPassword" class="form-input" type="password">
              </div>
            </div>
          </div>
        </div>
        <div class="modal__footer">
          <button class="btn" @click="closeProfileModal">
            <FontAwesomeIcon icon="fa-times" />
            Annuler
          </button>
          <button class="btn btn--primary" @click="saveProfile">
            <FontAwesomeIcon icon="fa-save" />
            Enregistrer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Code de parrainage (design modernisé) -->
    <div v-if="showReferralModal" class="modal-overlay" @click.self="closeReferralModal">
      <div class="modal referral-modal">
        <div class="modal__header">
          <h3 class="modal__title">
            <FontAwesomeIcon icon="fa-key" />
            Code de parrainage
          </h3>
          <button class="modal__close" @click="closeReferralModal">
            <FontAwesomeIcon icon="fa-times" />
          </button>
        </div>
        <div class="modal__body">
          <p class="modal__subtitle">Partagez ce code pour rattacher un compte à votre administration.</p>
          <div class="referral-row">
            <input
              class="referral-input"
              :value="referralCode"
              readonly
              @focus="$event.target.select()"
            >
            <button class="btn btn--primary" :disabled="!referralCode" @click="copyReferralCode">
              <span v-if="copied">Copié</span>
              <span v-else>Copier</span>
            </button>
          </div>
          <p class="referral-hint">Ce code expire selon la politique définie par l’administrateur.</p>
        </div>
        <div class="modal__footer">
          <button class="btn" @click="closeReferralModal">
            <FontAwesomeIcon icon="fa-times" />
            Fermer
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer__content">
          <div class="footer__text">
            <p>&copy; 2025 QR-Add. Tous droits réservés.</p>
          </div>
          <div class="footer__links">
            <a href="#" class="footer__link">
              <FontAwesomeIcon icon="fa-question-circle" class="link-icon" />
              Aide
            </a>
            <a href="#" class="footer__link">
              <FontAwesomeIcon icon="fa-envelope" class="link-icon" />
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

defineOptions({ name: 'DefaultLayout' })

// Auth
const { user, isAuthenticated, initializeAuth, logout } = useAuth()
const authState = computed(() => ({
  user: user.value,
  isAuthenticated: isAuthenticated.value,
}))

// UI state
const showUserMenu = ref(false)
const showProfileModal = ref(false)
const profileForm = ref({ nom: '', prenom: '', email: '', currentPassword: '', newPassword: '', confirmNewPassword: '' })
const router = useRouter()
const { can, loadFromServer } = useRBAC()
// Écoute rbac-updated pour réactivité immédiate du menu utilisateur et nav
const rbacVersion = ref(0)
const bumpRBAC = () => { rbacVersion.value++ }
const route = useRoute()
const showReferralModal = ref(false)
const referralCode = ref('')
const copied = ref(false)
const toast = useToast()
const { requirePermission } = usePermissionToasts()

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogout = async () => {
  // La déconnexion doit toujours être possible quel que soit le rôle
  logout()
  showUserMenu.value = false
  toast.success('Déconnexion réussie')
  // Utiliser navigateTo pour garantir la navigation même en SSR et éviter les hooks bloquants
  await navigateTo('/auth', { replace: true })
}

const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div')
  notification.className = `notification notification--${type}`
  notification.textContent = message
  document.body.appendChild(notification)
  setTimeout(() => notification.remove(), 3000)
}

const handleClickOutside = (event) => {
    const userMenu = document.querySelector('.user-menu')
    if (userMenu && !userMenu.contains(event.target)) {
      showUserMenu.value = false
    }
}

onMounted(() => {
  initializeAuth()
  // Charger les permissions uniquement si authentifié
  if (isAuthenticated.value) loadFromServer()
  document.addEventListener('click', handleClickOutside)
  if (import.meta.client) window.addEventListener('rbac-updated', bumpRBAC)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (import.meta.client) window.removeEventListener('rbac-updated', bumpRBAC)
})

// Roles
const isAdminOrModerator = computed(() => { void rbacVersion.value; return authState.value.user?.role === 'ADMIN' || authState.value.user?.role === 'MODERATEUR' })

// Nav primaire dynamique (Dashboard <-> Accueil)
const isOnAdmin = computed(() => route.path.startsWith('/admin'))
const navPrimary = computed(() => {
  if (!authState.value.isAuthenticated) return { to: '/', icon: 'fa-home', label: 'Accueil' }
  return isOnAdmin.value
    ? { to: '/', icon: 'fa-home', label: 'Accueil' }
    : { to: '/admin', icon: 'fa-tachometer-alt', label: 'Dashboard' }
})

// Profil modal
const openProfileModal = () => {
  profileForm.value = {
    nom: authState.value.user?.nom || '',
    prenom: authState.value.user?.prenom || '',
    email: authState.value.user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  }
  showProfileModal.value = true
}
const closeProfileModal = () => { showProfileModal.value = false }
const saveProfile = async () => {
  try {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null
    // Mettre à jour les infos de base
    await $fetch('/api/users/me', {
      method: 'PUT',
      headers: token ? { authorization: `Bearer ${token}` } : {},
      body: profileForm.value
    })
    // Mettre à jour le mot de passe si renseigné
    if (profileForm.value.currentPassword && profileForm.value.newPassword && profileForm.value.confirmNewPassword) {
      await $fetch('/api/users/me-password', {
        method: 'PUT',
        headers: token ? { authorization: `Bearer ${token}` } : {},
        body: {
          currentPassword: profileForm.value.currentPassword,
          newPassword: profileForm.value.newPassword,
          confirmNewPassword: profileForm.value.confirmNewPassword
        }
      })
    }
    showNotification('Profil mis à jour', 'success')
    closeProfileModal()
  } catch {
    showNotification('Erreur lors de la mise à jour', 'error')
  }
}

// Code de parrainage
const generateReferralCode = async () => {
  try {
    if (!can('users.edit')) {
      toastError('Permission insuffisante')
      return
    }
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null
    const res = await $fetch('/api/referral/generate', { method: 'POST', headers: token ? { authorization: `Bearer ${token}` } : {} })
    referralCode.value = res.code
    copied.value = false
    showReferralModal.value = true
  } catch {
    toastError('Erreur de génération du code')
  }
}

const copyReferralCode = async () => {
  try {
    if (!referralCode.value) return
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(referralCode.value)
    } else {
      const ta = document.createElement('textarea')
      ta.value = referralCode.value
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copied.value = true
    toastSuccess('Code copié')
  } catch {
    toastError('Impossible de copier le code')
  }
}

const closeReferralModal = () => {
  showReferralModal.value = false
}

// Contrôles de navigation avec RBAC
// Réactivité du user-menu et des actions selon permissions
const isAllowedNav = computed(() => { void rbacVersion.value; return (isOnAdmin.value ? true : can('dashboard.access')) })
const handleNavPrimary = async () => {
  if (!isAllowedNav.value) {
    if (!requirePermission('dashboard.access', 'Accès refusé', 'Accès non autorisé au tableau de bord')) return
  }
  await router.push(navPrimary.value.to)
}
const handleOpenUsers = async () => {
  if (!requirePermission('users.view', 'Accès refusé', 'Accès non autorisé à la gestion des utilisateurs')) return
  await router.push('/admin/users')
}
</script>

<style scoped>
/* ===== DEFAULT LAYOUT ===== */
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-light);
}

/* ===== HEADER ===== */
.header {
  background: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 3.5rem;
  padding: var(--space-2) 0 0 0;
}

.header__brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  transition: all var(--transition-fast);
  padding: var(--space-2);
  border-radius: var(--border-radius-lg);
}

.brand-link:hover {
  transform: translateY(-1px);
  background-color: rgba(0, 0, 0, 0.03);
}

.header__logo {
  color: var(--color-primary);
  transition: color var(--transition-fast);
}

.header__logo:hover {
  color: var(--color-accent);
}

.logo-icon {
  font-size: var(--font-size-xl);
}

.header__text {
  display: flex;
  flex-direction: column;
}

.header__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin: 0;
}

.header__subtitle {
  font-size: var(--font-size-xs);
  color: var(--color-muted);
  margin: 0;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  height: 100%;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-muted);
  text-decoration: none;
  transition: all var(--transition-fast);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--border-radius-lg);
  font-weight: var(--font-weight-medium);
  height: 100%;
  min-height: 40px;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  opacity: 0;
  transition: opacity var(--transition-fast);
  z-index: -1;
}

.nav-link:hover {
  color: var(--color-secondary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-link:hover::before {
  opacity: 1;
}

.nav-icon {
  font-size: var(--font-size-sm);
}

/* ===== USER MENU ===== */
.user-menu {
  position: relative;
}

.user-menu__trigger {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: var(--color-muted);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--border-radius-xl);
  transition: all var(--transition-fast);
  height: 100%;
  min-height: 40px;
  backdrop-filter: blur(10px);
}

.user-menu__trigger:hover {
  color: var(--color-primary);
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-icon {
  font-size: var(--font-size-lg);
  color: var(--color-primary);
}

.user-name {
  font-weight: var(--font-weight-medium);
}

.chevron-icon {
  font-size: var(--font-size-xs);
  transition: transform var(--transition-fast);
}

.user-menu__trigger:hover .chevron-icon {
  transform: rotate(180deg);
}

.user-menu__dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 280px;
  background-color: var(--color-secondary);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-dropdown);
  margin-top: var(--space-2);
  overflow: hidden;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-menu__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  border-bottom: var(--border-width) solid var(--color-border);
  background-color: var(--color-light);
}

.user-menu__icon {
  font-size: var(--font-size-xl);
  color: var(--color-primary);
}

.user-menu__info {
  flex: 1;
}

.user-menu__name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin: 0 0 var(--space-1) 0;
}

.user-menu__email {
  font-size: var(--font-size-xs);
  color: var(--color-muted);
  margin: 0 0 var(--space-1) 0;
}

.user-menu__role {
  font-size: var(--font-size-xs);
  color: var(--color-accent);
  text-transform: uppercase;
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.user-menu__actions {
  padding: var(--space-2);
}

.user-menu__action {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: none;
  border: none;
  color: var(--color-muted);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  border-radius: var(--border-radius);
  transition: all var(--transition-fast);
  text-align: left;
}

.user-menu__action:hover {
  color: var(--color-danger);
  background-color: rgba(239, 68, 68, 0.1);
}

.action-icon {
  font-size: var(--font-size-sm);
}

/* ===== MAIN ===== */
.main {
  flex: 1;
}

/* ===== FOOTER ===== */
.footer {
  background: linear-gradient(135deg, var(--color-secondary) 0%, rgba(255, 255, 255, 0.98) 100%);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding: var(--space-6) 0;
  margin-top: auto;
  backdrop-filter: blur(20px);
}

.footer__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
  min-height: 3rem;
  padding: var(--space-2) 0 0 0;
}

.footer__text {
  font-size: var(--font-size-sm);
  color: var(--color-muted);
  margin: 0;
}

.footer__links {
  display: flex;
  gap: var(--space-6);
}

.footer__link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-muted);
  text-decoration: none;
  transition: all var(--transition-fast);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--border-radius-lg);
  position: relative;
  overflow: hidden;
}

.footer__link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  opacity: 0;
  transition: opacity var(--transition-fast);
  z-index: -1;
}

.footer__link:hover {
  color: var(--color-secondary);
  transform: translateY(-1px);
}

.footer__link:hover::before {
  opacity: 1;
}

.link-icon {
  font-size: var(--font-size-sm);
}

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal, 1000);
}
.modal {
  width: 100%;
  max-width: 520px;
  background: var(--color-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}
.modal__header, .modal__footer { 
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-4);
  background: var(--color-light);
  border-bottom: 1px solid var(--color-border);
}
.modal__footer { border-top: 1px solid var(--color-border); border-bottom: none; gap: var(--space-3); justify-content: flex-end; }
.modal__body { padding: var(--space-6); display: grid; gap: var(--space-4); }
.modal__title { display: flex; align-items: center; gap: var(--space-2); margin: 0; }
.modal__close { background: none; border: none; cursor: pointer; }

/* Referral modal */
.referral-row { display:flex; align-items:center; gap: var(--space-3); }
.referral-input {
  flex: 1;
  padding: var(--space-3) var(--space-4);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: var(--font-size-base);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background: var(--color-secondary);
}
.referral-hint { margin: var(--space-2) 0 0 0; color: var(--color-muted); font-size: var(--font-size-sm); }

/* Profile/Referral refinements */
.profile-modal, .referral-modal { max-width: 640px; }
.modal__subtitle { color: var(--color-muted); margin: 0; }
.section { border: 1px solid var(--color-border); border-radius: var(--border-radius); background: var(--color-secondary); }
.section__title { margin: 0; padding: var(--space-3) var(--space-4); background: var(--color-light); border-bottom: 1px solid var(--color-border); font-size: var(--font-size-sm); color: var(--color-muted); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); padding: var(--space-4); }
.form-grid__full { grid-column: 1 / -1; }
.field-hint { margin: var(--space-1) 0 0 0; font-size: 12px; color: var(--color-muted); }

/* ===== NOTIFICATIONS ===== */
.notification {
  position: fixed;
  top: var(--space-6);
  right: var(--space-6);
  padding: var(--space-4) var(--space-6);
  background-color: var(--color-primary);
  color: var(--color-secondary);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-tooltip);
  animation: slideIn 0.3s ease-out;
  font-weight: var(--font-weight-medium);
}

.notification--success {
  background-color: var(--color-success);
}

.notification--error {
  background-color: var(--color-error);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 640px) {
  .header__content {
    flex-direction: column;
    gap: var(--space-4);
    height: auto;
    padding: var(--space-3) 0;
  }
  
  .header__nav {
    flex-direction: column;
    gap: var(--space-2);
    width: 100%;
  }
  
  .nav-link {
    justify-content: center;
  }
  
  .user-menu__dropdown {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    min-width: auto;
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
    margin-top: 0;
  }
  
  .footer__content {
    flex-direction: column;
    text-align: center;
  }
  
  .footer__links {
    justify-content: center;
  }
}
</style> 