<!-- app/app.vue -->
<template>
  <div class="app">
    <!-- Header minimaliste -->
    <header class="header">
      <div class="container">
        <div class="header__content">
          <div class="header__brand">
            <div class="header__logo">
              <FontAwesomeIcon :icon="['fas', 'qrcode']" size="lg" />
            </div>
            <div class="header__text">
              <h1 class="header__title">Générateur QR</h1>
              <p class="header__subtitle">Interface épurée 2025</p>
            </div>
          </div>
          
          <nav class="header__nav">
            <button class="btn btn--ghost btn--sm" type="button">
              <FontAwesomeIcon :icon="['fas', 'cogs']" />
              Paramètres
            </button>
          </nav>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="main">
      <NuxtPage />
    </main>

    <!-- Footer minimaliste -->
    <footer class="footer">
      <div class="container">
        <div class="footer__content">
          <p class="footer__text">
            © 2025 Générateur QR - Design Épuré
          </p>
          <div class="footer__links">
            <a href="#" class="footer__link">Aide</a>
            <a href="#" class="footer__link">Contact</a>
            <a href="#" class="footer__link">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
@import './assets/css/global.css';

/* ===== APP LAYOUT ===== */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ===== HEADER ===== */
.header {
  background-color: var(--color-secondary);
  border-bottom: var(--border-width) solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  backdrop-filter: blur(10px);
}

.header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

.header__brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.header__logo {
  color: var(--color-primary);
  transition: color var(--transition-fast);
}

.header__logo:hover {
  color: var(--color-accent);
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
  gap: var(--space-2);
}

/* ===== MAIN ===== */
.main {
  flex: 1;
  padding: var(--space-8) 0;
  background-color: var(--color-light);
}

/* ===== FOOTER ===== */
.footer {
  background-color: var(--color-secondary);
  border-top: var(--border-width) solid var(--color-border);
  padding: var(--space-6) 0;
  margin-top: auto;
}

.footer__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
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
  font-size: var(--font-size-sm);
  color: var(--color-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer__link:hover {
  color: var(--color-primary);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 640px) {
  .header__content {
    flex-direction: column;
    height: auto;
    padding: var(--space-4) 0;
    gap: var(--space-3);
  }
  
  .footer__content {
    flex-direction: column;
    text-align: center;
  }
}
</style>
