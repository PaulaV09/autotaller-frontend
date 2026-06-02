const BASE = ''

export const ENDPOINTS = {
  // Auth
  auth: {
    login: `${BASE}/api/Auth/login`,
    refresh: `${BASE}/api/Auth/refresh-token`,
    logout: `${BASE}/api/Auth/logout`,
    cambiarPassword: `${BASE}/api/Auth/cambiar-password`,
  },

  // Usuarios y Roles
  usuarios: {
    list: `${BASE}/api/Usuarios`,
    byId: (id: number) => `${BASE}/api/Usuarios/${id}`,
  },
  roles: {
    list: `${BASE}/api/roles`,
  },

  // Catálogos
  catalogos: {
    tiposDocumento: `${BASE}/api/Catalogos/tipos-documento`,
    marcasVehiculo: `${BASE}/api/Catalogos/marcas-vehiculo`,
    modelosVehiculo: `${BASE}/api/Catalogos/modelos-vehiculo`,
    areasServicio: `${BASE}/api/Catalogos/areas-servicio`,
    tiposServicio: `${BASE}/api/Catalogos/tipos-servicio`,
    categoriasRepuesto: `${BASE}/api/Catalogos/categorias-repuesto`,
    metodosPago: `${BASE}/api/Catalogos/metodos-pago`,
    tiposMovimiento: `${BASE}/api/Catalogos/tipos-movimiento-inventario`,
    tiposCombustible: `${BASE}/api/Catalogos/tipos-combustible`,
    tiposTransmision: `${BASE}/api/Catalogos/tipos-transmision`,
    estadosOrdenGeneral: `${BASE}/api/Catalogos/estados-orden-general`,
    estadosOrdenArea: `${BASE}/api/Catalogos/estados-orden-area`,
    estadosOrdenCompra: `${BASE}/api/Catalogos/estados-orden-compra`,
    seccionesInspeccion: `${BASE}/api/Catalogos/secciones-inspeccion`,
  },

  // Clientes
  clientes: {
    list: `${BASE}/api/Clientes`,
    byId: (id: number) => `${BASE}/api/Clientes/${id}`,
    registrarConVehiculos: `${BASE}/api/Clientes/registrar-con-vehiculos`,
    vehiculos: (id: number) => `${BASE}/api/Clientes/${id}/vehiculos`,
    ordenes: (id: number) => `${BASE}/api/Clientes/${id}/ordenes`,
    facturas: (id: number) => `${BASE}/api/Clientes/${id}/facturas`,
    estadisticas: (id: number) => `${BASE}/api/Clientes/${id}/estadisticas`,
    historial: (id: number) => `${BASE}/api/Clientes/${id}/historial`,
  },

  // Vehículos
  vehiculos: {
    list: `${BASE}/api/Vehiculos`,
    byId: (id: number) => `${BASE}/api/Vehiculos/${id}`,
    cambiarPropietario: (id: number) => `${BASE}/api/Vehiculos/${id}/cambiar-propietario`,
    propietarios: (id: number) => `${BASE}/api/Vehiculos/${id}/propietarios`,
    ordenes: (id: number) => `${BASE}/api/Vehiculos/${id}/ordenes`,
    inspecciones: (id: number) => `${BASE}/api/Vehiculos/${id}/inspecciones`,
    historial: (id: number) => `${BASE}/api/Vehiculos/${id}/historial`,
  },

  // Inspecciones
  inspecciones: {
    list: `${BASE}/api/Inspecciones`,
    byId: (id: number) => `${BASE}/api/Inspecciones/${id}`,
    detalles: (id: number) => `${BASE}/api/Inspecciones/${id}/detalles`,
    evidencias: (id: number) => `${BASE}/api/Inspecciones/${id}/evidencias`,
    crearOrden: (id: number) => `${BASE}/api/Inspecciones/${id}/crear-orden`,
    cancelar: (id: number) => `${BASE}/api/Inspecciones/${id}/cancelar`,
  },

  // Órdenes Generales
  ordenesGenerales: {
    list: `${BASE}/api/OrdenesServicioGenerales`,
    byId: (id: number) => `${BASE}/api/OrdenesServicioGenerales/${id}`,
    cerrar: (id: number) => `${BASE}/api/OrdenesServicioGenerales/${id}/cerrar`,
    cancelar: (id: number) => `${BASE}/api/OrdenesServicioGenerales/${id}/cancelar`,
  },

  // Órdenes Área
  ordenesArea: {
    byId: (id: number) => `${BASE}/api/OrdenesServicioArea/${id}`,
    misOrdenes: `${BASE}/api/OrdenesServicioArea/mis-ordenes`,
    porOrdenGeneral: (ordenId: number) => `${BASE}/api/OrdenesServicioArea/por-orden-general/${ordenId}`,
    crear: (ordenGeneralId: number) => `${BASE}/api/OrdenesServicioArea/orden-general/${ordenGeneralId}`,
    trabajosPropuestos: (id: number) => `${BASE}/api/OrdenesServicioArea/${id}/trabajos-propuestos`,
    repuestosPropuestos: (id: number) => `${BASE}/api/OrdenesServicioArea/${id}/repuestos-propuestos`,
    proponerTrabajo: (id: number) => `${BASE}/api/OrdenesServicioArea/${id}/trabajos-propuestos`,
    proponerRepuesto: (id: number) => `${BASE}/api/OrdenesServicioArea/${id}/repuestos-propuestos`,
    aprobarJefeTaller: (id: number) => `${BASE}/api/OrdenesServicioArea/${id}/aprobar-jefe-taller`,
    rechazarJefeTaller: (id: number) => `${BASE}/api/OrdenesServicioArea/${id}/rechazar-jefe-taller`,
    aprobar: (id: number) => `${BASE}/api/OrdenesServicioArea/${id}/aprobar`,
    rechazarCliente: (id: number) => `${BASE}/api/OrdenesServicioArea/${id}/rechazar-cliente`,
    completar: (id: number) => `${BASE}/api/OrdenesServicioArea/${id}/completar`,
    finalizarDiagnostico: (id: number) => `${BASE}/api/OrdenesServicioArea/${id}/finalizar-diagnostico`,
    seguimientos: (id: number) => `${BASE}/api/OrdenesServicioArea/${id}/seguimientos`,
    cancelar: (id: number) => `${BASE}/api/OrdenesServicioArea/${id}/cancelar`,
    reasignarMecanico: (id: number) => `${BASE}/api/OrdenesServicioArea/${id}/reasignar-mecanico`,
    actualizarDiagnostico: (id: number) => `${BASE}/api/OrdenesServicioArea/${id}/diagnostico`,
  },

  // Mecánicos
  mecanicos: {
    list: `${BASE}/api/Mecanicos`,
    areas: (id: number) => `${BASE}/api/Mecanicos/${id}/areas`,
    asignarArea: (mecId: number, areaId: number) => `${BASE}/api/Mecanicos/${mecId}/areas/${areaId}`,
    removerArea: (mecId: number, areaId: number) => `${BASE}/api/Mecanicos/${mecId}/areas/${areaId}`,
  },

  // Repuestos
  repuestos: {
    list: `${BASE}/api/Repuestos`,
    byId: (id: number) => `${BASE}/api/Repuestos/${id}`,
  },

  // Inventario
  inventario: {
    movimientos: (repuestoId: number) => `${BASE}/api/inventario/repuestos/${repuestoId}/movimientos`,
    entrada: (repuestoId: number) => `${BASE}/api/inventario/repuestos/${repuestoId}/entrada`,
    transferir: (repuestoId: number) => `${BASE}/api/inventario/repuestos/${repuestoId}/transferir`,
    solicitudes: `${BASE}/api/inventario/solicitudes-repuestos`,
    solicitudDetalles: (id: number) => `${BASE}/api/inventario/solicitudes-repuestos/${id}/detalles`,
    crearSolicitud: (ordenAreaId: number) => `${BASE}/api/inventario/ordenes-area/${ordenAreaId}/solicitudes-repuestos`,
    enviarABodega: (id: number) => `${BASE}/api/inventario/solicitudes-repuestos/${id}/enviar-a-bodega`,
    entregarAAlmacen: (id: number) => `${BASE}/api/inventario/solicitudes-repuestos/${id}/entregar-a-almacen`,
    entregarAMecanico: (id: number) => `${BASE}/api/inventario/solicitudes-repuestos/${id}/entregar-a-mecanico`,
  },

  // Órdenes de Compra
  ordenesCompra: {
    list: `${BASE}/api/ordenes-compra`,
    byId: (id: number) => `${BASE}/api/ordenes-compra/${id}`,
    recibir: (id: number) => `${BASE}/api/ordenes-compra/${id}/recibir`,
    cancelar: (id: number) => `${BASE}/api/ordenes-compra/${id}/cancelar`,
  },

  // Proveedores
  proveedores: {
    list: `${BASE}/api/proveedores`,
    byId: (id: number) => `${BASE}/api/proveedores/${id}`,
    toggleActivo: (id: number) => `${BASE}/api/proveedores/${id}/activar`,
    repuestos: (id: number) => `${BASE}/api/proveedores/${id}/repuestos`,
  },

  // Facturas
  facturas: {
    list: `${BASE}/api/Facturas`,
    byId: (id: number) => `${BASE}/api/Facturas/${id}`,
    generar: (ordenId: number) => `${BASE}/api/Facturas/generar/${ordenId}`,
    pagos: (facturaId: number) => `${BASE}/api/Facturas/${facturaId}/pagos`,
  },

  // Reportes
  reportes: {
    resumen: `${BASE}/api/reportes/resumen`,
    alertasInventario: `${BASE}/api/reportes/alertas-inventario`,
    productividadMecanico: (id: number) => `${BASE}/api/reportes/mecanicos/${id}/productividad`,
    rendimientoAreas: `${BASE}/api/reportes/areas/rendimiento`,
    ingresos: `${BASE}/api/reportes/ingresos`,
    rotacionInventario: `${BASE}/api/reportes/inventario/rotacion`,
  },

  // Configuración
  configuracion: {
    get: `${BASE}/api/configuracion`,
    update: `${BASE}/api/configuracion`,
  },

  // Auditorías
  auditorias: {
    list: `${BASE}/api/Auditorias`,
    errores: `${BASE}/api/Auditorias/errores`,
  },

  // Portal Cliente
  portal: {
    ordenes: `${BASE}/api/portal/ordenes`,
    orden: (id: number) => `${BASE}/api/portal/ordenes/${id}`,
    ordenAreas: (id: number) => `${BASE}/api/portal/ordenes/${id}/areas`,
    aprobarArea: (areaId: number) => `${BASE}/api/portal/areas/${areaId}/aprobar`,
    rechazarArea: (areaId: number) => `${BASE}/api/portal/areas/${areaId}/rechazar`,
    seguimientosArea: (areaId: number) => `${BASE}/api/portal/areas/${areaId}/seguimientos`,
    vehiculos: `${BASE}/api/portal/vehiculos`,
    vehiculoHistorial: (id: number) => `${BASE}/api/portal/vehiculos/${id}/historial`,
    facturas: `${BASE}/api/portal/facturas`,
    factura: (id: number) => `${BASE}/api/portal/facturas/${id}`,
    pagarFactura: (id: number) => `${BASE}/api/portal/facturas/${id}/pagar`,
  },
} as const
