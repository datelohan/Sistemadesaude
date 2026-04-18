import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { ZodError } from 'zod'
import { env } from './env.js'
import { authRoutes } from './routes/auth.routes.js'

export async function buildApp() {
  const logger =
    env.NODE_ENV === 'test'
      ? false
      : env.NODE_ENV === 'development'
        ? { level: 'info', transport: { target: 'pino-pretty', options: { colorize: true } } }
        : { level: 'info' }

  const app = Fastify({
    logger,
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

  // Tratamento global de erros de validação Zod
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(422).send({
        message: 'Dados inválidos',
        errors: error.flatten().fieldErrors,
      })
    }
    app.log.error(error)
    return reply.status(500).send({ message: 'Erro interno do servidor' })
  })

  app.get('/health', async () => ({ status: 'ok' }))
  app.get('/ready', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

  await app.register(authRoutes)

  return app
}
