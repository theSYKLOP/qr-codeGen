<!-- Page vitrine - Accueil -->
<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero__content">
          <div class="hero__text">
            <h1 class="hero__title">
              Générez vos <span class="text-highlight">Codes QR</span> et <span class="text-highlight">Codes-barres</span> en toute simplicité
            </h1>
            <p class="hero__description">
              Interface moderne et intuitive pour créer, gérer et organiser vos codes QR et codes-barres. 
              Parfait pour les commerces, entrepôts et gestion de stocks.
            </p>
            <div class="hero__actions">
              <!-- Actions pour utilisateurs non connectés -->
              <template v-if="!authState.isAuthenticated">
                <button 
                  class="btn btn--primary btn--large"
                  @click="navigateToLogin"
                >
                  <FontAwesomeIcon icon="fa-rocket" class="btn-icon" />
                  Commencer maintenant
                </button>
                <button 
                  class="btn btn--outline btn--large"
                  @click="scrollToFeatures"
                >
                  <FontAwesomeIcon icon="fa-info-circle" class="btn-icon" />
                  En savoir plus
                </button>
              </template>
              
              <!-- Actions pour utilisateurs connectés -->
              <template v-else>
                <button 
                  class="btn btn--primary btn--large"
                  @click="navigateToDashboard"
                >
                  <FontAwesomeIcon icon="fa-tachometer-alt" class="btn-icon" />
                  Accéder au Dashboard
                </button>
                <button 
                  class="btn btn--outline btn--large"
                  @click="scrollToFeatures"
                >
                  <FontAwesomeIcon icon="fa-info-circle" class="btn-icon" />
                  En savoir plus
                </button>
              </template>
            </div>
          </div>
          <div class="hero__visual">
            <div class="qr-demo">
              <img src="/scan.png" alt="Scanner QR moderne" class="qr-demo__image" width="640" height="360" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Fonctionnalités principales</h2>
          <p class="section-subtitle">Tout ce dont vous avez besoin pour gérer vos codes</p>
        </div>
        
          <div class="features-grid">
          <div v-for="feature in features" :key="feature.title" class="feature-card">
            <div class="feature-card__icon">
              <FontAwesomeIcon :icon="feature.icon" />
            </div>
            <h3 class="feature-card__title">{{ feature.title }}</h3>
            <p class="feature-card__description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section - Affichée uniquement pour les utilisateurs non connectés -->
    <section v-if="!authState.isAuthenticated" class="cta">
      <div class="container">
        <div class="cta__content">
          <h2 class="cta__title">Prêt à commencer ?</h2>
          <p class="cta__description">
            Rejoignez des milliers d'utilisateurs qui font confiance à QR-Add pour leurs besoins en codes QR et codes-barres.
          </p>
          <button 
            class="btn btn--cta"
            @click="navigateToLogin"
          >
            <FontAwesomeIcon icon="fa-user-plus" class="btn-icon" />
            Créer un compte
          </button>
        </div>
        
        <!-- Éléments décoratifs -->
        <div class="cta__decorations">
          <div class="cta__qr-code">
            <FontAwesomeIcon icon="fa-qrcode" />
          </div>
          <div class="cta__barcode">
            <FontAwesomeIcon icon="fa-barcode" />
          </div>
          <div class="cta__dots">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Définition du nom du composant
defineOptions({
  name: 'LandingPage'
})

// Auth
const { user, isAuthenticated, initializeAuth } = useAuth()
const authState = computed(() => ({
  user: user.value,
  isAuthenticated: isAuthenticated.value,
}))

onMounted(() => {
  initializeAuth()
})

// Fonctionnalités
const features = ref([
  {
    title: 'Génération rapide',
    description: 'Créez vos codes QR et codes-barres en quelques clics avec une interface intuitive.',
    icon: 'fa-bolt'
  },
  {
    title: 'Gestion organisée',
    description: 'Organisez et gérez tous vos codes dans une interface claire et structurée.',
    icon: 'fa-folder-open'
  },
  {
    title: 'Sécurité renforcée',
    description: 'Authentification 2FA et système de rôles pour une sécurité maximale.',
    icon: 'fa-shield-halved'
  },
  {
    title: 'Export facile',
    description: 'Exportez vos codes en différents formats pour une utilisation flexible.',
    icon: 'fa-download'
  },
  {
    title: 'Statistiques détaillées',
    description: 'Suivez l\'utilisation de vos codes avec des statistiques complètes.',
    icon: 'fa-chart-bar'
  },
  {
    title: 'Interface responsive',
    description: 'Accédez à votre dashboard depuis n\'importe quel appareil.',
    icon: 'fa-mobile-screen-button'
  }
])

// Navigation
const router = useRouter()

const navigateToLogin = () => {
  router.push('/auth')
}

const navigateToDashboard = () => {
  router.push('/admin')
}

const scrollToFeatures = () => {
  const featuresSection = document.getElementById('features')
  if (featuresSection) {
    featuresSection.scrollIntoView({ behavior: 'smooth' })
  }
}

// SEO
useHead({
  title: 'QR-Add - Générateur de Codes QR et Codes-barres',
  meta: [
    { 
      name: 'description', 
      content: 'Générateur moderne de codes QR et codes-barres avec interface intuitive et sécurité renforcée' 
    }
  ]
})
</script>

<style scoped>
/* ===== FONTS ===== */
@font-face {
  font-family: 'MonumentExtended';
  src: url('/MonumentExtended-Ultrabold.otf') format('opentype');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

/* ===== LANDING PAGE ===== */
.landing-page {
  min-height: 100vh;
}

/* ===== HERO SECTION ===== */
.hero {
  padding: var(--space-16) 0;
  background-color: var(--color-primary);
  color: var(--color-secondary);
  position: relative;
  overflow: hidden;
}

.hero__content {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-12);
  align-items: center;
}

@media (min-width: 1024px) {
  .hero__content {
    grid-template-columns: 1fr 1fr;
  }
}

.hero__title {
  font-family: 'MonumentExtended', sans-serif;
  font-size: 6rem;
  font-weight: 900;
  color: var(--color-secondary);
  line-height: var(--line-height-tight);
  margin-bottom: var(--space-6);
  letter-spacing: -0.025em;
  position: relative;
  z-index: 1;
}

@media (min-width: 768px) {
  .hero__title {
    font-size: var(--font-size-5xl);
    font-family: 'MonumentExtended', sans-serif;
    font-weight: 900;
  }
}

.text-highlight {
  color: var(--color-secondary);
  position: relative;
}

.text-highlight::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 3px;
  background-color: var(--color-secondary);
  border-radius: var(--border-radius);
}

.hero__description {
  font-size: var(--font-size-lg);
  color: rgba(255, 255, 255, 0.9);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-8);
  position: relative;
  z-index: 1;
}

.hero__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

@media (min-width: 640px) {
  .hero__actions {
    flex-direction: row;
  }
}

.hero__visual {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
}

.qr-demo {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
}

.qr-demo__image {
  max-width: 100%;
  height: auto;
  border-radius: var(--border-radius-xl);
  
  transition: transform var(--transition-normal);
}

.qr-demo__image:hover {
  transform: scale(1.02);
}

/* ===== FEATURES SECTION ===== */
.features {
  padding: var(--space-16) 0;
  background-color: var(--color-light);
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.section-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--space-4);
}

.section-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-muted);
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-8);
}

.feature-card {
  background-color: var(--color-secondary);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--space-8);
  text-align: center;
  transition: all var(--transition-normal);
}

.feature-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.feature-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background-color: var(--color-primary);
  color: var(--color-secondary);
  border-radius: var(--border-radius-lg);
  margin: 0 auto var(--space-6) auto;
  font-size: var(--font-size-xl);
}

.feature-card__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--space-3);
}

.feature-card__description {
  color: var(--color-muted);
  line-height: var(--line-height-relaxed);
}

/* ===== CTA SECTION ===== */
.cta {
  padding: var(--space-16) 0;
  background-color: var(--color-primary);
  color: var(--color-secondary);
  position: relative;
  overflow: hidden;
}

.cta__content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.cta__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
  margin-bottom: var(--space-4);
}

.cta__description {
  font-size: var(--font-size-lg);
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--space-8);
}

/* ===== CTA DÉCORATIONS ===== */
.cta__decorations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.cta__qr-code {
  position: absolute;
  top: 20%;
  left: 10%;
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.cta__barcode {
  position: absolute;
  bottom: 20%;
  right: 10%;
  font-size: 2.5rem;
  color: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite reverse;
}

.cta__dots {
  position: absolute;
  top: 50%;
  left: 5%;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.cta__dots span {
  width: 6px;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.cta__dots span:nth-child(2) {
  animation-delay: 0.5s;
}

.cta__dots span:nth-child(3) {
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.2); }
}

/* ===== BUTTONS ===== */
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

.btn--primary {
  background-color: var(--color-secondary);
  color: var(--color-primary);
  border: var(--border-width) solid var(--color-secondary);
  box-shadow: var(--shadow-sm);
}

.btn--primary:hover {
  background-color: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn--cta {
  background-color: var(--color-accent);
  color: var(--color-secondary);
  border: var(--border-width) solid var(--color-accent);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  padding: var(--space-4) var(--space-8);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.btn--cta:hover:not(:disabled) {
  background-color: var(--color-accent-dark);
  border-color: var(--color-accent-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn--outline {
  background-color: transparent;
  color: var(--color-secondary);
  border: var(--border-width) solid var(--color-secondary);
}

.btn--outline:hover {
  background-color: var(--color-secondary);
  color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.btn--large {
  padding: var(--space-4) var(--space-8);
  font-size: var(--font-size-lg);
  min-height: 56px;
}

.btn-icon {
  flex-shrink: 0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 640px) {
  .hero__title {
    font-size: var(--font-size-3xl);
  }
  
  .hero__description {
    font-size: var(--font-size-base);
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .qr-demo {
    flex-direction: column;
    gap: var(--space-6);
  }
  
  .hero__actions {
    flex-direction: column;
  }
}
</style>
  