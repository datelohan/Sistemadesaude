import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.js'
import type { ProfileClaim } from '../services/auth.service.js'

interface Props {
  requiredRole?: ProfileClaim['role']
}

export function ProtectedRoute({ requiredRole }: Props) {
  const { user, selectedProfile } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  if (!selectedProfile) return <Navigate to="/selecionar-perfil" replace />

  if (requiredRole && selectedProfile.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
