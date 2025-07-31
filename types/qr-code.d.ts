// types/qr-code.d.ts

export interface QrCode {
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
  user?: {
    nom?: string
    prenom?: string
    email: string
  }
}

export interface QrCodeFormData {
  typeProduit: string
  nomProduit: string
  franchise: string
  prixVente: string
  poids: string
  unitePoids: string
  fournisseur: string
  qrType: 'raw' | 'result'
  auteur: string
}

export interface QrCodeApiResponse {
  success: boolean
  message?: string
  data: QrCode
}

export interface QrCodeListResponse {
  success: boolean
  data: QrCode[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
} 