<!-- Page d'authentification -->
<template>
  <div v-if="!isRedirecting" class="auth-page">
    <div class="auth-container">
      <!-- Header -->
      <div class="auth-header">
        <div class="auth-logo">
          <FontAwesomeIcon icon="fa-qrcode" class="logo-icon" />
          <span class="logo-text">QR-Add</span>
        </div>
        <p class="auth-subtitle">Connectez-vous à votre compte</p>
      </div>

      <!-- Onglets -->
      <div class="auth-tabs">
        <button 
          class="auth-tab"
          :class="{ 'auth-tab--active': activeTab === 'login' }"
          @click="activeTab = 'login'"
        >
          <FontAwesomeIcon icon="fa-sign-in-alt" class="tab-icon" />
          <span class="tab-text">Connexion</span>
        </button>
        <button 
          class="auth-tab"
          :class="{ 'auth-tab--active': activeTab === 'register' }"
          @click="activeTab = 'register'"
        >
          <FontAwesomeIcon icon="fa-user-plus" class="tab-icon" />
          <span class="tab-text">Inscription</span>
        </button>
      </div>

      <!-- Formulaire de connexion -->
      <div v-if="activeTab === 'login'" class="auth-form">
        <form @submit.prevent="handleLogin" class="form">
          <div class="form-group">
            <label for="login-email" class="form-label">Email</label>
            <div class="form-input-wrapper">
              <FontAwesomeIcon icon="fa-envelope" class="input-icon" />
              <input
                id="login-email"
                v-model="loginForm.email"
                type="email"
                class="form-input"
                :class="{ 'form-input--error': loginErrors.email }"
                placeholder="votre@email.com"
                required
              />
            </div>
            <span v-if="loginErrors.email" class="form-error">{{ loginErrors.email }}</span>
          </div>

          <div class="form-group">
            <label for="login-password" class="form-label">Mot de passe</label>
            <div class="form-input-wrapper">
              <FontAwesomeIcon icon="fa-lock" class="input-icon" />
              <input
                id="login-password"
                v-model="loginForm.password"
                :type="showLoginPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ 'form-input--error': loginErrors.password }"
                placeholder="Votre mot de passe"
                required
              />
              <button
                type="button"
                class="password-toggle"
                @click="showLoginPassword = !showLoginPassword"
              >
                <FontAwesomeIcon :icon="showLoginPassword ? 'fa-eye-slash' : 'fa-eye'" />
              </button>
            </div>
            <span v-if="loginErrors.password" class="form-error">{{ loginErrors.password }}</span>
          </div>

          <button 
            type="submit" 
            class="btn btn--primary btn--block"
            :disabled="loginLoading"
          >
            <FontAwesomeIcon v-if="loginLoading" icon="fa-spinner" class="btn-icon fa-spin" />
            <FontAwesomeIcon v-else icon="fa-sign-in-alt" class="btn-icon" />
            <span class="btn-text">{{ loginLoading ? 'Connexion...' : 'Se connecter' }}</span>
          </button>
        </form>
      </div>

      <!-- Inscription: Étape 1 (Code de parrainage) -->
      <div v-if="activeTab === 'register' && !referralStep.validated" class="auth-form">
        <form @submit.prevent="validateReferral" class="form">
          <div class="form-group">
            <label for="referral-code" class="form-label">Code de parrainage</label>
            <div class="form-input-wrapper">
              <FontAwesomeIcon icon="fa-key" class="input-icon" />
              <input
                id="referral-code"
                v-model="referralStep.code"
                type="text"
                class="form-input"
                :class="{ 'form-input--error': referralStep.error }"
                placeholder="EX: AB12CD34EF"
                maxlength="20"
                required
                @input="onReferralInput"
              />
            </div>
            <span v-if="referralStep.error" class="form-error">{{ referralStep.error }}</span>
            <p v-if="referralStep.meta" class="hint">{{ referralStep.meta }}</p>
          </div>

          <button
            type="submit"
            class="btn btn--primary btn--block"
            :disabled="referralStep.loading || referralStep.code.length < 6"
          >
            <FontAwesomeIcon v-if="referralStep.loading" icon="fa-spinner" class="btn-icon fa-spin" />
            <FontAwesomeIcon v-else icon="fa-check" class="btn-icon" />
            <span class="btn-text">{{ referralStep.loading ? 'Vérification...' : 'Valider le code' }}</span>
          </button>
        </form>

        <div class="referral-tips">
          <p>Demandez à votre administrateur un code valide si vous n’en avez pas encore.</p>
        </div>
      </div>

      <!-- Inscription: Étape 2 (Formulaire) -->
      <div v-if="activeTab === 'register' && referralStep.validated" class="auth-form">
        <form @submit.prevent="handleRegister" class="form">
          <div class="form-row">
            <div class="form-group">
              <label for="register-firstname" class="form-label">Prénom</label>
              <div class="form-input-wrapper">
                <FontAwesomeIcon icon="fa-user" class="input-icon" />
                <input
                  id="register-firstname"
                  v-model="registerForm.prenom"
                  type="text"
                  class="form-input"
                  :class="{ 'form-input--error': registerErrors.prenom }"
                  placeholder="Votre prénom"
                  required
                />
              </div>
              <span v-if="registerErrors.prenom" class="form-error">{{ registerErrors.prenom }}</span>
            </div>

            <div class="form-group">
              <label for="register-lastname" class="form-label">Nom</label>
              <div class="form-input-wrapper">
                <FontAwesomeIcon icon="fa-user" class="input-icon" />
                <input
                  id="register-lastname"
                  v-model="registerForm.nom"
                  type="text"
                  class="form-input"
                  :class="{ 'form-input--error': registerErrors.nom }"
                  placeholder="Votre nom"
                  required
                />
              </div>
              <span v-if="registerErrors.nom" class="form-error">{{ registerErrors.nom }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="register-email" class="form-label">Email</label>
            <div class="form-input-wrapper">
              <FontAwesomeIcon icon="fa-envelope" class="input-icon" />
              <input
                id="register-email"
                v-model="registerForm.email"
                type="email"
                class="form-input"
                :class="{ 'form-input--error': registerErrors.email }"
                placeholder="votre@email.com"
                required
              />
            </div>
            <span v-if="registerErrors.email" class="form-error">{{ registerErrors.email }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">Code de parrainage</label>
            <div class="form-input-wrapper">
              <FontAwesomeIcon icon="fa-key" class="input-icon" />
              <input :value="referralStep.code" class="form-input" readonly />
            </div>
          </div>

          <div class="form-group">
            <label for="register-password" class="form-label">Mot de passe</label>
            <div class="form-input-wrapper">
              <FontAwesomeIcon icon="fa-lock" class="input-icon" />
              <input
                id="register-password"
                v-model="registerForm.password"
                :type="showRegisterPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ 'form-input--error': registerErrors.password }"
                placeholder="Votre mot de passe"
                required
              />
              <button type="button" class="password-toggle" @click="showRegisterPassword = !showRegisterPassword">
                <FontAwesomeIcon :icon="showRegisterPassword ? 'fa-eye-slash' : 'fa-eye'" />
              </button>
            </div>
            <span v-if="registerErrors.password" class="form-error">{{ registerErrors.password }}</span>
          </div>

          <div class="form-group">
            <label for="register-confirm-password" class="form-label">Confirmer le mot de passe</label>
            <div class="form-input-wrapper">
              <FontAwesomeIcon icon="fa-lock" class="input-icon" />
              <input
                id="register-confirm-password"
                v-model="registerForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ 'form-input--error': registerErrors.confirmPassword }"
                placeholder="Confirmez votre mot de passe"
                required
              />
              <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
                <FontAwesomeIcon :icon="showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'" />
              </button>
            </div>
            <span v-if="registerErrors.confirmPassword" class="form-error">{{ registerErrors.confirmPassword }}</span>
          </div>

          <button type="submit" class="btn btn--primary btn--block" :disabled="registerLoading">
            <FontAwesomeIcon v-if="registerLoading" icon="fa-spinner" class="btn-icon fa-spin" />
            <FontAwesomeIcon v-else icon="fa-user-plus" class="btn-icon" />
            <span class="btn-text">{{ registerLoading ? 'Création...' : 'Créer un compte' }}</span>
          </button>

          <div class="referral-reset">
            <button type="button" class="btn btn--text" @click="resetReferral">Réinitialiser le code de parrainage</button>
          </div>
        </form>
      </div>

      <!-- Formulaire 2FA -->
      <div v-if="showTwoFactor" class="auth-form">
        <div class="two-factor-header">
          <FontAwesomeIcon icon="fa-shield-halved" class="two-factor-icon" />
          <h3 class="two-factor-title">Vérification en deux étapes</h3>
          <p class="two-factor-description">
            Un code de vérification a été envoyé à votre adresse email.
            Veuillez le saisir ci-dessous.
          </p>
        </div>

        <form @submit.prevent="handleTwoFactor" class="form">
          <div class="form-group">
            <label for="two-factor-code" class="form-label">Code de vérification</label>
            <div class="form-input-wrapper">
              <FontAwesomeIcon icon="fa-key" class="input-icon" />
              <input
                id="two-factor-code"
                v-model="twoFactorForm.code"
                type="text"
                class="form-input"
                :class="{ 'form-input--error': twoFactorErrors.code }"
                placeholder="000000"
                maxlength="6"
                required
              />
            </div>
            <span v-if="twoFactorErrors.code" class="form-error">{{ twoFactorErrors.code }}</span>
          </div>

          <button 
            type="submit" 
            class="btn btn--primary btn--block"
            :disabled="twoFactorLoading"
          >
            <FontAwesomeIcon v-if="twoFactorLoading" icon="fa-spinner" class="btn-icon fa-spin" />
            <FontAwesomeIcon v-else icon="fa-check" class="btn-icon" />
            <span class="btn-text">{{ twoFactorLoading ? 'Vérification...' : 'Vérifier' }}</span>
          </button>
 
          <div class="two-factor-actions">
            <button 
              type="button" 
              class="btn btn--outline btn--block"
              @click="resendCode"
              :disabled="resendLoading"
            >
              <FontAwesomeIcon v-if="resendLoading" icon="fa-spinner" class="btn-icon fa-spin" />
              <FontAwesomeIcon v-else icon="fa-paper-plane" class="btn-icon" />
              <span class="btn-text">{{ resendLoading ? 'Envoi...' : 'Renvoyer le code' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Retour à la page d'accueil -->
      <div class="auth-footer">
        <button 
          class="btn btn--text"
          @click="navigateToHome"
        >
          <FontAwesomeIcon icon="fa-arrow-left" class="btn-icon" />
          <span class="btn-text">Retour à l'accueil</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

// Définition du nom du composant
defineOptions({
  name: 'AuthPage',
  layout: 'auth'
})

// Redirection si déjà connecté
const isRedirecting = ref(false)
onMounted(() => {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated.value) {
    isRedirecting.value = true
    const router = useRouter()
    router.replace('/admin')
  }
})

// État réactif
const activeTab = ref('login')
const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)
const showConfirmPassword = ref(false)
const showTwoFactor = ref(false)

// États de chargement
const loginLoading = ref(false)
const registerLoading = ref(false)
const twoFactorLoading = ref(false)
const resendLoading = ref(false)

// Étape parrainage (inscription)
const referralStep = reactive({ code: '', validated: false, loading: false, error: '', meta: '' })

// Formulaires
const loginForm = reactive({
  email: '',
  password: ''
})

const registerForm = reactive({
  prenom: '',
  nom: '',
  email: '',
  password: '',
    confirmPassword: '',
    referralCode: ''
})

const twoFactorForm = reactive({
  code: ''
})

// Erreurs
const loginErrors = reactive({})
const registerErrors = reactive({})
const twoFactorErrors = reactive({})

// Navigation / Toasts
const router = useRouter()
const { success: toastSuccess, error: toastError, info: toastInfo, warning: toastWarning } = useToast()

const navigateToHome = () => {
  router.push('/')
}

// UX: normaliser la saisie du code
const onReferralInput = () => {
  referralStep.code = referralStep.code.toUpperCase().replace(/[^A-Z0-9]/g, '')
  referralStep.error = ''
  referralStep.meta = ''
}

// Valider le code de parrainage
const validateReferral = async () => {
  referralStep.error = ''
  referralStep.meta = ''
  referralStep.loading = true
  try {
    const res = await $fetch('/api/referral/validate', { method: 'POST', body: { code: referralStep.code } })
    if (res && res.success) {
      referralStep.validated = true
      referralStep.meta = res.expiresAt ? `Valide jusqu’au ${new Date(res.expiresAt).toLocaleDateString('fr-FR')}` : 'Code valide'
      toastSuccess('Code validé', 'Le code de parrainage est valide')
    }
  } catch (e) {
    const err = e as { statusMessage?: string }
    referralStep.error = err?.statusMessage || 'Code invalide'
    toastError('Code invalide', referralStep.error)
  } finally {
    referralStep.loading = false
  }
}

const resetReferral = () => {
  referralStep.code = ''
  referralStep.validated = false
  referralStep.error = ''
  referralStep.meta = ''
}

// Validation des formulaires
const validateLoginForm = () => {
  Object.keys(loginErrors).forEach(key => delete loginErrors[key])
  
  if (!loginForm.email) {
    loginErrors.email = 'L\'email est requis'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
    loginErrors.email = 'Format d\'email invalide'
  }
  
  if (!loginForm.password) {
    loginErrors.password = 'Le mot de passe est requis'
  }
  
  return Object.keys(loginErrors).length === 0
}

const validateRegisterForm = () => {
  Object.keys(registerErrors).forEach(key => delete registerErrors[key])
  
  if (!registerForm.prenom) {
    registerErrors.prenom = 'Le prénom est requis'
  }
  
  if (!registerForm.nom) {
    registerErrors.nom = 'Le nom est requis'
  }
  
  if (!registerForm.email) {
    registerErrors.email = 'L\'email est requis'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
    registerErrors.email = 'Format d\'email invalide'
  }
  
  if (!registerForm.password) {
    registerErrors.password = 'Le mot de passe est requis'
  } else if (registerForm.password.length < 8) {
    registerErrors.password = 'Le mot de passe doit contenir au moins 8 caractères'
  }
  
  if (!registerForm.confirmPassword) {
    registerErrors.confirmPassword = 'La confirmation du mot de passe est requise'
  } else if (registerForm.password !== registerForm.confirmPassword) {
    registerErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
  }
  
  return Object.keys(registerErrors).length === 0
}

const validateTwoFactorForm = () => {
  Object.keys(twoFactorErrors).forEach(key => delete twoFactorErrors[key])
  
  if (!twoFactorForm.code) {
    twoFactorErrors.code = 'Le code de vérification est requis'
  } else if (!/^\d{6}$/.test(twoFactorForm.code)) {
    twoFactorErrors.code = 'Le code doit contenir 6 chiffres'
  }
  
  return Object.keys(twoFactorErrors).length === 0
}

// Gestion des formulaires
const handleLogin = async () => {
  if (!validateLoginForm()) return
  
  try {
    loginLoading.value = true
    
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: loginForm.email,
        password: loginForm.password
      }
    })
    
    if (response.success) {
      if (response.requires2FA && response.a2f) {
        // Afficher le formulaire 2FA seulement si l'utilisateur a activé la 2FA
        showTwoFactor.value = true
        toastInfo('2FA active', 'Un code vient d\'etre envoyé à votre email')
      } else {
        // Connexion directe (sans 2FA ou 2FA désactivée)
        await handleSuccessfulAuth(response)
      }
    } else {
      const msg = response.message || 'Erreur de connexion'
      if (msg.toLowerCase().includes('non vérifié')) {
        toastWarning('Compte non verifie', 'Veuillez verifier votre email avant de vous connecter')
      } else {
        toastError('echec de connexion', msg)
      }
    }
  } catch (error) {
    const err = error as { statusMessage?: string; message?: string }
    const msg = err?.statusMessage || err?.message || 'Erreur de connexion. Veuillez réessayer.'
    if (msg.toLowerCase().includes('non vérifié')) {
      toastWarning('Compte non verifie', 'Veuillez verifier votre email avant de vous connecter')
    } else {
      toastError('Erreur de connexion', msg)
    }
  } finally {
    loginLoading.value = false
  }
}

const handleRegister = async () => {
  if (!referralStep.validated) {
    showNotification('Veuillez valider un code de parrainage', 'error')
    return
  }
  if (!validateRegisterForm()) return
  
  try {
    registerLoading.value = true
    
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
        body: {
        prenom: registerForm.prenom,
        nom: registerForm.nom,
        email: registerForm.email,
          password: registerForm.password,
          referralCode: referralStep.code
      }
    })
    
    if (response.success) {
      toastSuccess('Inscription réussie', 'Vérifiez votre email pour activer votre compte')
      // Basculer vers l'onglet connexion
      activeTab.value = 'login'
      // Pré-remplir l'email
      loginForm.email = registerForm.email
    } else {
      toastError('Inscription échouée', response.message || 'Erreur lors de la création du compte')
    }
  } catch (error) {
    const err = error as { statusMessage?: string; message?: string }
    toastError('Erreur d\'inscription', err?.statusMessage || err?.message || 'Veuillez réessayer')
  } finally {
    registerLoading.value = false
  }
}

const handleTwoFactor = async () => {
  if (!validateTwoFactorForm()) return
  
  try {
    twoFactorLoading.value = true
    
    const response = await $fetch('/api/auth/verify-2fa', {
      method: 'POST',
      body: {
        code: twoFactorForm.code
      }
    })
    
    if (response.success) {
      await handleSuccessfulAuth(response)
    } else {
      toastError('2FA invalide', response.message || 'Code de vérification incorrect')
    }
  } catch (error) {
    const err = error as { statusMessage?: string; message?: string }
    toastError('Erreur 2FA', err?.statusMessage || err?.message || 'Veuillez réessayer')
  } finally {
    twoFactorLoading.value = false
  }
}

const resendCode = async () => {
  try {
    resendLoading.value = true
    
    const response = await $fetch('/api/auth/resend-2fa', {
      method: 'POST'
    })
    
    if (response.success) {
      toastSuccess('Code renvoyé', 'Un nouveau code a été envoyé à votre email')
    } else {
      toastError('Échec de renvoi', response.message || 'Erreur lors de l\'envoi du code')
    }
  } catch (error) {
    const err = error as { statusMessage?: string; message?: string }
    toastError('Erreur d\'envoi', err?.statusMessage || err?.message || 'Veuillez réessayer')
  } finally {
    resendLoading.value = false
  }
}

const handleSuccessfulAuth = async (response) => {
  // Stocker les informations d'authentification
  const { user, token } = response
  
  // Stocker le token (vous pouvez utiliser un composable pour cela)
  localStorage.setItem('auth_token', token)
  localStorage.setItem('user', JSON.stringify(user))
  
  // Forcer la mise à jour de l'état d'authentification
  const { refreshAuthState } = useAuth()
  refreshAuthState()
  
  // Déclencher un événement pour notifier les composants
  if (process.client) {
    window.dispatchEvent(new CustomEvent('auth-state-changed', {
      detail: { user, token }
    }))
  }
  
  toastSuccess('Connexion réussie', 'Bienvenue !')
  
  // Rediriger vers le dashboard
  await router.push('/admin')
}

// Ancienne notification remplacée par les toasts (useToast)

// SEO
useHead({
  title: 'Authentification - QR-Add',
  meta: [
    { 
      name: 'description', 
      content: 'Connectez-vous à votre compte QR-Add pour gérer vos codes QR et codes-barres' 
    }
  ]
})
</script>

<style scoped>
/* ===== AUTH PAGE ===== */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background-image: url('/bg-qr.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
}

.auth-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
}

.auth-container {
  width: 100%;
  max-width: 480px;
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 1;
}

/* ===== AUTH HEADER ===== */
.auth-header {
  padding: var(--space-8);
  text-align: center;
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
  background: linear-gradient(135deg, rgba(250, 250, 250, 0.9) 0%, rgba(255, 255, 255, 0.9) 100%);
  position: relative;
  overflow: hidden;
}

.auth-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(0, 0, 0, 0.02) 50%, transparent 70%);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

.auth-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: #000000;
  margin-bottom: var(--space-4);
  position: relative;
  z-index: 1;
}

.logo-icon {
  font-size: var(--font-size-3xl);
  color: #000000;
}

.logo-text {
  font-weight: var(--font-weight-bold);
}

.auth-subtitle {
  font-size: var(--font-size-lg);
  color: #6b7280;
  margin: 0;
  position: relative;
  z-index: 1;
}

/* ===== AUTH TABS ===== */
.auth-tabs {
  display: flex;
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
  background-color: rgba(250, 250, 250, 0.9);
}

.auth-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-4);
  background-color: transparent;
  border: none;
  color: #6b7280;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  border-bottom: 3px solid transparent;
  position: relative;
}

.auth-tab:hover {
  color: #000000;
  background-color: rgba(255, 255, 255, 0.95);
}

.auth-tab--active {
  color: #000000;
  border-bottom-color: #000000;
  background-color: rgba(255, 255, 255, 0.95);
}

.tab-icon {
  font-size: var(--font-size-sm);
}

.tab-text {
  font-weight: var(--font-weight-medium);
}

/* ===== AUTH FORM ===== */
.auth-form {
  padding: var(--space-8);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  position: relative;
}

.form-group:hover .form-input {
  border-color: #000000;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: #000000;
  margin-bottom: var(--space-1);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.form-label::after {
  content: '*';
  color: #ef4444;
  font-weight: var(--font-weight-bold);
}

.form-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: var(--space-4) var(--space-4) var(--space-4) var(--space-12);
  font-size: var(--font-size-base);
  border: 2px solid rgba(229, 231, 235, 0.8);
  border-radius: 0.5rem;
  background-color: rgba(250, 250, 250, 0.9);
  color: #000000;
  transition: all var(--transition-normal);
  font-weight: var(--font-weight-medium);
}

.form-input:focus {
  outline: none;
  border-color: #000000;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.form-input--error {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
}

.form-input::placeholder {
  color: #6b7280;
  font-weight: var(--font-weight-normal);
}

.input-icon {
  position: absolute;
  left: var(--space-4);
  color: #6b7280;
  font-size: var(--font-size-base);
  transition: color var(--transition-normal);
  z-index: 2;
}

.form-input:focus ~ .input-icon,
.form-group:hover .input-icon {
  color: #000000;
}

.password-toggle {
  position: absolute;
  right: var(--space-4);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--border-radius);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.password-toggle:hover {
  color: #000000;
  background-color: rgba(250, 250, 250, 0.9);
  transform: scale(1.1);
}

.form-error {
  font-size: var(--font-size-sm);
  color: #ef4444;
  font-weight: var(--font-weight-medium);
  margin-top: var(--space-1);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.form-error::before {
  content: '⚠';
  font-size: var(--font-size-xs);
}

/* ===== TWO FACTOR ===== */
.two-factor-header {
  text-align: center;
  margin-bottom: var(--space-8);
  padding: var(--space-6);
  background: linear-gradient(135deg, rgba(250, 250, 250, 0.9) 0%, rgba(255, 255, 255, 0.9) 100%);
  border-radius: 0.5rem;
  border: 1px solid rgba(229, 231, 235, 0.8);
}

.two-factor-icon {
  font-size: var(--font-size-4xl);
  color: #000000;
  margin-bottom: var(--space-4);
}

.two-factor-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: #000000;
  margin-bottom: var(--space-2);
}

.two-factor-description {
  font-size: var(--font-size-base);
  color: #6b7280;
  line-height: var(--line-height-relaxed);
}

.two-factor-actions {
  margin-top: var(--space-6);
  padding-top: var(--space-6);
  border-top: 1px solid rgba(229, 231, 235, 0.8);
}

/* ===== AUTH FOOTER ===== */
.auth-footer {
  padding: var(--space-6);
  border-top: 1px solid rgba(229, 231, 235, 0.8);
  text-align: center;
  background-color: rgba(250, 250, 250, 0.9);
}

/* ===== BUTTONS ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all var(--transition-normal);
  text-decoration: none;
  outline: none;
  min-height: 48px;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn--primary {
  background: linear-gradient(135deg, #000000 0%, #374151 100%);
  color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.btn--primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #374151 0%, #000000 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.btn--outline {
  background: linear-gradient(135deg, rgba(250, 250, 250, 0.9) 0%, rgba(255, 255, 255, 0.9) 100%);
  color: #000000;
  border-color: rgba(229, 231, 235, 0.8);
}

.btn--outline:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.95) 100%);
  border-color: #000000;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.btn--text {
  background: none;
  border: none;
  color: #6b7280;
  padding: var(--space-2) var(--space-4);
  font-weight: var(--font-weight-medium);
  min-height: auto;
}

.btn--text:hover {
  color: #000000;
  background-color: rgba(250, 250, 250, 0.9);
  border-radius: var(--border-radius);
}

.btn--block {
  width: 100%;
}

.btn-icon {
  flex-shrink: 0;
  font-size: var(--font-size-sm);
}

.btn-text {
  font-weight: var(--font-weight-medium);
}

/* ===== NOTIFICATIONS ===== */
.notification {
  position: fixed;
  top: var(--space-6);
  right: var(--space-6);
  padding: var(--space-4) var(--space-6);
  background-color: #000000;
  color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  z-index: var(--z-tooltip);
  animation: slideIn 0.3s ease-out;
  font-weight: var(--font-weight-medium);
  border: 2px solid #374151;
  backdrop-filter: blur(10px);
  transform-origin: top right;
}

.notification--success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: #059669;
}

.notification--error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-color: #dc2626;
}

@keyframes slideIn {
  from {
    transform: translateX(100%) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 640px) {
  .auth-page {
    padding: var(--space-4);
    background-attachment: scroll;
  }
  
  .auth-container {
    border-radius: 0.5rem;
    max-width: 100%;
    margin: var(--space-2);
    backdrop-filter: blur(15px);
  }
  
  .auth-header {
    padding: var(--space-6);
  }
  
  .auth-form {
    padding: var(--space-6);
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .auth-tabs {
    flex-direction: column;
  }
  
  .auth-tab {
    border-bottom: 1px solid #e5e7eb;
  }
  
  .auth-tab--active {
    border-bottom-color: #000000;
  }
  
  .form-input {
    padding: var(--space-3) var(--space-3) var(--space-3) var(--space-10);
  }
  
  .input-icon {
    left: var(--space-3);
  }
  
  .password-toggle {
    right: var(--space-3);
  }
  
  .notification {
    top: var(--space-4);
    right: var(--space-4);
    left: var(--space-4);
    text-align: center;
  }
}

@media (max-width: 480px) {
  .auth-container {
    margin: 0;
    border-radius: 0;
    min-height: 100vh;
    backdrop-filter: blur(10px);
  }
  
  .auth-page {
    padding: 0;
    background-attachment: scroll;
  }
}
</style> 