import { z } from 'zod'
import { TipoCombustible, TipoTransmision } from '@/types/enums'

export const vehiculoFormSchema = z.object({
  marcaVehiculoId: z.number().min(1, 'Selecciona una marca'),
  modeloVehiculoId: z.number().min(1, 'Selecciona un modelo'),
  anio: z.number().min(1900, 'Año inválido').max(new Date().getFullYear() + 1, 'Año inválido'),
  vin: z.string().min(1, 'El VIN es obligatorio').max(17, 'Máximo 17 caracteres'),
  placa: z.string().min(1, 'La placa es obligatoria').max(10, 'Máximo 10 caracteres'),
  kilometraje: z.number().min(0, 'Debe ser mayor o igual a 0'),
  tipoCombustible: z.nativeEnum(TipoCombustible),
  tipoTransmision: z.nativeEnum(TipoTransmision),
  color: z.string().optional(),
  cilindraje: z.number().optional(),
  numeroMotor: z.string().optional(),
  numeroChasis: z.string().optional(),
  fechaVencimientoSOAT: z.string().optional(),
  fechaVencimientoTecnomecanica: z.string().optional(),
  paisOrigen: z.string().optional(),
  esImportado: z.boolean(),
  numeroLlave: z.string().optional(),
  capacidadCombustibleLitros: z.number().optional(),
})

export const registrarClienteSchema = z.object({
  tipoDocumentoId: z.number().min(1, 'Selecciona un tipo de documento'),
  numeroDocumento: z.string().min(4, 'Mínimo 4 caracteres').max(20),
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(120),
  telefono: z.string().min(7, 'Mínimo 7 dígitos').max(20),
  correo: z.string().email('Correo inválido'),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  telefonoAlternativo: z.string().optional(),
  genero: z.string().optional(),
  vehiculos: z.array(vehiculoFormSchema).min(1, 'Agrega al menos un vehículo'),
})

export const editarClienteSchema = z.object({
  nombre: z.string().min(2).max(120),
  telefono: z.string().min(7).max(20),
  correo: z.string().email('Correo inválido'),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  activo: z.boolean(),
  fechaNacimiento: z.string().optional(),
  telefonoAlternativo: z.string().optional(),
  genero: z.string().optional(),
})

export type RegistrarClienteFormValues = z.infer<typeof registrarClienteSchema>
export type VehiculoFormValues = z.infer<typeof vehiculoFormSchema>
export type EditarClienteFormValues = z.infer<typeof editarClienteSchema>
