// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // Configuration de développement
  devtools: { enabled: false },
  
  // Configuration des modules
  modules: [
    '@nuxt/image',
    '@nuxt/fonts'
  ],

  // Configuration Vite pour optimiser le build
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'qrcode': ['qrcode'],
            'jsbarcode': ['jsbarcode'],
            'fa-core': ['@fortawesome/fontawesome-svg-core'],
            'fa-solid': ['@fortawesome/free-solid-svg-icons'],
            'fa-regular': ['@fortawesome/free-regular-svg-icons'],
            'fa-vue': ['@fortawesome/vue-fontawesome']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['qrcode', 'jsbarcode', '@fortawesome/fontawesome-svg-core', '@fortawesome/vue-fontawesome'],
      // Empêcher l'optimisation/bundling de Prisma côté Nitro
      exclude: ['@prisma/client']
    }
  },

  // Configuration Nitro
  nitro: {
    // Sur Vercel, utiliser le preset 'vercel' pour que la plateforme détecte correctement la sortie
    // En local/CI hors Vercel, fallback sur 'node' (modifiable via NITRO_PRESET)
    preset: process.env.VERCEL ? 'vercel' : (process.env.NITRO_PRESET || 'node'),
    compressPublicAssets: true,
    minify: true,
    prerender: {
      routes: ['/', '/auth']
    },
    compatibilityDate: '2025-08-08',
    // Laisser Node résoudre Prisma à l'exécution (évite l'analyse de '.prisma/*' par le bundler)
    externals: {
      external: ['@prisma/client', 'prisma']
    },
    moduleSideEffects: ['@prisma/client'],
    // Externaliser explicitement les modules virtuels ".prisma/*" utilisés par Prisma Client
    rollupConfig: {
      external: [/^\.prisma\//]
    }
  },

  // Nuxt Image (config via runtimeConfig/public pour éviter types stricts)
  runtimeConfig: {
    public: {
      image: {
        dir: 'public',
        domains: [],
        format: ['webp', 'png'],
        screens: { sm: 640, md: 768, lg: 1024, xl: 1280 },
        quality: 85,
        provider: 'ipx'
      }
    }
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
      ],
      link: [
        { rel: 'preload', as: 'font', href: '/MonumentExtended-Regular.otf', type: 'font/otf', crossorigin: '' },
        { rel: 'preload', as: 'font', href: '/MonumentExtended-Ultrabold.otf', type: 'font/otf', crossorigin: '' }
      ]
    }
  },

  // Configuration CSS
  css: [
    '~/assets/css/main.css'
  ],

  // Progressive Web App (mise en cache soft des assets et pages)
  experimental: {
    viewTransition: true
  },

  // Configuration des composants
  components: true,

  // Configuration des auto-imports
  imports: {
    autoImport: true
  },

  // Configuration des plugins
  plugins: [
    '~/plugins/fontawesome.ts'
  ],

  // Configuration TypeScript
  typescript: {
    strict: true,
    typeCheck: false // Désactiver pour accélérer le build
  }
})
