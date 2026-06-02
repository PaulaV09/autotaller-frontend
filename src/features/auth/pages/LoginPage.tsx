import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Wrench } from 'lucide-react'
import { toast } from 'sonner'
import { loginSchema, type LoginFormValues } from '../schemas/login.schema'
import { authService } from '@/api/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { getPrimaryRole, ROLE_DASHBOARD } from '@/lib/constants'
import type { AppRole } from '@/types/auth.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function LoginPage() {
  const navigate = useNavigate()
  const { setAuth, isAuthenticated, user } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Si ya está autenticado, redirigir directamente
  if (isAuthenticated && user) {
    const primaryRole = getPrimaryRole(user.roles)
    const dest = primaryRole ? ROLE_DASHBOARD[primaryRole] : '/'
    navigate(dest, { replace: true })
    return null
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(values: LoginFormValues) {
    setErrorMessage(null)
    try {
      const data = await authService.login({
        correo: values.correo,
        password: values.password,
      })

      setAuth(data.token, data.expiresAt, data.refreshToken, {
        id: data.usuarioId,
        correo: data.correo,
        clienteId: data.clienteId,
        roles: data.roles as AppRole[],
      })

      const primaryRole = getPrimaryRole(data.roles)
      const dest = primaryRole ? ROLE_DASHBOARD[primaryRole] : '/'
      toast.success(`Bienvenido`)
      navigate(dest, { replace: true })
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Credenciales inválidas. Verifica tu correo y contraseña.'
      setErrorMessage(msg)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary shadow-sm">
            <Wrench className="size-6 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight">AutoTallerManager</h1>
            <p className="text-sm text-muted-foreground">Sistema de gestión de taller</p>
          </div>
        </div>

        <Card>
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">Iniciar sesión</CardTitle>
            <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="correo">Correo electrónico</Label>
                <Input
                  id="correo"
                  type="email"
                  placeholder="usuario@autotaller.com"
                  autoComplete="email"
                  {...register('correo')}
                  className={errors.correo ? 'border-destructive' : ''}
                />
                {errors.correo && (
                  <p className="text-xs text-destructive">{errors.correo.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register('password')}
                    className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
