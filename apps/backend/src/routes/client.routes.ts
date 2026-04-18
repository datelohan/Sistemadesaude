import type { FastifyInstance } from 'fastify'
import {
  createClientSchema,
  updateClientSchema,
  listClientsQuerySchema,
} from '../schemas/client.schema.js'
import { ClientService } from '../services/client.service.js'
import { PrismaClientRepository } from '../repositories/client.repository.js'
import { prisma } from '../lib/prisma.js'
import { authenticate } from '../plugins/jwt.plugin.js'

export async function clientRoutes(app: FastifyInstance) {
  const repo = new PrismaClientRepository(prisma)
  const service = new ClientService(repo)

  app.get('/clients', {
    preHandler: [authenticate],
    handler: async (request, reply) => {
      const query = listClientsQuerySchema.parse(request.query)
      return reply.send(await service.list(query))
    },
  })

  app.get<{ Params: { id: string } }>('/clients/:id', {
    preHandler: [authenticate],
    handler: async (request, reply) => {
      return reply.send(await service.findById(request.params.id))
    },
  })

  app.post('/clients', {
    preHandler: [authenticate],
    handler: async (request, reply) => {
      const body = createClientSchema.parse(request.body)
      return reply.status(201).send(await service.create(body))
    },
  })

  app.patch<{ Params: { id: string } }>('/clients/:id', {
    preHandler: [authenticate],
    handler: async (request, reply) => {
      const body = updateClientSchema.parse(request.body)
      return reply.send(await service.update(request.params.id, body))
    },
  })

  app.delete<{ Params: { id: string } }>('/clients/:id', {
    preHandler: [authenticate],
    handler: async (request, reply) => {
      await service.deactivate(request.params.id)
      return reply.status(204).send()
    },
  })
}
