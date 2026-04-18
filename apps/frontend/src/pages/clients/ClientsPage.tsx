import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AppLayout } from '../../components/AppLayout.js'
import { clientService, type Client } from '../../services/client.service.js'
import { BRAZIL_STATES } from '../../constants/brazilStates.js'
import {
  DataTable,
  PageHeader,
  Button,
  Input,
  useDebounce,
  ConfirmDialog,
  useDisclosure,
  type Column,
} from 'ui'

export function ClientsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [activeFilter, setActiveFilter] = useState<'true' | 'false' | ''>('')
  const [targetId, setTargetId] = useState<string | null>(null)
  const confirmDialog = useDisclosure()

  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading } = useQuery({
    queryKey: ['clients', page, debouncedSearch, stateFilter, activeFilter],
    queryFn: () =>
      clientService.list({
        page,
        limit: 20,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(stateFilter ? { state: stateFilter } : {}),
        ...(activeFilter ? { active: activeFilter } : {}),
      }),
  })

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => clientService.deactivate(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })

  function handleDeactivateClick(id: string) {
    setTargetId(id)
    confirmDialog.open()
  }

  function handleConfirmDeactivate() {
    if (targetId) deactivateMutation.mutate(targetId)
    confirmDialog.close()
    setTargetId(null)
  }

  const columns: Column<Client>[] = [
    {
      key: 'cnpj',
      header: 'CNPJ',
      render: (row) => <span className="font-mono text-xs">{row.cnpj}</span>,
    },
    {
      key: 'name',
      header: 'Nome',
      render: (row) => <span className="font-medium text-slate-900">{row.name}</span>,
    },
    {
      key: 'municipality',
      header: 'Município / Estado',
      render: (row) => (
        <span className="text-slate-600">
          {row.municipality} — {row.state}
        </span>
      ),
    },
    {
      key: 'active',
      header: 'Status',
      render: (row) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            row.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {row.active ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-28',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/clientes/${row.id}/editar`)}
            className="text-xs text-blue-600 hover:underline"
          >
            Editar
          </button>
          {row.active && (
            <button
              onClick={() => handleDeactivateClick(row.id)}
              className="text-xs text-red-600 hover:underline"
            >
              Desativar
            </button>
          )}
        </div>
      ),
    },
  ]

  const totalPages = data ? Math.ceil(data.total / 20) : 1

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Clientes"
          description={data ? `${data.total} cliente(s) encontrado(s)` : undefined}
          actions={<Button onClick={() => navigate('/clientes/novo')}>+ Novo cliente</Button>}
        />

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Buscar por nome, município ou CNPJ..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-72"
          />

          <select
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value)
              setPage(1)
            }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os estados</option>
            {BRAZIL_STATES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <select
            value={activeFilter}
            onChange={(e) => {
              setActiveFilter(e.target.value as 'true' | 'false' | '')
              setPage(1)
            }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="true">Ativos</option>
            <option value="false">Inativos</option>
          </select>
        </div>

        <DataTable
          columns={columns}
          data={data?.data ?? []}
          rowKey={(row) => row.id}
          loading={isLoading}
          emptyTitle="Nenhum cliente encontrado"
          emptyDescription="Cadastre o primeiro cliente clicando em '+ Novo cliente'."
        />

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="secondary"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>

      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <ConfirmDialog
              title="Desativar cliente"
              description="O cliente não poderá mais ser associado a novos orçamentos. Essa ação pode ser revertida."
              confirmLabel="Desativar"
              onConfirm={handleConfirmDeactivate}
              onCancel={confirmDialog.close}
              dangerous
            />
          </div>
        </div>
      )}
    </AppLayout>
  )
}
