// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // Configuration Nuxt
  devtools: { enabled: true },

  // Modules
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon'
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
    preset: process.env.NODE_ENV === 'production' ? 'vercel' : undefined
  }
})
