// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // Configuration Nuxt
  devtools: { enabled: true },

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
    preset: 'vercel'
  },

  // Configuration Prisma
  prisma: {
    clientOptions: {
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    }
  },

  // Variables d'environnement
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL
  }
})
