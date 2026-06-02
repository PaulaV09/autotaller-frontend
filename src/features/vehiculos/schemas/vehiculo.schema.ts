import { z } from 'zod'
import { TipoCombustible, TipoTransmision } from '@/types/enums'

export const editarVehiculoSchema = z.object({
  marcaVehiculoId: z.number().min(1, 'Selecciona una marca'),
  modeloVehiculoId: z.number().min(1, 'Selecciona un modelo'),
  anio: z.number().min(1900).max(new Date().getFullYear() + 1),
  placa: z.string().min(1).max(10),
  kilometraje: z.number().min(0),
  tipoCombustible: z.nativeEnum(TipoCombustible),
  tipoTransmision: z.nativeEnum(TipoTransmision),
  color: z.string().optional(),
  cilindraje: z.number().optional(),
  numeroMotor: z.string().optional(),
  numeroChasis: z.string().optional(),
  activo: z.boolean(),
  fechaVencimientoSOAT: z.string().optional(),
  fechaVencimientoTecnomecanica: z.string().optional(),
  paisOrigen: z.string().optional(),
  esImportado: z.boolean().default(false),
  numeroLlave: z.string().optional(),
  capacidadCombustibleLitros: z.number().optional(),
})

export type EditarVehiculoFormValues = z.infer<typeof editarVehiculoSchema>
