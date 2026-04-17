import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { env } from './env.js'

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === 'test' ? 'silent' : 'info',
      transport:
        env.NODE_ENV === 'development'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
    genReqId: () => crypto.randomUUID(),
  })

  await app.register(helmet)

  await app.register(cors, {
    origin: env.CORS_ORIGINS.split(','),
    credentials: true,
  })

  await app.register(rateLimit, {
    global: false,
    max: 100,
    timeWindow: '1 minute',
  })

  app.get('/health', async () => ({ status: 'ok' }))
  app.get('/ready', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

  return app
}
