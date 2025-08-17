<!-- app/app.vue -->
<template>
  <div class="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toast />
  </div>
</template>
<script setup>
useHead({
  title: 'Générateur QR - Interface Épurée 2025',
  meta: [
    { 
      name: 'description', 
      content: 'Générateur de codes QR 241. Créez, gérez et partagez vos codes QR facilement avec notre outil moderne et intuitif.' 
    },
    { 
      name: 'keywords', 
      content: 'générateur QR, codes QR, QR codes, générateur, outils QR' 
    },
    { name: 'author', content: 'Mehdi OYONE' },
    
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://qr-codegen-alpha.vercel.app' },
    { property: 'og:title', content: 'Générateur QR - 241' },
    { 
      property: 'og:description', 
      content: 'Générateur de codes QR 241. Créez, gérez et partagez vos codes QR facilement.' 
    },
    
    // Twitter
    { property: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:title', content: 'Générateur QR - 241' },
    { 
      property: 'twitter:description', 
      content: 'Générateur de codes QR 241. Créez, gérez et partagez vos codes QR facilement.' 
    }
  ],
  link: [
    { rel: 'canonical', href: 'https://qr-codegen-alpha.vercel.app' }
  ]
})
</script>
<style>
@import './assets/css/global.css';

/* ===== APP LAYOUT ===== */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
