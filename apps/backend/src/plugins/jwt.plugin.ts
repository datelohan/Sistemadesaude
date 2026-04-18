import type { FastifyReply, FastifyRequest } from 'fastify'
import { jwtVerify, type JWTPayload } from 'jose'
import { env } from '../env.js'
import type { TokenPayload } from '../domain/auth.js'

const secret = new TextEncoder().encode(env.JWT_SECRET)

declare module 'fastify' {
  interface FastifyRequest {
    currentUser: TokenPayload
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({ message: 'Token não informado' })
  }

  const token = authHeader.slice(7)
  try {
    const { payload } = await jwtVerify(token, secret)
    request.currentUser = payload as JWTPayload & TokenPayload
  } catch {
    return reply.status(401).send({ message: 'Token inválido ou expirado' })
  }
}
