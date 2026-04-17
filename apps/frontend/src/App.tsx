import { Routes, Route, Navigate } from 'react-router-dom'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
              <h1 className="mb-6 text-2xl font-bold text-gray-900">Smeds</h1>
              <p className="text-gray-500">Sistema de Quarterização de Saúde</p>
            </div>
          </div>
        }
      />
    </Routes>
  )
}
