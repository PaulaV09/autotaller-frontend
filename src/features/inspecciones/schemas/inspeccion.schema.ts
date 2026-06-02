import { z } from 'zod'
import { TipoEvidenciaInspeccion } from '@/types/enums'

export const ESTADOS_CONDICION = ['Bueno', 'Regular', 'Malo', 'No aplica'] as const
export type EstadoCondicion = (typeof ESTADOS_CONDICION)[number]

export const inspeccionSchema = z.object({
  vehiculoId: z.number().min(1, 'Selecciona un vehículo'),
  clienteId: z.number().min(1, 'Selecciona un cliente'),
  kilometrajeActual: z.number().min(0, 'El kilometraje no puede ser negativo'),
  observacionesGenerales: z.string().min(5, 'Mínimo 5 caracteres'),
  detalles: z.array(
    z.object({
      seccion: z.string(),
      estado: z.string().min(1, 'Indica el estado de la sección'),
      observacion: z.string(),
    }),
  ),
  evidencias: z
    .array(
      z.object({
        tipo: z.nativeEnum(TipoEvidenciaInspeccion),
        url: z.string().min(1, 'URL requerida'),
        descripcion: z.string(),
      }),
    )
    .optional(),
})

export const crearOrdenSchema = z.object({
  tipoServicioId: z.number().min(1, 'Selecciona un tipo de servicio'),
  observacionesIniciales: z.string().min(5, 'Mínimo 5 caracteres'),
})

export type InspeccionFormValues = z.infer<typeof inspeccionSchema>
export type CrearOrdenFormValues = z.infer<typeof crearOrdenSchema>
