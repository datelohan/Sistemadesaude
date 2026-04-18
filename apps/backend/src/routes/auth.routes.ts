import type { FastifyInstance } from 'fastify'
import { loginSchema, refreshSchema, logoutSchema } from '../schemas/auth.schema.js'
import { AuthService } from '../services/auth.service.js'
import { PrismaAuthRepository } from '../repositories/auth.repository.js'
import { prisma } from '../lib/prisma.js'
import { env } from '../env.js'

export async function authRoutes(app: FastifyInstance) {
  const repo = new PrismaAuthRepository(prisma)
  const service = new AuthService(repo, env.JWT_SECRET)

  app.post('/auth/login', {
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    handler: async (request, reply) => {
      const body = loginSchema.parse(request.body)
      try {
        const tokens = await service.login(body)
        return reply.status(200).send(tokens)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro interno'
        const status = msg === 'Usuário inativo' ? 403 : 401
        return reply.status(status).send({ message: msg })
      }
    },
  })

  app.post('/auth/refresh', {
    handler: async (request, reply) => {
      const { refreshToken } = refreshSchema.parse(request.body)
      try {
        const tokens = await service.refresh(refreshToken)
        return reply.status(200).send(tokens)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro interno'
        return reply.status(401).send({ message: msg })
      }
    },
  })

  app.post('/auth/logout', {
    handler: async (request, reply) => {
      const { refreshToken } = logoutSchema.parse(request.body)
      await service.logout(refreshToken)
      return reply.status(204).send()
    },
  })
}
