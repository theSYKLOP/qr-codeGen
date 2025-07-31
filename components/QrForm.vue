<!-- components/QrForm.vue -->
<template>
  <div class="qr-form">
    <form @submit.prevent="generateQr" class="form">
      
      <!-- Type de produit -->
      <div class="form-group">
        <label class="form-label required">Type de produit</label>
        <select 
          v-model="formData.typeProduit"
          class="form-select"
          required
        >
          <option value="">Sélectionnez un type</option>
          <option 
            v-for="type in typesProduit" 
            :key="type.value"
            :value="type.value"
          >
            {{ type.label }}
          </option>
        </select>
      </div>

      <!-- Nom du produit -->
      <div class="form-group">
        <label class="form-label required">Nom du produit</label>
        <input 
          v-model="formData.nomProduit"
          type="text"
          class="form-input"
          placeholder="Ex: Banane"
          required
        />
      </div>

      <!-- Franchise -->
      <div class="form-group">
        <label class="form-label required">Nom de la franchise</label>
        <input 
          v-model="formData.franchise"
          type="text"
          class="form-input"
          placeholder="Ex: PRIX IMPORT, Carrefour..."
          required
        />
      </div>

      <!-- Prix de vente -->
      <div class="form-group">
        <label class="form-label required">Prix de vente (FCFA)</label>
        <input 
          v-model="formData.prixVente"
          type="number"
          class="form-input"
          placeholder="Ex: 125000"
          required
        />
      </div>

      <!-- Poids avec unité -->
      <div class="form-group">
        <label class="form-label required">Poids</label>
        <div class="input-group">
          <input 
            v-model="formData.poids"
            type="number"
            step="0.01"
            class="form-input"
            placeholder="Ex: 1.5"
            required
          />
          <select 
            v-model="formData.unitePoids"
            class="form-select form-select--small"
          >
            <option 
              v-for="unite in unitesPoids" 
              :key="unite.value"
              :value="unite.value"
            >
              {{ unite.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Fournisseur -->
      <div class="form-group">
        <label class="form-label">Nom du fournisseur</label>
        <input 
          v-model="formData.fournisseur"
          type="text"
          class="form-input"
        />
      </div>

      <!-- Nom de l'utilisateur -->
      <div class="form-group">
        <label class="form-label required">Votre nom</label>
        <input 
          v-model="formData.auteur"
          type="text"
          class="form-input"
          placeholder="Ex: Jean Dupont"
          required
        />
      </div>

      <!-- Boutons d'action -->
      <div class="form-actions">
        <button 
          type="button"
          class="btn btn--secondary"
          @click="resetForm"
          :disabled="isGenerating"
        >
          <FontAwesomeIcon icon="fa-refresh" class="btn-icon" />
          Réinitialiser
        </button>
        
        <button 
          type="submit"
          class="btn btn--primary"
          :disabled="isGenerating"
        >
          <FontAwesomeIcon v-if="!isGenerating" icon="fa-qrcode" class="btn-icon" />
          <div v-if="isGenerating" class="loading-spinner"></div>
          {{ isGenerating ? 'Génération...' : (props.editMode ? 'Sauvegarder' : 'Générer QR Code') }}
        </button>
      </div>
    </form>

    <!-- Modal d'aperçu du QR Code -->
    <Teleport to="body">
      <div v-if="showQrModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">Aperçu du QR Code</h3>
            <button 
              class="btn btn--ghost btn--small"
              @click="showQrModal = false"
            >
              <FontAwesomeIcon icon="fa-times" />
            </button>
          </div>

          <div class="modal-body">
            <!-- QR Code généré -->
            <div class="qr-display">
              <img 
                v-if="generatedQrCode"
                :src="generatedQrCode" 
                alt="QR Code généré"
                class="qr-image"
              />
            </div>

            <!-- Informations produit -->
            <div class="product-info">
              <div class="info-item">
                <strong>Produit :</strong> {{ formData.nomProduit }}
              </div>
              <div class="info-item">
                <strong>Franchise :</strong> {{ formData.franchise }}
              </div>
              <div class="info-item">
                <strong>Prix :</strong> {{ formData.prixVente }} FCFA
              </div>
              <div class="info-item">
                <strong>Poids :</strong> {{ formData.poids }} {{ formData.unitePoids }}
              </div>
              <div class="info-item">
                <strong>Créé par :</strong> {{ formData.auteur }}
              </div>
            </div>

            <!-- Boutons d'action -->
            <div class="modal-actions">
              <button 
                class="btn btn--secondary"
                @click="downloadQr"
              >
                <FontAwesomeIcon icon="fa-download" class="btn-icon" />
                Télécharger PNG
              </button>
              
              <button 
                class="btn btn--primary"
                @click="saveQrToDatabase"
                :disabled="isSaving"
              >
                <FontAwesomeIcon v-if="!isSaving" icon="fa-check" class="btn-icon" />
                <div v-if="isSaving" class="loading-spinner"></div>
                {{ isSaving ? 'Sauvegarde...' : 'Sauvegarder' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import QRCode from 'qrcode'

// Props et émissions
const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  },
  qrCodeToEdit: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['qr-created', 'qr-updated'])

// État du composant
const showQrModal = ref(false)
const isGenerating = ref(false)
const isSaving = ref(false)
const generatedQrCode = ref('')

// Options pour les selects
const typesProduit = [
  { label: 'Agriculture', value: 'Agriculture' },
  { label: 'Pisciculture', value: 'Pisciculture' },
  { label: 'Légumes', value: 'Légumes' },
  { label: 'Fruits', value: 'Fruits' },
  { label: 'Céréales', value: 'Céréales' },
  { label: 'Élevage', value: 'Élevage' },
  { label: 'Produits laitiers', value: 'Produits laitiers' },
  { label: 'Épices & Condiments', value: 'Épices & Condiments' }
]

const unitesPoids = [
  { label: 'g', value: 'g' },
  { label: 'kg', value: 'kg' }
]

// Données du formulaire
const formData = reactive({
  typeProduit: '',
  nomProduit: '',
  franchise: '',
  prixVente: '',
  poids: '',
  unitePoids: 'g',
  fournisseur: 'PROXI NOVA',
  auteur: ''
})

// Initialiser le formulaire en mode édition
const initializeEditMode = () => {
  console.log('Initializing edit mode:', props.editMode, props.qrCodeToEdit)
  if (props.editMode && props.qrCodeToEdit) {
    const qrData = {
      typeProduit: props.qrCodeToEdit.typeProduit,
      nomProduit: props.qrCodeToEdit.nomProduit,
      franchise: props.qrCodeToEdit.franchise,
      prixVente: props.qrCodeToEdit.prixVente.toString(),
      poids: props.qrCodeToEdit.poids.toString(),
      unitePoids: props.qrCodeToEdit.unitePoids,
      fournisseur: props.qrCodeToEdit.fournisseur,
      auteur: props.qrCodeToEdit.user?.nom || 'Utilisateur'
    }
    console.log('Setting form data:', qrData)
    Object.assign(formData, qrData)
  }
}

// Initialiser le formulaire au montage et quand les props changent
onMounted(() => {
  initializeEditMode()
})

// Surveiller les changements des props pour le mode édition
watch(() => [props.editMode, props.qrCodeToEdit], (newValues) => {
  console.log('Props changed:', newValues)
  if (props.editMode && props.qrCodeToEdit) {
    initializeEditMode()
  }
}, { immediate: true })

// Fermer modal sur overlay
const closeModal = () => {
  showQrModal.value = false
}

// Réinitialiser le formulaire
const resetForm = () => {
  Object.assign(formData, {
    typeProduit: '',
    nomProduit: '',
    franchise: '',
    prixVente: '',
    poids: '',
    unitePoids: 'g',
    fournisseur: 'PROXI NOVA',
    auteur: ''
  })
}

// Générer le QR Code
const generateQr = async () => {
  try {
    isGenerating.value = true
    
    const qrData = {
      type: formData.typeProduit,
      produit: formData.nomProduit,
      franchise: formData.franchise,
      prix: `${formData.prixVente} FCFA`,
      poids: `${formData.poids} ${formData.unitePoids}`,
      fournisseur: formData.fournisseur,
      auteur: formData.auteur,
      date: new Date().toLocaleDateString('fr-FR')
    }
    
    generatedQrCode.value = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    
    showQrModal.value = true
    
  } catch (error) {
    console.error('Erreur génération QR:', error)
    alert('Impossible de générer le QR code')
  } finally {
    isGenerating.value = false
  }
}

// Télécharger le QR en PNG
const downloadQr = () => {
  const link = document.createElement('a')
  link.href = generatedQrCode.value
  link.download = `qr-${formData.nomProduit || 'code'}.png`
  link.click()
}

// Sauvegarder en base de données
const saveQrToDatabase = async () => {
  try {
    isSaving.value = true
    
    const qrCodeData = {
      typeProduit: formData.typeProduit,
      nomProduit: formData.nomProduit,
      franchise: formData.franchise,
      prixVente: parseInt(formData.prixVente),
      poids: parseFloat(formData.poids),
      unitePoids: formData.unitePoids,
      fournisseur: formData.fournisseur,
      auteur: formData.auteur,
      codePng: generatedQrCode.value
    }
    
    let response
    
    if (props.editMode && props.qrCodeToEdit) {
      // Mode modification
      response = await $fetch(`/api/qrcodes?id=${props.qrCodeToEdit.id}`, {
        method: 'PUT',
        body: qrCodeData
      })
      emit('qr-updated', response.data)
    } else {
      // Mode création
      response = await $fetch('/api/qrcodes', {
        method: 'POST',
        body: qrCodeData
      })
      emit('qr-created', response.data)
    }
    
    showQrModal.value = false
    resetForm()
    
    alert(props.editMode ? 'QR Code modifié avec succès !' : 'QR Code sauvegardé avec succès !')
    
  } catch (error) {
    console.error('Erreur sauvegarde:', error)
    alert('Impossible de sauvegarder le QR code')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
/* ===== FORMULAIRE ===== */
.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  margin: 0;
}

.form-label.required::after {
  content: " *";
  color: var(--color-error);
}

.form-input,
.form-select {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-base);
  line-height: 1.5;
  color: var(--color-primary);
  background-color: var(--color-secondary);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--border-radius);
  transition: all var(--transition-normal);
  outline: none;
}

.form-input:focus,
.form-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.form-input::placeholder {
  color: var(--color-muted);
}

.form-select--small {
  width: 80px;
  padding: var(--space-3) var(--space-2);
}

/* ===== INPUT GROUP ===== */
.input-group {
  display: flex;
  gap: var(--space-3);
  align-items: center;
}

.input-group .form-input {
  flex: 1;
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
  position: relative;
  overflow: hidden;
  min-height: 48px;
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
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn--secondary {
  background-color: var(--color-secondary);
  color: var(--color-primary);
  border-color: var(--color-border);
}

.btn--secondary:hover:not(:disabled) {
  background-color: var(--color-light);
  border-color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.btn--ghost {
  background-color: transparent;
  color: var(--color-primary);
  border-color: transparent;
}

.btn--ghost:hover:not(:disabled) {
  background-color: var(--color-light);
}

.btn--small {
  padding: var(--space-2);
  min-height: 32px;
}

.btn-icon {
  flex-shrink: 0;
}

/* ===== ACTIONS FORM ===== */
.form-actions {
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-6);
}

.form-actions .btn {
  flex: 1;
}

/* ===== LOADING SPINNER ===== */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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

/* ===== QR DISPLAY ===== */
.qr-display {
  display: flex;
  justify-content: center;
  padding: var(--space-6);
  background-color: var(--color-light);
  border-radius: var(--border-radius);
  margin-bottom: var(--space-6);
}

.qr-image {
  max-width: 200px;
  max-height: 200px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

/* ===== PRODUCT INFO ===== */
.product-info {
  background-color: var(--color-light);
  border-radius: var(--border-radius);
  padding: var(--space-6);
  margin-bottom: var(--space-6);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
  font-size: var(--font-size-sm);
  color: var(--color-primary);
}

.info-item:not(:last-child) {
  border-bottom: var(--border-width) solid var(--color-border);
}

.info-item strong {
  font-weight: var(--font-weight-semibold);
  color: var(--color-muted);
}

/* ===== MODAL ACTIONS ===== */
.modal-actions {
  display: flex;
  gap: var(--space-3);
}

.modal-actions .btn {
  flex: 1;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 640px) {
  .form-actions {
    flex-direction: column;
  }
  
  .input-group {
    flex-direction: column;
  }
  
  .form-select--small {
    width: 100%;
  }
  
  .modal {
    margin: var(--space-2);
    max-width: none;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>
  