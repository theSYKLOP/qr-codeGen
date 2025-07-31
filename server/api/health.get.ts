// server/api/health.get.ts
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: process.env.DATABASE_URL ? 'configured' : 'not configured'
  }
}) 