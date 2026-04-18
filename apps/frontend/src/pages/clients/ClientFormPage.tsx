import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AppLayout } from '../../components/AppLayout.js'
import { clientService } from '../../services/client.service.js'
import { clientFormSchema, type ClientFormValues } from '../../schemas/client.schema.js'
import { BRAZIL_STATES } from '../../constants/brazilStates.js'
import { PageHeader, Button, Input, FormField } from 'ui'

function maskCnpj(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18)
}

function maskCep(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{5})(\d)/, '$1-$2')
    .slice(0, 9)
}

export function ClientFormPage() {
  const { id } = useParams<{ id?: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
  })

  const { data: existing, isLoading: loadingExisting } = useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientService.getById(id!),
    enabled: isEdit,
  })

  useEffect(() => {
    if (existing) {
      reset({
        cnpj: existing.cnpj,
        name: existing.name,
        municipality: existing.municipality,
        state: existing.state,
        zipCode: existing.zipCode ?? '',
        address: existing.address ?? '',
      })
    }
  }, [existing, reset])

  const mutation = useMutation({
    mutationFn: (values: ClientFormValues) => {
      const payload = {
        ...values,
        zipCode: values.zipCode || undefined,
        address: values.address || undefined,
      }
      return isEdit ? clientService.update(id!, payload) : clientService.create(payload)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['clients'] })
      navigate('/clientes')
    },
  })

  if (isEdit && loadingExisting) {
    return (
      <AppLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title={isEdit ? 'Editar cliente' : 'Novo cliente'}
          description={isEdit ? existing?.name : 'Preencha os dados da prefeitura'}
          actions={
            <Button variant="secondary" onClick={() => navigate('/clientes')}>
              Cancelar
            </Button>
          }
        />

        <form
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          className="max-w-2xl space-y-5 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        >
          {mutation.isError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {mutation.error instanceof Error ? mutation.error.message : 'Erro ao salvar cliente'}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="CNPJ" htmlFor="cnpj" error={errors.cnpj?.message} required>
              <Input
                id="cnpj"
                placeholder="00.000.000/0001-00"
                {...register('cnpj')}
                onChange={(e) => setValue('cnpj', maskCnpj(e.target.value))}
              />
            </FormField>

            <FormField label="Nome" htmlFor="name" error={errors.name?.message} required>
              <Input id="name" placeholder="Prefeitura de..." {...register('name')} />
            </FormField>

            <FormField
              label="Município"
              htmlFor="municipality"
              error={errors.municipality?.message}
              required
            >
              <Input id="municipality" placeholder="Ex: São Paulo" {...register('municipality')} />
            </FormField>

            <FormField label="Estado" htmlFor="state" error={errors.state?.message} required>
              <select
                id="state"
                {...register('state')}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione...</option>
                {BRAZIL_STATES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.value} — {s.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="CEP"
              htmlFor="zipCode"
              error={errors.zipCode?.message}
              hint="Opcional"
            >
              <Input
                id="zipCode"
                placeholder="00000-000"
                {...register('zipCode')}
                onChange={(e) => setValue('zipCode', maskCep(e.target.value))}
              />
            </FormField>
          </div>

          <FormField
            label="Endereço"
            htmlFor="address"
            error={errors.address?.message}
            hint="Opcional"
          >
            <Input id="address" placeholder="Rua, número, bairro..." {...register('address')} />
          </FormField>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => navigate('/clientes')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || mutation.isPending}>
              {mutation.isPending
                ? 'Salvando...'
                : isEdit
                  ? 'Salvar alterações'
                  : 'Cadastrar cliente'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
