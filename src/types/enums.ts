export enum EstadoOrdenGeneral {
  Pendiente = 1,
  EnDiagnostico = 2,
  EsperandoAprobacion = 3,
  EnProceso = 4,
  Completada = 5,
  Cancelada = 6,
  Facturada = 7,
}

export enum EstadoOrdenArea {
  Pendiente = 1,
  Diagnostico = 2,
  EsperandoAprobacionCliente = 3,
  Aprobada = 4,
  Rechazada = 5,
  EnProceso = 6,
  Completada = 7,
  Cancelada = 8,
  EsperandoAprobacionJefeTaller = 9,
}

export enum EstadoInspeccion {
  Completada = 1,
  DerivadaAOrden = 2,
  Cancelada = 3,
}

export enum EstadoAprobacion {
  Pendiente = 1,
  Aprobado = 2,
  Rechazado = 3,
}

export enum EstadoPagoFactura {
  Pendiente = 1,
  ParcialmentePagada = 2,
  PagadaCompleta = 3,
}

export enum EstadoOrdenCompra {
  Pendiente = 1,
  Enviada = 2,
  RecibidaParcial = 3,
  RecibidaCompleta = 4,
  Cancelada = 5,
}

export enum EstadoSolicitudRepuesto {
  PendienteAlmacen = 1,
  EnviadaABodega = 2,
  EntregadaAAlmacen = 3,
  EntregadaAMecanico = 4,
  Consumida = 5,
  Rechazada = 6,
}

export enum ZonaInventario {
  Bodega = 1,
  Almacen = 2,
  EnObra = 3,
}

export enum TipoCombustible {
  Gasolina = 1,
  Diesel = 2,
  Hibrido = 3,
  Electrico = 4,
  Gas = 5,
}

export enum TipoTransmision {
  Manual = 1,
  Automatica = 2,
  CVT = 3,
  DobleEmbrague = 4,
}

export enum TipoEvidenciaInspeccion {
  Foto = 1,
  Video = 2,
  Documento = 3,
}

export enum TipoDetalleFactura {
  ManoDeObra = 1,
  Repuesto = 2,
  Descuento = 3,
  Impuesto = 4,
}
