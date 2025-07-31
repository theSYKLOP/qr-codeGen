// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // Configuration Nuxt
  devtools: { enabled: false },

  // Modules
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@prisma/nuxt'
  ],

  // Configuration des auto-imports
  components: {
    dirs: [
      '~/components'
    ],
    // Forcer l'auto-import des composants
    global: true
  },

  // Configuration Nitro
  nitro: {
    preset: 'vercel',
    prerender: {
      crawlLinks: false
    },
    experimental: {
      wasm: false
    }
  },

  // Variables d'environnement
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL
  },

  // Configuration pour le build
  ssr: true,

  // Configuration pour Vercel
  experimental: {
    payloadExtraction: false
  },

  // Configuration des imports
  imports: {
    autoImport: true
  }
})
