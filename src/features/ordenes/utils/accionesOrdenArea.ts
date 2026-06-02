import { EstadoOrdenArea } from '@/types/enums'
import type { AppRole } from '@/types/auth.types'

const ESTADOS_FINALES = [EstadoOrdenArea.Completada, EstadoOrdenArea.Cancelada]

export interface AccionesOrdenArea {
  puedeActualizarDiagnostico: boolean
  puedeFinalizarDiagnostico: boolean
  puedeProponerItems: boolean
  puedeAprobarJefeTaller: boolean
  puedeRechazarJefeTaller: boolean
  puedeAprobarCliente: boolean
  puedeRechazarCliente: boolean
  puedeRegistrarSeguimiento: boolean
  puedeCompletar: boolean
  puedeCancelar: boolean
  puedeReasignarMecanico: boolean
  puedeCrearSolicitudRepuestos: boolean
}

export function accionesOrdenArea(
  estado: EstadoOrdenArea,
  role: AppRole,
  mecanicoAsignadoId: number | null,
  currentUserId: number | null,
): AccionesOrdenArea {
  const esSuperAdmin = role === 'SuperAdministrador'
  const esJefeTaller = role === 'JefeTaller'
  const esMecanico = role === 'Mecanico'
  const esRecepcionista = role === 'Recepcionista'

  const esMecanicoAsignado =
    esMecanico && mecanicoAsignadoId !== null && mecanicoAsignadoId === currentUserId

  const enDiagnostico = estado === EstadoOrdenArea.Diagnostico
  const esperandoJT = estado === EstadoOrdenArea.EsperandoAprobacionJefeTaller
  const esperandoCliente = estado === EstadoOrdenArea.EsperandoAprobacionCliente
  const aprobadaOEnProceso =
    estado === EstadoOrdenArea.Aprobada || estado === EstadoOrdenArea.EnProceso
  const enProceso = estado === EstadoOrdenArea.EnProceso
  const noFinal = !ESTADOS_FINALES.includes(estado)

  return {
    puedeActualizarDiagnostico: (esSuperAdmin || esMecanicoAsignado) && enDiagnostico,
    puedeFinalizarDiagnostico: (esSuperAdmin || esMecanicoAsignado) && enDiagnostico,
    puedeProponerItems: (esSuperAdmin || esMecanicoAsignado) && enDiagnostico,
    puedeAprobarJefeTaller: (esSuperAdmin || esJefeTaller) && esperandoJT,
    puedeRechazarJefeTaller: (esSuperAdmin || esJefeTaller) && esperandoJT,
    puedeAprobarCliente: (esSuperAdmin || esRecepcionista) && esperandoCliente,
    puedeRechazarCliente: (esSuperAdmin || esRecepcionista) && esperandoCliente,
    puedeRegistrarSeguimiento: (esSuperAdmin || esMecanicoAsignado) && aprobadaOEnProceso,
    puedeCompletar: (esSuperAdmin || esMecanicoAsignado) && enProceso,
    puedeCancelar: (esSuperAdmin || esJefeTaller) && noFinal,
    puedeReasignarMecanico: (esSuperAdmin || esJefeTaller) && noFinal,
    puedeCrearSolicitudRepuestos: (esSuperAdmin || esJefeTaller) && estado === EstadoOrdenArea.Aprobada,
  }
}
