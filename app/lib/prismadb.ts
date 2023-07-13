import { PrismaClient } from '@prisma/client'
import { env } from 'process'

declare global {
  var prisma: PrismaClient | undefined
}

const client = globalThis.prisma || new PrismaClient()

if (env.NODE_ENV === 'production') globalThis.prisma = client

export default client
