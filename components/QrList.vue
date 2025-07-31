<!-- components/QrList.vue -->
<template>
  <div class="qr-list">
    <!-- Recherche et filtres -->
    <div class="search-section">
      <div class="search-input-group">
        <svg class="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input 
          v-model="searchTerm"
          type="text"
          class="search-input"
          placeholder="Rechercher un produit..."
        />
      </div>
      
      <select
        v-model="filterType"
        class="filter-select"
      >
        <option value="">Tous les types</option>
        <option 
          v-for="type in typeOptions" 
          :key="type.value"
          :value="type.value"
        >
          {{ type.label }}
        </option>
      </select>
    </div>

    <!-- Liste des QR codes -->
    <div class="qr-list-container">
      <!-- État vide -->
      <div v-if="filteredQrCodes.length === 0" class="empty-state">
        <svg class="empty-icon" width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293L12 15.586a1 1 0 01-1.414 0L9.293 13.293A1 1 0 008.586 13H6"/>
        </svg>
        <p class="empty-text">Aucun QR code trouvé</p>
        <p class="empty-subtext">Créez votre premier code QR !</p>
      </div>

      <!-- Cartes QR -->
      <div 
        v-for="qr in filteredQrCodes" 
        :key="qr.id"
        class="qr-card"
        @click="showQrDetail(qr)"
      >
        <div class="qr-card-content">
          <div class="qr-card-header">
            <span class="qr-badge">{{ qr.typeProduit }}</span>
            <span class="qr-date">{{ formatDate(qr.dateCreation) }}</span>
          </div>
          
          <div class="qr-card-body">
            <div class="qr-info">
              <h3 class="qr-title">{{ qr.nomProduit }}</h3>
              
              <div class="qr-details">
                <div class="qr-detail-item">
                  <svg class="detail-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  <span>{{ qr.franchise }}</span>
                </div>
                
                <div class="qr-detail-row">
                  <div class="qr-detail-item price">
                    <svg class="detail-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                    </svg>
                    <span>{{ qr.prixVente }} FCFA</span>
                  </div>
                  <div class="qr-detail-item">
                    <svg class="detail-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                    </svg>
                    <span>{{ qr.poids }} {{ qr.unitePoids }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- QR Code miniature -->
            <div class="qr-preview">
              <img 
                :src="qr.codePng" 
                :alt="`QR Code ${qr.nomProduit}`"
                class="qr-mini"
              />
              <div class="qr-overlay">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination-section" v-if="pagination && pagination.totalPages > 1">
      <div class="pagination-info">
        <span class="pagination-text">
          Page {{ pagination.page }} sur {{ pagination.totalPages }}
        </span>
        <span class="pagination-count">
          {{ pagination.total }} QR codes au total
        </span>
      </div>
      
      <div class="pagination-controls">
        <button 
          class="btn btn--outline btn--small"
          :disabled="!pagination.hasPrev"
          @click="changePage(pagination.page - 1)"
        >
          <svg class="btn-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Précédent
        </button>
        
        <div class="pagination-numbers">
          <button 
            v-for="pageNum in visiblePages" 
            :key="pageNum"
            class="btn btn--small"
            :class="pageNum === pagination.page ? 'btn--primary' : 'btn--outline'"
            :disabled="pageNum === '...'"
            @click="pageNum !== '...' && changePage(pageNum)"
          >
            {{ pageNum }}
          </button>
        </div>
        
        <button 
          class="btn btn--outline btn--small"
          :disabled="!pagination.hasNext"
          @click="changePage(pagination.page + 1)"
        >
          Suivant
          <svg class="btn-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Bouton rafraîchir -->
    <div class="refresh-section">
      <button 
        class="btn btn--outline btn--block"
        @click="$emit('refresh-list')"
      >
        <svg class="btn-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Actualiser la liste
      </button>
    </div>

    <!-- Modal détail QR Code -->
    <Teleport to="body">
      <div v-if="showDetailModal" class="modal-overlay" @click="closeModal">
        <div class="modal modal--large" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">{{ selectedQr?.nomProduit }}</h3>
            <button 
              class="btn btn--ghost btn--small"
              @click="showDetailModal = false"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="modal-body" v-if="selectedQr">
            <!-- QR Code grand format -->
            <div class="qr-showcase">
              <img 
                :src="selectedQr.codePng" 
                :alt="`QR Code ${selectedQr.nomProduit}`"
                class="qr-large"
              />
            </div>

            <!-- Détails complets -->
            <div class="details-grid">
              <div class="detail-card">
                <div class="detail-card-icon detail-card-icon--blue">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                  </svg>
                </div>
                <div class="detail-card-content">
                  <span class="detail-label">Type</span>
                  <span class="detail-value">{{ selectedQr.typeProduit }}</span>
                </div>
              </div>

              <div class="detail-card">
                <div class="detail-card-icon detail-card-icon--purple">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <div class="detail-card-content">
                  <span class="detail-label">Franchise</span>
                  <span class="detail-value">{{ selectedQr.franchise }}</span>
                </div>
              </div>

              <div class="detail-card">
                <div class="detail-card-icon detail-card-icon--green">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                  </svg>
                </div>
                <div class="detail-card-content">
                  <span class="detail-label">Prix</span>
                  <span class="detail-value detail-value--price">{{ selectedQr.prixVente }} FCFA</span>
                </div>
              </div>

              <div class="detail-card">
                <div class="detail-card-icon detail-card-icon--orange">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                  </svg>
                </div>
                <div class="detail-card-content">
                  <span class="detail-label">Poids</span>
                  <span class="detail-value">{{ selectedQr.poids }} {{ selectedQr.unitePoids }}</span>
                </div>
              </div>

              <div class="detail-card">
                <div class="detail-card-icon detail-card-icon--cyan">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                  </svg>
                </div>
                <div class="detail-card-content">
                  <span class="detail-label">Fournisseur</span>
                  <span class="detail-value">{{ selectedQr.fournisseur }}</span>
                </div>
              </div>

              <div class="detail-card">
                <div class="detail-card-icon detail-card-icon--indigo">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div class="detail-card-content">
                  <span class="detail-label">Créé par</span>
                  <span class="detail-value">{{ selectedQr.user?.nom || 'Utilisateur' }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="modal-actions">
              <button 
                class="btn btn--outline"
                @click="downloadQrCode(selectedQr)"
              >
                <svg class="btn-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Télécharger HD
              </button>
              
              <button 
                class="btn btn--primary"
                @click="editQrCode(selectedQr)"
              >
                <svg class="btn-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  qrCodes: {
    type: Array,
    default: () => []
  },
  pagination: {
    type: Object,
    default: null
  }
})

// Émissions
const emit = defineEmits(['refresh-list', 'edit-qr-code', 'change-page'])

// État local
const searchTerm = ref('')
const filterType = ref('')
const showDetailModal = ref(false)
const selectedQr = ref(null)

// Options de filtre des types
const typeOptions = computed(() => {
  const types = [...new Set(props.qrCodes.map(qr => qr.typeProduit))]
  return types.map(type => ({ label: type, value: type }))
})

// QR codes filtrés
const filteredQrCodes = computed(() => {
  let filtered = props.qrCodes

  if (searchTerm.value) {
    filtered = filtered.filter(qr => 
      qr.nomProduit.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      qr.franchise.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  if (filterType.value) {
    filtered = filtered.filter(qr => qr.typeProduit === filterType.value)
  }

  return filtered.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation))
})

// Fermer modal sur overlay
const closeModal = () => {
  showDetailModal.value = false
}

// Afficher le détail d'un QR code
const showQrDetail = (qr) => {
  selectedQr.value = qr
  showDetailModal.value = true
}

// Télécharger un QR code
const downloadQrCode = (qr) => {
  const link = document.createElement('a')
  link.href = qr.codePng
  link.download = `qr-${qr.nomProduit}.png`
  link.click()
}

// Modifier un QR code
const editQrCode = (qr) => {
  showDetailModal.value = false
  emit('edit-qr-code', qr)
}

// Formater la date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Changer de page
const changePage = (page) => {
  emit('change-page', page)
}

// Pages visibles pour la pagination
const visiblePages = computed(() => {
  if (!props.pagination) return []
  
  const { page, totalPages } = props.pagination
  const pages = []
  
  // Toujours afficher la première page
  if (page > 1) {
    pages.push(1)
    if (page > 3) pages.push('...')
  }
  
  // Pages autour de la page courante
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
    if (i > 1 && i < totalPages) {
      pages.push(i)
    }
  }
  
  // Toujours afficher la dernière page
  if (page < totalPages) {
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }
  
  return pages
})
</script>

<style scoped>
/* ===== LAYOUT ===== */
.qr-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* ===== SEARCH SECTION ===== */
.search-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.search-input-group {
  position: relative;
}

.search-icon {
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: var(--space-3) var(--space-4) var(--space-3) var(--space-12);
  font-size: var(--font-size-base);
  color: var(--color-primary);
  background-color: var(--color-secondary);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--border-radius);
  outline: none;
  transition: all var(--transition-normal);
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.search-input::placeholder {
  color: var(--color-muted);
}

.filter-select {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-base);
  color: var(--color-primary);
  background-color: var(--color-secondary);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--border-radius);
  outline: none;
  transition: all var(--transition-normal);
}

.filter-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

/* ===== LIST CONTAINER ===== */
.qr-list-container {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-height: 500px;
  padding-right: var(--space-1);
}

/* Scrollbar personnalisée */
.qr-list-container::-webkit-scrollbar {
  width: 6px;
}

.qr-list-container::-webkit-scrollbar-track {
  background: var(--color-light);
  border-radius: 3px;
}

.qr-list-container::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.qr-list-container::-webkit-scrollbar-thumb:hover {
  background: var(--color-muted);
}

/* ===== EMPTY STATE ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16) var(--space-6);
  text-align: center;
}

.empty-icon {
  color: var(--color-muted);
  opacity: 0.5;
  margin-bottom: var(--space-4);
}

.empty-text {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-muted);
  margin: 0 0 var(--space-2) 0;
}

.empty-subtext {
  font-size: var(--font-size-sm);
  color: var(--color-muted);
  opacity: 0.8;
  margin: 0;
}

/* ===== QR CARDS ===== */
.qr-card {
  background-color: var(--color-secondary);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all var(--transition-normal);
  overflow: hidden;
}

.qr-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.qr-card-content {
  padding: var(--space-4);
}

.qr-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}

.qr-badge {
  background-color: var(--color-primary);
  color: var(--color-secondary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.qr-date {
  font-size: var(--font-size-xs);
  color: var(--color-muted);
}

.qr-card-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.qr-info {
  flex: 1;
  min-width: 0;
}

.qr-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  margin: 0 0 var(--space-3) 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.qr-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.qr-detail-item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
  color: var(--color-muted);
}

.qr-detail-item.price {
  color: var(--color-success);
  font-weight: var(--font-weight-semibold);
}

.qr-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-icon {
  flex-shrink: 0;
  opacity: 0.7;
}

/* ===== QR PREVIEW ===== */
.qr-preview {
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: var(--border-radius);
  overflow: hidden;
  border: var(--border-width) solid var(--color-border);
}

.qr-mini {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.qr-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all var(--transition-normal);
  color: white;
}

.qr-preview:hover .qr-overlay {
  opacity: 1;
}

/* ===== PAGINATION ===== */
.pagination-section {
  padding-top: var(--space-4);
  border-top: var(--border-width) solid var(--color-border);
  margin-bottom: var(--space-4);
}

.pagination-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
  font-size: var(--font-size-sm);
  color: var(--color-muted);
}

.pagination-text {
  font-weight: var(--font-weight-semibold);
}

.pagination-count {
  opacity: 0.8;
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.pagination-numbers {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.pagination-numbers .btn {
  min-width: 40px;
  height: 40px;
  padding: var(--space-2);
}

/* ===== REFRESH SECTION ===== */
.refresh-section {
  padding-top: var(--space-4);
  border-top: var(--border-width) solid var(--color-border);
}

/* ===== BOUTONS ===== */
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

.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-secondary);
  border-color: var(--color-primary);
}

.btn--primary:hover {
  background-color: var(--color-primary);
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn--ghost {
  background-color: transparent;
  color: var(--color-primary);
  border-color: transparent;
}

.btn--ghost:hover {
  background-color: var(--color-light);
}

.btn--small {
  padding: var(--space-2);
  min-height: 32px;
}

.btn--block {
  width: 100%;
}

.btn-icon {
  flex-shrink: 0;
}

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: var(--space-4);
  backdrop-filter: blur(4px);
}

.modal {
  background-color: var(--color-secondary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease-out;
}

.modal--large {
  max-width: 700px;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6) var(--space-6) 0;
}

.modal-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin: 0;
}

.modal-body {
  padding: var(--space-6);
}

/* ===== QR SHOWCASE ===== */
.qr-showcase {
  display: flex;
  justify-content: center;
  padding: var(--space-8);
  background-color: var(--color-light);
  border-radius: var(--border-radius);
  margin-bottom: var(--space-8);
}

.qr-large {
  max-width: 250px;
  max-height: 250px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
}

/* ===== DETAILS GRID ===== */
.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.detail-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background-color: var(--color-light);
  border-radius: var(--border-radius);
  border: var(--border-width) solid var(--color-border);
}

.detail-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--border-radius);
  flex-shrink: 0;
}

.detail-card-icon--blue { background-color: #dbeafe; color: #1d4ed8; }
.detail-card-icon--purple { background-color: #ede9fe; color: #7c3aed; }
.detail-card-icon--green { background-color: #d1fae5; color: #059669; }
.detail-card-icon--orange { background-color: #fed7aa; color: #ea580c; }
.detail-card-icon--cyan { background-color: #cffafe; color: #0891b2; }
.detail-card-icon--indigo { background-color: #e0e7ff; color: #4338ca; }

.detail-card-content {
  flex: 1;
  min-width: 0;
}

.detail-label {
  display: block;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-1);
}

.detail-value {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-value--price {
  color: var(--color-success);
  font-size: var(--font-size-base);
}

/* ===== MODAL ACTIONS ===== */
.modal-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 640px) {
  .qr-card-body {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }
  
  .qr-preview {
    align-self: center;
    width: 60px;
    height: 60px;
  }
  
  .qr-detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .modal {
    margin: var(--space-2);
    max-width: none;
  }
}
</style>
  