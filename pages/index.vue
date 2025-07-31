<!-- app/pages/index.vue -->
<template>
  <div class="page">
    <div class="container">
      <!-- En-tête de page -->
      <div class="page-header">
        <div class="page-header__content">
          
          <h1 class="page-header__title">
            Créez vos Codes QR
          </h1>
          <p class="page-header__description">
            Interface pour gérer vos codes QR facilement
          </p>
        </div>
      </div>

      <!-- Layout principal -->
      <div class="main-layout">
        <!-- Section formulaire -->
        <section class="main-layout__form">
          <div class="card card--elevated">
            <div class="card__header">
              <div class="card-header">
                <div class="card-header__icon">
                  <FontAwesomeIcon icon="fa-plus" />
                </div>
                <div class="card-header__text">
                  <h2 class="card__title">{{ editMode ? 'Modifier Code QR' : 'Nouveau Code QR' }}</h2>
                  <p class="card__subtitle">{{ editMode ? 'Modifiez les informations du produit' : 'Remplissez les informations du produit' }}</p>
                </div>
              </div>
            </div>
            <div class="card__body">
              <QrForm 
                :edit-mode="editMode"
                :qr-code-to-edit="qrCodeToEdit"
                @qr-created="handleQrCreated"
                @qr-updated="handleQrUpdated"
              />
              
              <!-- Bouton annuler en mode édition -->
              <div v-if="editMode" class="edit-mode-actions">
                <button 
                  class="btn btn--outline btn--block"
                  @click="exitEditMode"
                >
                  <FontAwesomeIcon icon="fa-times" class="btn-icon" />
                  Annuler la modification
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Section liste -->
        <section class="main-layout__list">
          <div class="card card--elevated">
            <div class="card__header">
              <div class="card-header">
                <div class="card-header__icon">
                  <FontAwesomeIcon icon="fa-list" />
                </div>
                <div class="card-header__text">
                  <h2 class="card__title">Historique</h2>
                  <p class="card__subtitle">{{ qrCodes.length }} codes générés</p>
                </div>
              </div>
            </div>
            <div class="card__body">
              <QrList 
                :qr-codes="qrCodes" 
                :pagination="pagination"
                :is-loading="loading"
                @refresh-list="() => fetchQrCodes(1)"
                @edit-qr-code="handleEditQrCode"
                @change-page="handleChangePage"
              />
            </div>
          </div>
        </section>
      </div>

      <!-- Section statistiques -->
      <section class="stats-section">
        <div class="stats-grid">
          <div class="stat-card" v-for="stat in stats" :key="stat.label">
            <div class="stat-card__icon">
              <FontAwesomeIcon :icon="stat.icon" />
            </div>
            <div class="stat-card__content">
              <div class="stat-card__value">{{ stat.value }}</div>
              <div class="stat-card__label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// Définition du nom du composant pour résoudre l'erreur ESLint
defineOptions({
  name: 'QrGeneratorPage'
})

// État réactif
const qrCodes = ref([])
const loading = ref(false)
const editMode = ref(false)
const qrCodeToEdit = ref(null)
const currentPage = ref(1)
const pagination = ref(null)

// Log de débogage pour vérifier que les composants sont disponibles
console.log('Page mounted, checking components availability')

// Statistiques calculées
const stats = computed(() => [
  {
    label: 'Codes Créés',
    value: qrCodes.value.length,
    icon: 'fa-qrcode'
  },
  {
    label: 'Types Produits',
    value: new Set(qrCodes.value.map(qr => qr.typeProduit)).size,
    icon: 'fa-tag'
  },
  {
    label: 'Valeur Totale',
    value: `${qrCodes.value.reduce((sum, qr) => sum + (qr.prixVente || 0), 0).toLocaleString()} FCFA`,
    icon: 'fa-dollar-sign'
  }
])

// Fonctions
const fetchQrCodes = async (page = 1) => {
  try {
    loading.value = true
    console.log('Fetching QR codes for page:', page)
    const response = await $fetch(`/api/qrcodes?page=${page}&limit=5`)
    qrCodes.value = response.data || []
    pagination.value = response.pagination
    currentPage.value = page
    console.log('QR codes loaded:', qrCodes.value)
    console.log('Pagination:', pagination.value)
  } catch (error) {
    console.error('Erreur lors du chargement des QR codes:', error)
  } finally {
    loading.value = false
  }
}

const handleQrCreated = (newQrCode) => {
  console.log('New QR code created:', newQrCode)
  // Recharger la première page après création
  fetchQrCodes(1)
  
  // Notification simple (remplace useToast)
  showNotification('QR Code créé avec succès !', 'success')
}

const handleQrUpdated = (updatedQrCode) => {
  console.log('QR code updated:', updatedQrCode)
  // Recharger la page courante après modification
  fetchQrCodes(currentPage.value)
  
  // Sortir du mode édition
  exitEditMode()
  
  // Notification simple
  showNotification('QR Code modifié avec succès !', 'success')
}

const handleEditQrCode = (qrCode) => {
  console.log('Editing QR code:', qrCode)
  qrCodeToEdit.value = qrCode
  editMode.value = true
  console.log('Edit mode activated:', editMode.value, qrCodeToEdit.value)
}

const exitEditMode = () => {
  editMode.value = false
  qrCodeToEdit.value = null
}

const handleChangePage = (page) => {
  console.log('Changing to page:', page)
  fetchQrCodes(page)
}

// Notification simple
const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div')
  notification.className = `notification notification--${type}`
  notification.textContent = message
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// Lifecycle
onMounted(() => {
  console.log('Page mounted, components should be visible')
  fetchQrCodes()
})

// SEO
useHead({
  title: 'Générateur QR - Interface Épurée 2025',
  meta: [
    { 
      name: 'description', 
      content: 'Générateur de codes QR avec interface minimaliste noir et blanc' 
    }
  ]
})
</script>

<style scoped>
/* ===== PAGE LAYOUT ===== */
.page {
  min-height: calc(100vh - 8rem);
}

/* ===== PAGE HEADER ===== */
.page-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.page-header__content {
  max-width: 600px;
  margin: 0 auto;
}

.page-header__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background-color: var(--color-secondary);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--border-radius-xl);
  font-size: var(--font-size-sm);
  color: var(--color-muted);
  margin-bottom: var(--space-6);
}

.page-header__title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--space-4);
  line-height: var(--line-height-tight);
  letter-spacing: -0.025em;
}

.page-header__description {
  font-size: var(--font-size-lg);
  color: var(--color-muted);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

/* ===== MAIN LAYOUT ===== */
.main-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
  margin-bottom: var(--space-16);
}

@media (min-width: 1024px) {
  .main-layout {
    grid-template-columns: 2fr 1fr;
  }
}

.main-layout__form,
.main-layout__list {
  height: fit-content;
}

@media (min-width: 1024px) {
  .main-layout__list {
    position: sticky;
    top: calc(4rem + var(--space-8));
  }
}

/* ===== CARD ===== */
.card {
  background-color: var(--color-secondary);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.card--elevated {
  box-shadow: var(--shadow-md);
}

.card--elevated:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.card__header {
  padding: var(--space-6);
  border-bottom: var(--border-width) solid var(--color-border);
  background-color: var(--color-light);
}

.card__body {
  padding: var(--space-6);
}

.card__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin: 0 0 var(--space-1) 0;
}

.card__subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-muted);
  margin: 0;
}

/* ===== CARD HEADER ===== */
.card-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.card-header__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: var(--color-primary);
  color: var(--color-secondary);
  border-radius: var(--border-radius-lg);
}

.card-header__text {
  flex: 1;
}

/* ===== STATS SECTION ===== */
.stats-section {
  margin-top: var(--space-16);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-6);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-6);
  background-color: var(--color-secondary);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.stat-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: var(--color-light);
  border-radius: var(--border-radius);
  color: var(--color-primary);
}

.stat-card__value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  line-height: 1;
}

.stat-card__label {
  font-size: var(--font-size-sm);
  color: var(--color-muted);
  margin-top: var(--space-1);
}

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

/* ===== EDIT MODE ACTIONS ===== */
.edit-mode-actions {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: var(--border-width) solid var(--color-border);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  border: var(--border-width) solid transparent;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all var(--transition-normal);
  text-decoration: none;
  outline: none;
  min-height: 44px;
}

.btn--outline {
  background-color: transparent;
  color: var(--color-primary);
  border-color: var(--color-border);
}

.btn--outline:hover {
  background-color: var(--color-light);
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

.btn--block {
  width: 100%;
}

.btn-icon {
  flex-shrink: 0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 640px) {
  .page-header__title {
    font-size: var(--font-size-3xl);
  }
  
  .page-header__description {
    font-size: var(--font-size-base);
  }
  
  .main-layout {
    gap: var(--space-6);
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
  