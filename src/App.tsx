import { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import axios from 'axios'
import { Toaster } from '@/components/ui/sonner'
import { router } from '@/routes'
import { useAuthStore } from '@/store/auth.store'
import type { LoginResponse } from '@/types/auth.types'
import type { AppRole } from '@/types/auth.types'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5180'

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const { setAuth } = useAuthStore()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken')

    if (!refreshToken) {
      setReady(true)
      return
    }

    axios
      .post<LoginResponse>(`${BASE_URL}/api/Auth/refresh-token`, { refreshToken })
      .then(({ data }) => {
        setAuth(data.token, data.expiresAt, data.refreshToken, {
          id: data.usuarioId,
          correo: data.correo,
          clienteId: data.clienteId,
          roles: data.roles as AppRole[],
        })
      })
      .catch(() => {
        localStorage.removeItem('refreshToken')
      })
      .finally(() => setReady(true))
  }, [setAuth])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </AuthBootstrap>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
