import { AppError } from '../lib/errors.js'
import type { ClientRepository } from '../repositories/client.repository.js'
import type {
  CreateClientInput,
  UpdateClientInput,
  ListClientsQuery,
} from '../schemas/client.schema.js'

export class ClientService {
  constructor(private readonly repo: ClientRepository) {}

  async create(input: CreateClientInput) {
    const existing = await this.repo.findByCnpj(input.cnpj)
    if (existing) {
      throw new AppError(409, 'CNPJ já cadastrado')
    }
    return this.repo.create(input)
  }

  async findById(id: string) {
    const client = await this.repo.findById(id)
    if (!client) {
      throw new AppError(404, 'Cliente não encontrado')
    }
    return client
  }

  async list(query: ListClientsQuery) {
    return this.repo.findAll(query)
  }

  async update(id: string, input: UpdateClientInput) {
    const existing = await this.repo.findById(id)
    if (!existing) {
      throw new AppError(404, 'Cliente não encontrado')
    }
    if (input.cnpj && input.cnpj !== existing.cnpj) {
      const taken = await this.repo.findByCnpj(input.cnpj)
      if (taken) {
        throw new AppError(409, 'CNPJ já cadastrado')
      }
    }
    return this.repo.update(id, input)
  }

  async deactivate(id: string) {
    const existing = await this.repo.findById(id)
    if (!existing) {
      throw new AppError(404, 'Cliente não encontrado')
    }
    return this.repo.setActive(id, false)
  }
}
