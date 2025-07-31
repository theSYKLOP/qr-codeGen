<!-- pages/resultat.vue -->
<template>
  <div class="resultat-page">
    <div class="container">
      <!-- Header avec bouton retour -->
      <div class="resultat-header">
        <button class="btn-back" @click="goBack">
          <FontAwesomeIcon :icon="['fas', 'chevron-left']" />
          Retour
        </button>
        <h1 class="resultat-title">Résultat</h1>
      </div>

      <!-- Ticket QR -->
      <div class="ticket-container">
        <div class="ticket">
          <!-- En-tête du ticket -->
          <div class="ticket__header">
            <div class="ticket__logo">
              <FontAwesomeIcon :icon="['fas', 'qrcode']" size="2x" />
            </div>
            <div class="ticket__brand">
              <h2 class="ticket__brand-name">Générateur QR 241</h2>
             
            </div>
          </div>

          <!-- Contenu du ticket -->
          <div class="ticket__content">
            <!-- Type de produit -->
            <div class="ticket__section">
              <div class="ticket__label">
                <FontAwesomeIcon :icon="['fas', 'tag']" />
                Type
              </div>
              <div class="ticket__value ticket__value--primary">
                {{ qrData.type || 'Non spécifié' }}
              </div>
            </div>

            <!-- Produit -->
            <div class="ticket__section">
              <div class="ticket__label">
                <FontAwesomeIcon :icon="['fas', 'box']" />
                Produit
              </div>
              <div class="ticket__value">
                {{ qrData.produit || 'Non spécifié' }}
              </div>
            </div>

            <!-- Franchise -->
            <div class="ticket__section">
              <div class="ticket__label">
                <FontAwesomeIcon :icon="['fas', 'building']" />
                Franchise
              </div>
              <div class="ticket__value">
                {{ qrData.franchise || 'Non spécifié' }}
              </div>
            </div>

            <!-- Prix -->
            <div class="ticket__section">
              <div class="ticket__label">
                <FontAwesomeIcon :icon="['fas', 'dollar-sign']" />
                Prix
              </div>
              <div class="ticket__value ticket__value--price">
                {{ qrData.prix || 'Non spécifié' }}
              </div>
            </div>

            <!-- Poids -->
            <div class="ticket__section">
              <div class="ticket__label">
                <FontAwesomeIcon :icon="['fas', 'weight-hanging']" />
                Poids
              </div>
              <div class="ticket__value">
                {{ qrData.poids || 'Non spécifié' }}
              </div>
            </div>

            <!-- Fournisseur -->
            <div class="ticket__section">
              <div class="ticket__label">
                <FontAwesomeIcon :icon="['fas', 'truck']" />
                Fournisseur
              </div>
              <div class="ticket__value">
                {{ qrData.fournisseur || 'Non spécifié' }}
              </div>
            </div>

            <!-- Séparateur -->
            <div class="ticket__divider"></div>

            <!-- Informations de création -->
            <div class="ticket__footer">
              <div class="ticket__footer-section">
                <div class="ticket__label">
                  <FontAwesomeIcon :icon="['fas', 'user']" />
                  Auteur
                </div>
                <div class="ticket__value">
                  {{ qrData.auteur || 'Non spécifié' }}
                </div>
              </div>
              
              <div class="ticket__footer-section">
                <div class="ticket__label">
                  <FontAwesomeIcon :icon="['fas', 'calendar']" />
                  Date
                </div>
                <div class="ticket__value">
                  {{ qrData.date || 'Non spécifié' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Pied de ticket -->
          <div class="ticket__bottom">
            <div class="ticket__barcode">
              <div class="barcode-line" v-for="i in 20" :key="i"></div>
            </div>
            <p class="ticket__footer-text">
              Merci pour votre confiance
            </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="resultat-actions">
        <button class="btn btn--primary" @click="shareTicket">
          <FontAwesomeIcon :icon="['fas', 'share']" />
          Partager
        </button>
        <button class="btn btn--outline" @click="downloadTicket">
          <FontAwesomeIcon :icon="['fas', 'download']" />
          Télécharger
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Définition du nom du composant
defineOptions({
  name: 'ResultatPage'
})

// État réactif
const qrData = ref({})

// Récupération des données depuis l'URL
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const dataParam = urlParams.get('data')
  
  if (dataParam) {
    try {
      qrData.value = JSON.parse(decodeURIComponent(dataParam))
    } catch (error) {
      console.error('Erreur lors du parsing des données QR:', error)
      // Données par défaut pour la démo
      qrData.value = {
        type: 'Alimentaire',
        produit: 'Arachide',
        franchise: 'Ngueme',
        prix: '10000 FCFA',
        poids: '100 g',
        fournisseur: 'PROXI NOVA',
        auteur: 'MEHDI',
        date: '31/07/2025'
      }
    }
  } else {
    // Si pas de données dans l'URL, essayer de récupérer depuis le hash
    const hash = window.location.hash.substring(1)
    if (hash) {
      try {
        qrData.value = JSON.parse(decodeURIComponent(hash))
      } catch (error) {
        console.error('Erreur lors du parsing des données depuis le hash:', error)
      }
    }
  }
})

// Navigation
const router = useRouter()

const goBack = () => {
  router.push('/')
}

// Actions
const shareTicket = () => {
  if (navigator.share) {
    navigator.share({
      title: 'Ticket QR - Générateur QR',
      text: `Produit: ${qrData.value.produit} - Prix: ${qrData.value.prix}`,
      url: window.location.href
    })
  } else {
    // Fallback pour les navigateurs qui ne supportent pas l'API Share
    navigator.clipboard.writeText(window.location.href)
    showNotification('Lien copié dans le presse-papiers !', 'success')
  }
}

const downloadTicket = () => {
  // Logique de téléchargement du ticket
  showNotification('Fonctionnalité en cours de développement', 'info')
}

const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div')
  notification.className = `notification notification--${type}`
  notification.textContent = message
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// SEO
useHead({
  title: 'Résultat QR - Générateur QR',
  meta: [
    { 
      name: 'description', 
      content: 'Résultat du scan de code QR sous forme de ticket élégant' 
    }
  ]
})
</script>

<style scoped>
/* ===== PAGE LAYOUT ===== */
.resultat-page {
  min-height: calc(100vh - 8rem);
  padding: var(--space-8) 0;
}

/* ===== HEADER ===== */
.resultat-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.btn-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: var(--color-secondary);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--border-radius);
  color: var(--color-primary);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.btn-back:hover {
  background-color: var(--color-light);
  border-color: var(--color-primary);
  transform: translateX(-2px);
}

.resultat-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin: 0;
}

/* ===== TICKET ===== */
.ticket-container {
  max-width: 450px;
  margin: 0 auto var(--space-8);
}

.ticket {
  background-color: var(--color-secondary);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-normal);
}

.ticket:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-2px);
}

.ticket__header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-6);
  background-color: var(--color-light);
  border-bottom: var(--border-width) solid var(--color-border);
}

.ticket__logo {
  color: var(--color-primary);
}

.ticket__brand-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin: 0 0 var(--space-1) 0;
}

.ticket__brand-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-muted);
  margin: 0;
}

.ticket__content {
  padding: var(--space-6);
}

.ticket__section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border);
}

.ticket__section:last-of-type {
  border-bottom: none;
}

.ticket__label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-muted);
  font-weight: var(--font-weight-medium);
}

.ticket__value {
  font-size: var(--font-size-base);
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
  text-align: right;
}

.ticket__value--primary {
  color: var(--color-accent);
  font-weight: var(--font-weight-bold);
}

.ticket__value--price {
  color: var(--color-success);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
}

.ticket__divider {
  height: 1px;
  background: linear-gradient(to right, transparent, var(--color-border), transparent);
  margin: var(--space-4) 0;
}

.ticket__footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.ticket__footer-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.ticket__bottom {
  padding: var(--space-4) var(--space-6);
  background-color: var(--color-light);
  border-top: var(--border-width) solid var(--color-border);
  text-align: center;
}

.ticket__barcode {
  display: flex;
  justify-content: center;
  gap: 1px;
  margin-bottom: var(--space-3);
}

.barcode-line {
  width: 2px;
  height: 20px;
  background-color: var(--color-primary);
  border-radius: 1px;
}

.ticket__footer-text {
  font-size: var(--font-size-xs);
  color: var(--color-muted);
  margin: 0;
}

/* ===== ACTIONS ===== */
.resultat-actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
  margin-top: var(--space-8);
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
  min-height: 48px;
  position: relative;
  overflow: hidden;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-secondary);
  border-color: var(--color-primary);
}

.btn--primary:hover:not(:disabled) {
  background-color: #333333;
  border-color: #333333;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn--outline {
  background-color: transparent;
  color: var(--color-primary);
  border-color: var(--color-border);
}

.btn--outline:hover:not(:disabled) {
  background-color: var(--color-light);
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
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

/* ===== RESPONSIVE ===== */
@media (max-width: 640px) {
  .resultat-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }
  
  .resultat-title {
    font-size: var(--font-size-xl);
  }
  
  .ticket-container {
    margin: 0 var(--space-4) var(--space-8);
  }
  
  .resultat-actions {
    flex-direction: column;
    padding: 0 var(--space-4);
  }
  
  .btn {
    width: 100%;
  }
}
</style> 