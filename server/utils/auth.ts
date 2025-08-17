import { getHeader, createError, H3Event } from 'h3'
import jwt from 'jsonwebtoken'

type TokenPayload = {
  userId: string
  email: string
  role: 'USER' | 'MODERATEUR' | 'ADMIN'
}

export function getTokenFromHeader(event: H3Event): string {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Authorization manquante' })
  }
  return authHeader.substring(7)
}

export function verifyToken(event: H3Event): TokenPayload {
  const token = getTokenFromHeader(event)
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key'
    return jwt.verify(token, secret) as TokenPayload
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Token invalide' })
  }
}

export function requireAuth(event: H3Event): TokenPayload {
  return verifyToken(event)
}

export function requireAdminOrModerator(event: H3Event): TokenPayload {
  const payload = verifyToken(event)
  if (payload.role !== 'ADMIN' && payload.role !== 'MODERATEUR') {
    throw createError({ statusCode: 403, statusMessage: 'Accès interdit' })
  }
  return payload
}

export function requireAdmin(event: H3Event): TokenPayload {
  const payload = verifyToken(event)
  if (payload.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Accès admin requis' })
  }
  return payload
}


