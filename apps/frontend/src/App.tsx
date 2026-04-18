import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext.js'
import { ProtectedRoute } from './components/ProtectedRoute.js'
import { LoginPage } from './pages/LoginPage.js'
import { SelectProfilePage } from './pages/SelectProfilePage.js'
import { DashboardPage } from './pages/DashboardPage.js'

export function App() {
  const { user, selectedProfile } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/selecionar-perfil"
        element={user ? <SelectProfilePage /> : <Navigate to="/login" replace />}
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      <Route
        path="/"
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : !selectedProfile ? (
            <Navigate to="/selecionar-perfil" replace />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
