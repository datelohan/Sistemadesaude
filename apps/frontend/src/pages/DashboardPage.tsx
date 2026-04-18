import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.js'

const ROLE_LABELS = {
  ADMIN: 'Administrador',
  CLIENT: 'Prefeitura',
  SUPPLIER: 'Fornecedor',
}

export function DashboardPage() {
  const { user, selectedProfile, logout, selectProfile } = useAuth()
  const navigate = useNavigate()

  if (!user || !selectedProfile) return null

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  function handleSwitchProfile() {
    selectProfile(null as never)
    navigate('/selecionar-perfil', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900">Smeds</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">{ROLE_LABELS[selectedProfile.role]}</p>
            </div>

            {user.profiles.length > 1 && (
              <button
                onClick={handleSwitchProfile}
                title="Trocar perfil"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
            )}

            <button
              onClick={handleLogout}
              title="Sair"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-red-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Olá, {user.name.split(' ')[0]} 👋</h1>
          <p className="mt-1 text-slate-500">
            Você está acessando como{' '}
            <span className="font-medium text-slate-700">{ROLE_LABELS[selectedProfile.role]}</span>
          </p>
        </div>

        {/* Cards de navegação — placeholders por enquanto */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {selectedProfile.role === 'CLIENT' && (
            <>
              <NavCard
                title="Orçamentos"
                description="Abrir e acompanhar orçamentos"
                icon="📋"
                comingSoon
              />
              <NavCard
                title="Contratos"
                description="Ver contratos vigentes"
                icon="📄"
                comingSoon
              />
              <NavCard title="Empenhos" description="Gestão de empenhos" icon="🏛️" comingSoon />
            </>
          )}
          {selectedProfile.role === 'SUPPLIER' && (
            <>
              <NavCard
                title="Cotações"
                description="Responder a orçamentos abertos"
                icon="💰"
                comingSoon
              />
              <NavCard
                title="Pedidos"
                description="Acompanhar pedidos em andamento"
                icon="📦"
                comingSoon
              />
              <NavCard
                title="Notas Fiscais"
                description="Emitir e gerenciar NFs"
                icon="🧾"
                comingSoon
              />
            </>
          )}
          {selectedProfile.role === 'ADMIN' && (
            <>
              <NavCard
                title="Orçamentos"
                description="Visão geral de todos os orçamentos"
                icon="📋"
                comingSoon
              />
              <NavCard
                title="Cadastros"
                description="Clientes, fornecedores e contratos"
                icon="🗂️"
                comingSoon
              />
              <NavCard
                title="Relatórios"
                description="Relatórios gerenciais e fiscais"
                icon="📊"
                comingSoon
              />
              <NavCard
                title="Usuários"
                description="Gestão de usuários e permissões"
                icon="👥"
                comingSoon
              />
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function NavCard({
  title,
  description,
  icon,
  comingSoon,
}: {
  title: string
  description: string
  icon: string
  comingSoon?: boolean
}) {
  return (
    <div className="relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
      {comingSoon && (
        <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
          Em breve
        </span>
      )}
      <div className="mb-3 text-3xl">{icon}</div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  )
}
