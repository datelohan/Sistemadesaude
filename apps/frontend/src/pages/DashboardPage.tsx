import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.js'
import { AppLayout } from '../components/AppLayout.js'

interface QuickCard {
  title: string
  description: string
  icon: string
  to?: string
  soon?: boolean
}

const ADMIN_CARDS: QuickCard[] = [
  {
    title: 'Clientes',
    description: 'Cadastrar e gerenciar prefeituras',
    icon: '🏛️',
    to: '/clientes',
  },
  {
    title: 'Fornecedores',
    description: 'Cadastrar e gerenciar fornecedores',
    icon: '🏭',
    soon: true,
  },
  {
    title: 'Contratos',
    description: 'Contratos com prefeituras',
    icon: '📄',
    soon: true,
  },
  {
    title: 'Orçamentos',
    description: 'Visão geral de todos os orçamentos',
    icon: '📋',
    soon: true,
  },
]

const CLIENT_CARDS: QuickCard[] = [
  {
    title: 'Abrir orçamento',
    description: 'Solicitar cotações para produtos',
    icon: '📋',
    soon: true,
  },
  {
    title: 'Meus orçamentos',
    description: 'Acompanhar orçamentos em andamento',
    icon: '🔍',
    soon: true,
  },
  {
    title: 'Contratos',
    description: 'Ver contratos vigentes',
    icon: '📄',
    soon: true,
  },
]

const SUPPLIER_CARDS: QuickCard[] = [
  {
    title: 'Cotações abertas',
    description: 'Responder a solicitações de preço',
    icon: '💰',
    soon: true,
  },
  {
    title: 'Meus pedidos',
    description: 'Acompanhar pedidos aprovados',
    icon: '📦',
    soon: true,
  },
  {
    title: 'Notas fiscais',
    description: 'Emitir e gerenciar NFs',
    icon: '🧾',
    soon: true,
  },
]

const CARDS_BY_ROLE = { ADMIN: ADMIN_CARDS, CLIENT: CLIENT_CARDS, SUPPLIER: SUPPLIER_CARDS }
const ROLE_LABELS = { ADMIN: 'Administrador', CLIENT: 'Prefeitura', SUPPLIER: 'Fornecedor' }

export function DashboardPage() {
  const { user, selectedProfile } = useAuth()
  const navigate = useNavigate()

  if (!user || !selectedProfile) return null

  const cards = CARDS_BY_ROLE[selectedProfile.role]

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Saudação */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Olá, {user.name.split(' ')[0]} 👋</h1>
          <p className="mt-1 text-slate-500">
            Acessando como{' '}
            <span className="font-medium text-slate-700">{ROLE_LABELS[selectedProfile.role]}</span>
          </p>
        </div>

        {/* Cards de acesso rápido */}
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Acesso rápido
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map((card) => (
              <button
                key={card.title}
                onClick={() => card.to && navigate(card.to)}
                disabled={card.soon}
                className={`group relative flex flex-col rounded-xl border bg-white p-5 text-left shadow-sm transition ${
                  card.soon
                    ? 'cursor-not-allowed border-slate-100 opacity-60'
                    : 'hover:border-primary-300 cursor-pointer border-slate-200 hover:shadow-md'
                }`}
              >
                {card.soon && (
                  <span className="absolute right-3 top-3 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                    Em breve
                  </span>
                )}
                <span className="mb-3 text-3xl">{card.icon}</span>
                <span className="group-hover:text-primary-700 font-semibold text-slate-900">
                  {card.title}
                </span>
                <span className="mt-1 text-sm text-slate-500">{card.description}</span>
                {!card.soon && (
                  <span className="text-primary-600 mt-3 text-xs font-medium group-hover:underline">
                    Acessar →
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
