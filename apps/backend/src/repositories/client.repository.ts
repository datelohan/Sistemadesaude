import type { PrismaClient, Client } from '@prisma/client'
import type {
  CreateClientInput,
  UpdateClientInput,
  ListClientsQuery,
} from '../schemas/client.schema.js'

export interface ClientRepository {
  create(data: CreateClientInput): Promise<Client>
  findById(id: string): Promise<Client | null>
  findByCnpj(cnpj: string): Promise<Client | null>
  findAll(
    params: ListClientsQuery,
  ): Promise<{ data: Client[]; total: number; page: number; limit: number }>
  update(id: string, data: UpdateClientInput): Promise<Client>
  setActive(id: string, active: boolean): Promise<Client>
}

export class PrismaClientRepository implements ClientRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(data: CreateClientInput) {
    return this.db.client.create({ data })
  }

  async findById(id: string) {
    return this.db.client.findUnique({ where: { id } })
  }

  async findByCnpj(cnpj: string) {
    return this.db.client.findUnique({ where: { cnpj } })
  }

  async findAll({ page, limit, search, state, active }: ListClientsQuery) {
    const where = {
      ...(active !== undefined ? { active } : {}),
      ...(state ? { state } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { municipality: { contains: search } },
              { cnpj: { contains: search } },
            ],
          }
        : {}),
    }

    const [data, total] = await Promise.all([
      this.db.client.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.db.client.count({ where }),
    ])

    return { data, total, page, limit }
  }

  async update(id: string, data: UpdateClientInput) {
    return this.db.client.update({ where: { id }, data })
  }

  async setActive(id: string, active: boolean) {
    return this.db.client.update({ where: { id }, data: { active } })
  }
}
