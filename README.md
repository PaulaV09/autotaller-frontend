# AutoTaller Frontend

Frontend web para AutoTallerManager, un sistema de gestion integral para talleres automotrices. La aplicacion consume la API del backend `AutoTallerManager` y ofrece paneles diferenciados por rol para operar clientes, vehiculos, inspecciones, ordenes, inventario, facturacion, reportes y portal del cliente.

## Objetivo

Permitir que cada rol del taller opere su parte del flujo real:

- Recepcion: clientes, vehiculos y facturas.
- Jefe de taller: inspecciones, ordenes, mecanicos, aprobaciones y reportes.
- Mecanico: diagnosticos, propuestas, seguimiento y cierre de trabajos asignados.
- Jefe de almacen: solicitudes e inventario operativo.
- Jefe de bodega: inventario principal, compras y proveedores.
- SuperAdministrador: control total del sistema.
- Cliente: portal propio para ver vehiculos, ordenes, aprobaciones y facturas.

## Tecnologias utilizadas

- React 19
- TypeScript 6
- Vite 8
- Tailwind CSS 4
- React Router DOM 7
- TanStack Query
- Axios
- Zustand
- React Hook Form
- Zod
- Base UI
- lucide-react
- date-fns
- sonner
- Recharts

## Requisitos previos

Segun el motor requerido por Vite 8:

- Node.js `^20.19.0` o `>=22.12.0`
- npm

Versiones verificadas localmente:

```bash
node --version
npm --version
```

## Arquitectura Frontend

La aplicacion esta organizada por responsabilidades:

- `src/api`: cliente Axios, endpoints y servicios por modulo.
- `src/components`: componentes comunes, layout y UI base.
- `src/features`: paginas, hooks y formularios por dominio funcional.
- `src/hooks`: hooks transversales.
- `src/lib`: constantes y utilidades.
- `src/routes`: router, proteccion de rutas y redireccion por rol.
- `src/store`: estado global de autenticacion y UI.
- `src/types`: contratos TypeScript alineados con DTOs del backend.

## Estructura de carpetas

```text
autotaller-frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── client.ts
│   │   ├── endpoints.ts
│   │   └── services/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── ui/
│   ├── features/
│   │   ├── auth/
│   │   ├── catalogos/
│   │   ├── clientes/
│   │   ├── dashboard/
│   │   ├── inspecciones/
│   │   ├── mecanicos/
│   │   ├── operaciones/
│   │   ├── ordenes/
│   │   ├── portal/
│   │   └── vehiculos/
│   ├── hooks/
│   ├── lib/
│   ├── routes/
│   ├── store/
│   └── types/
├── .env
├── .env.example
├── package.json
└── vite.config.ts
```

## Configuracion

El proyecto usa Vite y lee variables que empiezan por `VITE_`.

Archivo de ejemplo:

```text
.env.example
```

Configuracion actual:

```text
VITE_API_BASE_URL=http://localhost:5180
```

`src/api/client.ts` usa esa variable para configurar Axios. Si no existe, usa como fallback:

```text
http://localhost:5180
```

## Variables de entorno

| Variable | Obligatoria | Descripcion |
|---|---|---|
| `VITE_API_BASE_URL` | Si | URL base del backend AutoTallerManager. |

Ejemplo:

```bash
VITE_API_BASE_URL=http://localhost:5180
```

## Instalacion

```bash
git clone https://github.com/PaulaV09/autotaller-frontend.git
cd autotaller-frontend
npm install
cp .env.example .env
```

## Ejecucion local

```bash
npm run dev
```

Vite normalmente inicia en:

```text
http://localhost:5173
```

Si `5173` esta ocupado, Vite usara otro puerto y lo mostrara en consola.

## Scripts disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo Vite. |
| `npm run build` | Compila TypeScript y genera build de produccion. |
| `npm run lint` | Ejecuta ESLint. |
| `npm run preview` | Sirve localmente el build generado. |

## Comunicacion con API

La comunicacion con el backend se centraliza en:

```text
src/api/client.ts
src/api/endpoints.ts
src/api/services/
```

Comportamiento del cliente Axios:

- Agrega `Authorization: Bearer <token>` cuando existe token en el store.
- Renueva automaticamente el token ante `401` usando `/api/Auth/refresh-token`.
- Limpia sesion y redirige a `/login` si no puede renovar.

Backend esperado:

```text
http://localhost:5180
```

## Roles soportados

Los roles TypeScript y la navegacion estan definidos en:

```text
src/types/auth.types.ts
src/lib/constants.ts
src/components/layout/navConfig.ts
src/routes/index.tsx
```

Roles soportados:

- `SuperAdministrador`
- `JefeTaller`
- `JefeAlmacen`
- `JefeBodega`
- `Mecanico`
- `Recepcionista`
- `Cliente`

## Principales modulos

- `auth`: login y validacion de sesion.
- `clientes`: listado, registro, detalle y edicion.
- `vehiculos`: listado, detalle, edicion y cambio de propietario.
- `inspecciones`: listado, creacion, detalle y derivacion a orden.
- `ordenes`: ordenes generales, ordenes por area, diagnostico, propuestas, aprobaciones, seguimientos y completado.
- `mecanicos`: listado y asignacion de areas.
- `operaciones`: facturas, repuestos, proveedores, inventario, ordenes de compra, usuarios, reportes, configuracion, auditorias y portal.
- `catalogos`: hooks para catalogos del backend.
- `dashboard`: panel de jefe de taller y paneles operativos.
- `portal`: layout del portal de cliente.

## Flujo de navegacion

La raiz protegida redirige al dashboard segun el rol primario del usuario:

| Rol | Ruta inicial |
|---|---|
| `SuperAdministrador` | `/admin/dashboard` |
| `JefeTaller` | `/taller/dashboard` |
| `JefeAlmacen` | `/almacen/dashboard` |
| `JefeBodega` | `/bodega/dashboard` |
| `Mecanico` | `/mecanico/dashboard` |
| `Recepcionista` | `/recepcion/dashboard` |
| `Cliente` | `/portal/dashboard` |

Rutas principales por rol:

### Recepcionista

- `/recepcion/dashboard`
- `/recepcion/clientes`
- `/recepcion/clientes/nuevo`
- `/recepcion/vehiculos`
- `/recepcion/facturas`

### Jefe de Taller

- `/taller/dashboard`
- `/taller/inspecciones`
- `/taller/inspecciones/nueva`
- `/taller/ordenes`
- `/taller/ordenes/:id`
- `/taller/ordenes-area/:id`
- `/taller/mecanicos`
- `/taller/facturas`
- `/taller/reportes`

### Mecanico

- `/mecanico/dashboard`
- `/mecanico/mis-ordenes`

### Jefe de Almacen

- `/almacen/dashboard`
- `/almacen/solicitudes`
- `/almacen/inventario`

### Jefe de Bodega

- `/bodega/dashboard`
- `/bodega/inventario`
- `/bodega/solicitudes`
- `/bodega/ordenes-compra`
- `/bodega/proveedores`

### SuperAdministrador

- `/admin/dashboard`
- `/admin/usuarios`
- `/admin/clientes`
- `/admin/vehiculos`
- `/admin/inspecciones`
- `/admin/ordenes`
- `/admin/repuestos`
- `/admin/inventario`
- `/admin/proveedores`
- `/admin/facturas`
- `/admin/reportes`
- `/admin/catalogos`
- `/admin/configuracion`
- `/admin/auditorias`

### Cliente

- `/portal/dashboard`
- `/portal/vehiculos`
- `/portal/ordenes`
- `/portal/ordenes/:id`
- `/portal/facturas`
- `/portal/perfil`

## Credenciales demo

Estas credenciales existen en los seeders del backend despues de aplicar migraciones:

| Perfil | Correo | Contrasena |
|---|---|---|
| SuperAdministrador | `admin@autotaller.local` | `Admin123*` |
| Recepcionista | `recepcionista@autotaller.local` | `Admin123*` |
| Jefe de Taller | `jefe-taller@autotaller.local` | `Admin123*` |
| Mecanico Diagnostico | `mecanico-diagnostico@autotaller.local` | `Admin123*` |
| Mecanico Especializado | `mecanico-especializado@autotaller.local` | `Admin123*` |
| Jefe de Almacen | `jefe-almacen@autotaller.local` | `Admin123*` |
| Jefe de Bodega | `jefe-bodega@autotaller.local` | `Admin123*` |
| Cliente | `cliente@autotaller.local` | `Admin123*` |

## Puesta en marcha rapida

1. Iniciar PostgreSQL.
2. Iniciar backend en `http://localhost:5180`.
3. Verificar `.env`:

```text
VITE_API_BASE_URL=http://localhost:5180
```

4. Instalar dependencias:

```bash
npm install
```

5. Iniciar frontend:

```bash
npm run dev
```

6. Abrir la URL indicada por Vite e iniciar sesion.

## Validacion

Build de produccion:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Preview del build:

```bash
npm run preview
```

## Troubleshooting

### Vite usa `5174` en vez de `5173`

No es un error. Significa que `5173` estaba ocupado y Vite eligio otro puerto disponible.

### Error: dependency imported but could not be resolved

Ejecuta:

```bash
npm install
```

Si persiste, revisa imports absolutos. El proyecto usa alias:

```text
@ -> ./src
```

### El frontend no conecta al backend

Verifica:

```text
VITE_API_BASE_URL=http://localhost:5180
```

Tambien confirma que el backend este corriendo:

```text
http://localhost:5180/swagger
```

### Login falla

Confirma que las migraciones del backend fueron aplicadas y que existen usuarios semilla.

## Autores

- Paula Andrea Viviescas Jaimes
- Sebastian Andres Mora Valenzuela
