import { api } from '../lib/api.js'

export interface Client {
  id: string
  cnpj: string
  name: string
  municipality: string
  state: string
  zipCode: string | null
  address: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ClientsResponse {
  data: Client[]
  total: number
  page: number
  limit: number
}

export interface ClientFilters {
  page?: number
  limit?: number
  search?: string
  state?: string
  active?: 'true' | 'false'
}

export interface CreateClientPayload {
  cnpj: string
  name: string
  municipality: string
  state: string
  zipCode?: string
  address?: string
}

export const clientService = {
  list: async (filters: ClientFilters = {}) => {
    const { data } = await api.get<ClientsResponse>('/clients', { params: filters })
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get<Client>(`/clients/${id}`)
    return data
  },

  create: async (payload: CreateClientPayload) => {
    const { data } = await api.post<Client>('/clients', payload)
    return data
  },

  update: async (id: string, payload: Partial<CreateClientPayload>) => {
    const { data } = await api.patch<Client>(`/clients/${id}`, payload)
    return data
  },

  deactivate: async (id: string) => {
    await api.delete(`/clients/${id}`)
  },
}
