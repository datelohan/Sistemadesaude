import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthService } from '../services/auth.service.js'
import type { AuthRepository } from '../repositories/auth.repository.js'

const makeRepo = (): AuthRepository => ({
  findUserByEmail: vi.fn(),
  findUserById: vi.fn(),
  createRefreshToken: vi.fn(),
  findRefreshToken: vi.fn(),
  deleteRefreshToken: vi.fn(),
  deleteAllUserRefreshTokens: vi.fn(),
})

const FAKE_JWT_SECRET = 'supersecretjwtkeyfortest32chars!!'

const mockUser = {
  id: 'user-1',
  email: 'admin@smeds.com',
  passwordHash: '',
  name: 'Admin Teste',
  phone: null,
  active: true,
  profiles: [{ role: 'ADMIN' as const, clientId: null, supplierId: null }],
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('AuthService', () => {
  let repo: AuthRepository
  let service: AuthService

  beforeEach(async () => {
    repo = makeRepo()
    service = new AuthService(repo, FAKE_JWT_SECRET)

    // gerar hash real para usar nos testes
    const argon2 = await import('argon2')
    mockUser.passwordHash = await argon2.hash('senha123')
  })

  describe('login', () => {
    it('retorna tokens quando credenciais são válidas', async () => {
      vi.mocked(repo.findUserByEmail).mockResolvedValue(mockUser)
      vi.mocked(repo.createRefreshToken).mockResolvedValue(undefined)

      const result = await service.login({ email: mockUser.email, password: 'senha123' })

      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
      expect(repo.createRefreshToken).toHaveBeenCalledOnce()
    })

    it('lança erro quando usuário não existe', async () => {
      vi.mocked(repo.findUserByEmail).mockResolvedValue(null)

      await expect(service.login({ email: 'x@x.com', password: '123' })).rejects.toThrow(
        'Credenciais inválidas',
      )
    })

    it('lança erro quando senha está incorreta', async () => {
      vi.mocked(repo.findUserByEmail).mockResolvedValue(mockUser)

      await expect(service.login({ email: mockUser.email, password: 'errada' })).rejects.toThrow(
        'Credenciais inválidas',
      )
    })

    it('lança erro quando usuário está inativo', async () => {
      vi.mocked(repo.findUserByEmail).mockResolvedValue({ ...mockUser, active: false })

      await expect(service.login({ email: mockUser.email, password: 'senha123' })).rejects.toThrow(
        'Usuário inativo',
      )
    })
  })

  describe('refresh', () => {
    it('retorna novos tokens quando refresh token é válido', async () => {
      const future = new Date(Date.now() + 1000 * 60 * 60 * 24)
      vi.mocked(repo.findRefreshToken).mockResolvedValue({
        id: 'rt-1',
        token: 'old-token',
        userId: mockUser.id,
        expiresAt: future,
        createdAt: new Date(),
        user: mockUser,
      })
      vi.mocked(repo.deleteRefreshToken).mockResolvedValue(undefined)
      vi.mocked(repo.createRefreshToken).mockResolvedValue(undefined)

      const result = await service.refresh('old-token')

      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
      expect(repo.deleteRefreshToken).toHaveBeenCalledWith('rt-1')
    })

    it('lança erro quando refresh token não existe', async () => {
      vi.mocked(repo.findRefreshToken).mockResolvedValue(null)

      await expect(service.refresh('fake-token')).rejects.toThrow('Token inválido')
    })

    it('lança erro quando refresh token está expirado', async () => {
      const past = new Date(Date.now() - 1000)
      vi.mocked(repo.findRefreshToken).mockResolvedValue({
        id: 'rt-1',
        token: 'old-token',
        userId: mockUser.id,
        expiresAt: past,
        createdAt: new Date(),
        user: mockUser,
      })

      await expect(service.refresh('old-token')).rejects.toThrow('Token expirado')
    })
  })

  describe('logout', () => {
    it('deleta refresh token existente', async () => {
      vi.mocked(repo.findRefreshToken).mockResolvedValue({
        id: 'rt-1',
        token: 'some-token',
        userId: mockUser.id,
        expiresAt: new Date(),
        createdAt: new Date(),
        user: mockUser,
      })
      vi.mocked(repo.deleteRefreshToken).mockResolvedValue(undefined)

      await service.logout('some-token')

      expect(repo.deleteRefreshToken).toHaveBeenCalledWith('rt-1')
    })

    it('não lança erro quando token não existe (idempotente)', async () => {
      vi.mocked(repo.findRefreshToken).mockResolvedValue(null)

      await expect(service.logout('ghost-token')).resolves.toBeUndefined()
    })
  })
})
