// types/vercel.d.ts
// Types pour Vercel et variables d'environnement

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Variables d'environnement Vercel
      VERCEL?: string
      VERCEL_ENV?: 'production' | 'preview' | 'development'
      VERCEL_URL?: string
      VERCEL_REGION?: string
      
      // Base de données
      DATABASE_URL: string
      
      // Configuration Prisma
      PRISMA_CLI_BINARY_TARGETS?: string
      
      // Configuration Node.js
      NODE_OPTIONS?: string
      NODE_ENV?: 'development' | 'production' | 'test'
      
      // Configuration Nuxt
      NUXT_PUBLIC_APP_NAME?: string
    }
  }
}

// Types pour les fonctions Vercel
export interface VercelRequest extends Request {
  url: string
  method: string
  headers: Headers
  body?: any
}

export interface VercelResponse {
  status: (code: number) => VercelResponse
  json: (data: any) => VercelResponse
  send: (data: any) => VercelResponse
  end: () => void
}

// Types pour les variables d'environnement Vercel
export interface VercelEnv {
  DATABASE_URL: string
  PRISMA_CLI_BINARY_TARGETS?: string
  NODE_OPTIONS?: string
  NUXT_PUBLIC_APP_NAME?: string
}

export {} 