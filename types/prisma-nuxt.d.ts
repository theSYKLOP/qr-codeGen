// types/prisma.d.ts
import 'nuxt/schema' // Importer le type NuxtConfig

declare module '@nuxt/schema' {
  interface NuxtConfig {
    prisma?: {                 // Définir la propriété `prisma` comme optionnelle
      skipPrompts?: boolean
      autoSetupPrisma?: boolean
    }
  }
}
