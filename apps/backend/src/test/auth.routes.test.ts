import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildApp } from '../app.js'

// Mocka o Prisma para testes de integração sem banco real
vi.mock('../lib/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}))

import { prisma } from '../lib/prisma.js'
import * as argon2 from 'argon2'

beforeEach(() => vi.clearAllMocks())

const mockUser = {
  id: 'user-1',
  email: 'admin@smeds.com',
  passwordHash: '',
  name: 'Admin Teste',
  phone: null,
  active: true,
  profiles: [{ role: 'ADMIN', clientId: null, supplierId: null }],
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('POST /auth/login', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    mockUser.passwordHash = await argon2.hash('senha123')
  })

  it('retorna 200 com tokens quando credenciais são válidas', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never)
    vi.mocked(prisma.refreshToken.create).mockResolvedValue({} as never)

    const app = await buildApp()
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'admin@smeds.com', password: 'senha123' },
    })

    expect(response.statusCode).toBe(200)
    const body: Record<string, unknown> = response.json()
    expect(body).toHaveProperty('accessToken')
    expect(body).toHaveProperty('refreshToken')
  })

  it('retorna 401 quando senha está errada', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never)

    const app = await buildApp()
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'admin@smeds.com', password: 'errada' },
    })

    expect(response.statusCode).toBe(401)
    expect(response.json()).toHaveProperty('message', 'Credenciais inválidas')
  })

  it('retorna 401 quando usuário não existe', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    const app = await buildApp()
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'naoexiste@test.com', password: '123' },
    })

    expect(response.statusCode).toBe(401)
  })

  it('retorna 422 quando body é inválido', async () => {
    const app = await buildApp()
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'nao-e-email', password: '' },
    })

    expect(response.statusCode).toBe(422)
  })
})

describe('POST /auth/refresh', () => {
  it('retorna 200 com novos tokens quando refresh token é válido', async () => {
    const future = new Date(Date.now() + 1000 * 60 * 60 * 24)
    vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue({
      id: 'rt-1',
      token: 'valid-refresh',
      userId: 'user-1',
      expiresAt: future,
      createdAt: new Date(),
      user: mockUser,
    } as never)
    vi.mocked(prisma.refreshToken.delete).mockResolvedValue({} as never)
    vi.mocked(prisma.refreshToken.create).mockResolvedValue({} as never)

    const app = await buildApp()
    const response = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      payload: { refreshToken: 'valid-refresh' },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveProperty('accessToken')
  })

  it('retorna 401 quando refresh token é inválido', async () => {
    vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue(null)

    const app = await buildApp()
    const response = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      payload: { refreshToken: 'fake' },
    })

    expect(response.statusCode).toBe(401)
  })
})

describe('POST /auth/logout', () => {
  it('retorna 204 e invalida o token', async () => {
    vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue({
      id: 'rt-1',
      token: 'some-token',
      userId: 'user-1',
      expiresAt: new Date(),
      createdAt: new Date(),
      user: mockUser,
    } as never)
    vi.mocked(prisma.refreshToken.delete).mockResolvedValue({} as never)

    const app = await buildApp()
    const response = await app.inject({
      method: 'POST',
      url: '/auth/logout',
      payload: { refreshToken: 'some-token' },
    })

    expect(response.statusCode).toBe(204)
    expect(prisma.refreshToken.delete).toHaveBeenCalledOnce()
  })
})
