// server/api/health.get.ts
import { defineEventHandler } from 'h3'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (_event) => {
  const startTime = Date.now()
  
  try {
    // Vérification de la base de données
    let dbStatus = 'disconnected'
    let dbResponseTime = 0
    
    try {
      const dbStartTime = Date.now()
      await prisma.$queryRaw`SELECT 1`
      dbResponseTime = Date.now() - dbStartTime
      dbStatus = 'connected'
    } catch (dbError) {
      console.error('Erreur de connexion à la base de données:', dbError)
      dbStatus = 'error'
    }

    // Informations sur l'environnement
    const environment = process.env.NODE_ENV || 'development'
    const vercelEnv = process.env.VERCEL_ENV || 'unknown'
    const vercelUrl = process.env.VERCEL_URL || 'unknown'
    const region = process.env.VERCEL_REGION || 'unknown'

    // Statistiques de base de données
    let dbStats = null
    if (dbStatus === 'connected') {
      try {
        const [userCount, qrCodeCount] = await Promise.all([
          prisma.user.count(),
          prisma.qrCode.count()
        ])
        dbStats = {
          users: userCount,
          qrCodes: qrCodeCount
        }
      } catch (statsError) {
        console.error('Erreur lors de la récupération des statistiques:', statsError)
      }
    }

    const responseTime = Date.now() - startTime

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment,
      vercel: {
        env: vercelEnv,
        url: vercelUrl,
        region
      },
      database: {
        status: dbStatus,
        responseTime: dbResponseTime,
        stats: dbStats
      },
      performance: {
        responseTime,
        uptime: process.uptime()
      },
      version: '1.0.0'
    }
  } catch (error) {
    console.error('Erreur dans l\'endpoint de santé:', error)
    
    return {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      environment: process.env.NODE_ENV || 'development'
    }
  }
}) 