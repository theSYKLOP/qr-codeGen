// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  compatibilityDate: '2024-11-29',
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  
  modules: [
    '@prisma/nuxt',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon'
  ],

  // Configuration des auto-imports
  components: {
    dirs: [
      '~/components'
    ],
    global: true
  },

  // Variables d'environnement
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    public: {}
  },

  // 🔥 CONFIGURATION NITRO OPTIMISÉE
  nitro: {
    preset: process.env.NODE_ENV === 'production' ? 'vercel' : undefined,
    experimental: {
      wasm: true
    }
  },

  // 🔥 BUILD SIMPLIFIÉ
  build: {
    transpile: ['@nuxt/ui']  // ✅ SUPPRIMÉ : '@prisma/client' (géré par le module)
  },

  // 🔥 CONFIGURATION VITE AVEC ALIAS OFFICIEL
  vite: {
    css: {
      devSourcemap: false
    },
    build: {
      sourcemap: false
    },
    resolve: {
      alias: {
        // ✅ ALIAS OFFICIEL PRISMA : chemin ABSOLU obligatoire
        '.prisma/client/index-browser': resolve('./node_modules/.prisma/client/index-browser.js')
      }
    }
    // ✅ SUPPRIMÉ : optimizeDeps et rollupOptions (géré par le module)
  }
})
