import { PrismaClient } from '@prisma/client'

const prisma = process.env.NODE_ENV === 'production' 
  ? new PrismaClient()
  : (global.__prisma || (global.__prisma = new PrismaClient()))

export default prisma 