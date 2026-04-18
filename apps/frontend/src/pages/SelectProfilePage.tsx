import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.js'
import type { ProfileClaim } from '../services/auth.service.js'

const ROLE_LABELS: Record<ProfileClaim['role'], string> = {
  ADMIN: 'Administrador',
  CLIENT: 'Prefeitura / Cliente',
  SUPPLIER: 'Fornecedor',
}

const ROLE_DESCRIPTIONS: Record<ProfileClaim['role'], string> = {
  ADMIN: 'Acesso total ao sistema, relatórios e gestão de cadastros',
  CLIENT: 'Abertura de orçamentos e acompanhamento de entregas',
  SUPPLIER: 'Envio de cotações e gestão de pedidos',
}

const ROLE_ICONS: Record<ProfileClaim['role'], React.ReactElement> = {
  ADMIN: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
  CLIENT: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  ),
  SUPPLIER: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  ),
}

export function SelectProfilePage() {
  const { user, selectProfile, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    navigate('/login', { replace: true })
    return null
  }

  function handleSelect(profile: ProfileClaim) {
    selectProfile(profile)
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <p className="text-sm text-slate-500">Bem-vindo,</p>
          <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
          <p className="mt-2 text-sm text-slate-500">Selecione o perfil com o qual deseja entrar</p>
        </div>

        <div className="space-y-3">
          {user.profiles.map((profile) => (
            <button
              key={`${profile.role}-${profile.clientId ?? ''}-${profile.supplierId ?? ''}`}
              onClick={() => handleSelect(profile)}
              className="flex w-full items-center gap-4 rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-slate-200 transition hover:shadow-md hover:ring-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                {ROLE_ICONS[profile.role]}
              </span>
              <div>
                <p className="font-semibold text-slate-900">{ROLE_LABELS[profile.role]}</p>
                <p className="text-sm text-slate-500">{ROLE_DESCRIPTIONS[profile.role]}</p>
              </div>
              <svg
                className="ml-auto h-5 w-5 shrink-0 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => logout().then(() => navigate('/login', { replace: true }))}
            className="text-sm text-slate-500 underline hover:text-slate-700"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}
