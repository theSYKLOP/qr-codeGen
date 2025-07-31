// types/global.d.ts

// Types globaux pour l'application
declare global {
  // Types Prisma
  interface QrCode {
    id: string
    typeProduit: string
    nomProduit: string
    franchise: string
    prixVente: number
    poids: number
    unitePoids: string
    fournisseur: string
    qrType: 'raw' | 'result'
    codePng: string
    dateCreation: string
    userId: string
    user?: {
      nom?: string
      prenom?: string
      email: string
    }
  }

  interface User {
    id: string
    email: string
    password: string
    nom?: string
    prenom?: string
    role: 'USER' | 'ADMIN'
    isActive: boolean
    createdAt: string
    updatedAt: string
    qrCodes: QrCode[]
  }
}

export {} 