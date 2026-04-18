import { type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.js'

interface NavItem {
  to: string
  label: string
  icon: ReactNode
  soon?: boolean
}

const adminNav: NavItem[] = [
  {
    to: '/dashboard',
    label: 'Início',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    to: '/clientes',
    label: 'Clientes',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    to: '/fornecedores',
    label: 'Fornecedores',
    soon: true,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    to: '/contratos',
    label: 'Contratos',
    soon: true,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    to: '/orcamentos',
    label: 'Orçamentos',
    soon: true,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
  },
]

const clientNav: NavItem[] = [
  {
    to: '/dashboard',
    label: 'Início',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    to: '/orcamentos',
    label: 'Orçamentos',
    soon: true,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    to: '/contratos',
    label: 'Contratos',
    soon: true,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
]

const supplierNav: NavItem[] = [
  {
    to: '/dashboard',
    label: 'Início',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    to: '/cotacoes',
    label: 'Cotações',
    soon: true,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
]

const NAV_BY_ROLE = { ADMIN: adminNav, CLIENT: clientNav, SUPPLIER: supplierNav }
const ROLE_LABELS = { ADMIN: 'Administrador', CLIENT: 'Prefeitura', SUPPLIER: 'Fornecedor' }

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, selectedProfile, logout, selectProfile } = useAuth()
  const navigate = useNavigate()

  if (!user || !selectedProfile) return null

  const navItems = NAV_BY_ROLE[selectedProfile.role]

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  function handleSwitchProfile() {
    selectProfile(null as never)
    navigate('/selecionar-perfil', { replace: true })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5">
          <div className="bg-primary-600 flex h-8 w-8 items-center justify-center rounded-lg">
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">Smeds</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {navItems.map((item) =>
              item.soon ? (
                <li key={item.to}>
                  <span className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400">
                    {item.icon}
                    <span>{item.label}</span>
                    <span className="ml-auto rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-600">
                      Em breve
                    </span>
                  </span>
                </li>
              ) : (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/dashboard'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        {/* User info */}
        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <div className="bg-primary-100 text-primary-700 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">{ROLE_LABELS[selectedProfile.role]}</p>
            </div>
          </div>

          <div className="mt-1 flex gap-1">
            {user.profiles.length > 1 && (
              <button
                onClick={handleSwitchProfile}
                title="Trocar perfil"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                Trocar perfil
              </button>
            )}
            <button
              onClick={handleLogout}
              title="Sair"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  )
}
