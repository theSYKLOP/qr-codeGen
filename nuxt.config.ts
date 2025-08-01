// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // Configuration de développement
  devtools: { enabled: false },
  
  // Configuration des modules
  modules: [
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxt/fonts'
  ],

  // Configuration Vite pour optimiser le build
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'qrcode': ['qrcode'],
            'jsbarcode': ['jsbarcode']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['qrcode', 'jsbarcode']
    }
  },

  // Configuration Nitro
  nitro: {
    preset: 'vercel',
    compressPublicAssets: true,
    minify: true
  },

  // Configuration de l'application
  app: {
    head: {
      title: 'Générateur QR - Interface Épurée 2025',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'Générateur de codes QR avec interface minimaliste noir et blanc' 
        }
      ]
    }
  },

  // Configuration CSS
  css: [
    '~/assets/css/main.css'
  ],

  // Configuration des composants
  components: true,

  // Configuration des plugins
  plugins: [
    '~/plugins/fontawesome.client.ts'
  ],

  // Configuration TypeScript
  typescript: {
    strict: true,
    typeCheck: false // Désactiver pour accélérer le build
  }
})
