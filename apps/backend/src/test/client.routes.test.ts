import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SignJWT } from 'jose'
import { buildApp } from '../app.js'

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    client: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
    },
  },
}))

import { prisma } from '../lib/prisma.js'

beforeEach(() => vi.clearAllMocks())

const TEST_SECRET = 'test-secret-key-that-is-at-least-32-chars!!'

async function makeToken(role: 'ADMIN' | 'CLIENT' | 'SUPPLIER' = 'ADMIN') {
  const secret = new TextEncoder().encode(TEST_SECRET)
  return new SignJWT({ sub: 'user-1', name: 'Admin Teste', profiles: [{ role }] })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret)
}

const mockClient = {
  id: 'client-1',
  cnpj: '12.345.678/0001-90',
  name: 'Prefeitura de São Paulo',
  municipality: 'São Paulo',
  state: 'SP',
  zipCode: null,
  address: null,
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('GET /clients', () => {
  it('retorna 401 sem token', async () => {
    const app = await buildApp()
    const response = await app.inject({ method: 'GET', url: '/clients' })
    expect(response.statusCode).toBe(401)
  })

  it('retorna 200 com lista paginada', async () => {
    vi.mocked(prisma.client.findMany).mockResolvedValue([mockClient] as never)
    vi.mocked(prisma.client.count).mockResolvedValue(1)

    const token = await makeToken()
    const app = await buildApp()
    const response = await app.inject({
      method: 'GET',
      url: '/clients',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(200)
    const body: Record<string, unknown> = response.json()
    expect(body).toHaveProperty('data')
    expect(body).toHaveProperty('total', 1)
  })
})

describe('GET /clients/:id', () => {
  it('retorna 200 com cliente existente', async () => {
    vi.mocked(prisma.client.findUnique).mockResolvedValue(mockClient as never)

    const token = await makeToken()
    const app = await buildApp()
    const response = await app.inject({
      method: 'GET',
      url: '/clients/client-1',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveProperty('cnpj', '12.345.678/0001-90')
  })

  it('retorna 404 quando cliente não existe', async () => {
    vi.mocked(prisma.client.findUnique).mockResolvedValue(null)

    const token = await makeToken()
    const app = await buildApp()
    const response = await app.inject({
      method: 'GET',
      url: '/clients/nao-existe',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(404)
  })
})

describe('POST /clients', () => {
  it('retorna 201 ao criar cliente válido', async () => {
    vi.mocked(prisma.client.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.client.create).mockResolvedValue(mockClient as never)

    const token = await makeToken()
    const app = await buildApp()
    const response = await app.inject({
      method: 'POST',
      url: '/clients',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        cnpj: '12.345.678/0001-90',
        name: 'Prefeitura de São Paulo',
        municipality: 'São Paulo',
        state: 'SP',
      },
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toHaveProperty('id')
  })

  it('retorna 409 se CNPJ já existe', async () => {
    vi.mocked(prisma.client.findUnique).mockResolvedValue(mockClient as never)

    const token = await makeToken()
    const app = await buildApp()
    const response = await app.inject({
      method: 'POST',
      url: '/clients',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        cnpj: '12.345.678/0001-90',
        name: 'Prefeitura de São Paulo',
        municipality: 'São Paulo',
        state: 'SP',
      },
    })

    expect(response.statusCode).toBe(409)
  })

  it('retorna 422 com dados inválidos', async () => {
    const token = await makeToken()
    const app = await buildApp()
    const response = await app.inject({
      method: 'POST',
      url: '/clients',
      headers: { authorization: `Bearer ${token}` },
      payload: { cnpj: 'invalido', name: 'X', municipality: 'SP', state: 'SPP' },
    })

    expect(response.statusCode).toBe(422)
  })
})

describe('PATCH /clients/:id', () => {
  it('retorna 200 ao atualizar cliente', async () => {
    const updated = { ...mockClient, name: 'Novo Nome' }
    vi.mocked(prisma.client.findUnique).mockResolvedValue(mockClient as never)
    vi.mocked(prisma.client.update).mockResolvedValue(updated as never)

    const token = await makeToken()
    const app = await buildApp()
    const response = await app.inject({
      method: 'PATCH',
      url: '/clients/client-1',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Novo Nome' },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveProperty('name', 'Novo Nome')
  })
})

describe('DELETE /clients/:id', () => {
  it('retorna 204 ao desativar cliente', async () => {
    vi.mocked(prisma.client.findUnique).mockResolvedValue(mockClient as never)
    vi.mocked(prisma.client.update).mockResolvedValue({ ...mockClient, active: false } as never)

    const token = await makeToken()
    const app = await buildApp()
    const response = await app.inject({
      method: 'DELETE',
      url: '/clients/client-1',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(204)
  })

  it('retorna 404 para cliente inexistente', async () => {
    vi.mocked(prisma.client.findUnique).mockResolvedValue(null)

    const token = await makeToken()
    const app = await buildApp()
    const response = await app.inject({
      method: 'DELETE',
      url: '/clients/nao-existe',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(404)
  })
})
