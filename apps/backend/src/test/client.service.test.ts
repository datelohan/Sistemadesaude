import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ClientService } from '../services/client.service.js'
import type { ClientRepository } from '../repositories/client.repository.js'
import { AppError } from '../lib/errors.js'

const mockClient = {
  id: 'client-1',
  cnpj: '12.345.678/0001-90',
  name: 'Prefeitura de São Paulo',
  municipality: 'São Paulo',
  state: 'SP',
  zipCode: '01310-100',
  address: 'Viaduto do Chá, 15',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const makeInput = () => ({
  cnpj: '12.345.678/0001-90',
  name: 'Prefeitura de São Paulo',
  municipality: 'São Paulo',
  state: 'SP',
})

describe('ClientService', () => {
  let service: ClientService
  let repo: ClientRepository

  beforeEach(() => {
    repo = {
      create: vi.fn(),
      findById: vi.fn(),
      findByCnpj: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      setActive: vi.fn(),
    }
    service = new ClientService(repo)
  })

  describe('create', () => {
    it('cria cliente com dados válidos', async () => {
      vi.mocked(repo.findByCnpj).mockResolvedValue(null)
      vi.mocked(repo.create).mockResolvedValue(mockClient)

      const result = await service.create(makeInput())

      expect(repo.findByCnpj).toHaveBeenCalledWith('12.345.678/0001-90')
      expect(repo.create).toHaveBeenCalledWith(makeInput())
      expect(result).toEqual(mockClient)
    })

    it('lança 409 se CNPJ já cadastrado', async () => {
      vi.mocked(repo.findByCnpj).mockResolvedValue(mockClient)

      await expect(service.create(makeInput())).rejects.toThrow(AppError)
      await expect(service.create(makeInput())).rejects.toMatchObject({
        statusCode: 409,
        message: 'CNPJ já cadastrado',
      })
    })
  })

  describe('findById', () => {
    it('retorna cliente quando encontrado', async () => {
      vi.mocked(repo.findById).mockResolvedValue(mockClient)

      const result = await service.findById('client-1')

      expect(result).toEqual(mockClient)
    })

    it('lança 404 quando cliente não existe', async () => {
      vi.mocked(repo.findById).mockResolvedValue(null)

      await expect(service.findById('nao-existe')).rejects.toThrow(AppError)
      await expect(service.findById('nao-existe')).rejects.toMatchObject({
        statusCode: 404,
        message: 'Cliente não encontrado',
      })
    })
  })

  describe('list', () => {
    it('retorna lista paginada', async () => {
      const result = { data: [mockClient], total: 1, page: 1, limit: 20 }
      vi.mocked(repo.findAll).mockResolvedValue(result)

      const list = await service.list({ page: 1, limit: 20 })

      expect(repo.findAll).toHaveBeenCalledWith({ page: 1, limit: 20 })
      expect(list).toEqual(result)
    })
  })

  describe('update', () => {
    it('atualiza campos do cliente', async () => {
      const updated = { ...mockClient, name: 'Novo Nome' }
      vi.mocked(repo.findById).mockResolvedValue(mockClient)
      vi.mocked(repo.update).mockResolvedValue(updated)

      const result = await service.update('client-1', { name: 'Novo Nome' })

      expect(repo.update).toHaveBeenCalledWith('client-1', { name: 'Novo Nome' })
      expect(result.name).toBe('Novo Nome')
    })

    it('lança 404 quando cliente não existe', async () => {
      vi.mocked(repo.findById).mockResolvedValue(null)

      await expect(service.update('nao-existe', { name: 'X' })).rejects.toMatchObject({
        statusCode: 404,
      })
    })

    it('lança 409 ao atualizar para CNPJ já cadastrado em outro cliente', async () => {
      const outro = { ...mockClient, id: 'client-2', cnpj: '98.765.432/0001-10' }
      vi.mocked(repo.findById).mockResolvedValue(mockClient)
      vi.mocked(repo.findByCnpj).mockResolvedValue(outro)

      await expect(
        service.update('client-1', { cnpj: '98.765.432/0001-10' }),
      ).rejects.toMatchObject({ statusCode: 409 })
    })
  })

  describe('deactivate', () => {
    it('desativa cliente existente', async () => {
      const inativo = { ...mockClient, active: false }
      vi.mocked(repo.findById).mockResolvedValue(mockClient)
      vi.mocked(repo.setActive).mockResolvedValue(inativo)

      const result = await service.deactivate('client-1')

      expect(repo.setActive).toHaveBeenCalledWith('client-1', false)
      expect(result.active).toBe(false)
    })

    it('lança 404 quando cliente não existe', async () => {
      vi.mocked(repo.findById).mockResolvedValue(null)

      await expect(service.deactivate('nao-existe')).rejects.toMatchObject({
        statusCode: 404,
      })
    })
  })
})
