<!-- Layout d'authentification -->
<template>
  <div class="auth-layout">
    <!-- Contenu principal -->
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<script setup>
// Définition du nom du composant
defineOptions({
  name: 'AuthLayout'
})
</script>

<style scoped>
/* ===== AUTH LAYOUT ===== */
.auth-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ===== MAIN ===== */
.main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 