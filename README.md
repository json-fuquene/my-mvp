# 📈 Mi Portafolio — Control de Inversiones

Aplicación web para registrar y analizar operaciones de inversión. Permite controlar el portafolio de activos, calcular rentabilidad real y visualizar el impacto del tipo de cambio USD/COP.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend + Backend | Next.js 16 (App Router) |
| Base de datos (local) | SQLite via Prisma 7 |
| Base de datos (producción) | PostgreSQL en Supabase |
| ORM | Prisma 7 + adapter better-sqlite3 |
| Estilos | Tailwind CSS 4 |
| Gráficas | Recharts |
| Fuente | Plus Jakarta Sans |
| Íconos | Lucide React |

---

## Requisitos Previos

- Node.js v18 o superior
- npm v9 o superior
- Git

---

## Instalación y Configuración Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/my-mvp.git
cd my-mvp
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="file:./prisma/dev.db"
```

### 4. Ejecutar migraciones de base de datos

```bash
npx prisma migrate dev
```

### 5. Cargar activos iniciales

```bash
node --env-file=.env scripts/seed-activos.js
```

### 6. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run start` | Inicia el servidor de producción |
| `npm run lint` | Ejecuta el linter |
| `node --env-file=.env scripts/seed-activos.js` | Carga el catálogo de activos |

---

## Estructura del Proyecto

```
my-mvp/
├── prisma/
│   ├── schema.prisma          # Modelo de datos
│   ├── migrations/            # Historial de migraciones
│   └── dev.db                 # Base de datos SQLite local
│
├── scripts/
│   └── seed-activos.js        # Script de carga inicial de activos
│
├── src/
│   ├── app/
│   │   ├── layout.js          # Layout global con NavBar y Footer
│   │   ├── page.js            # Redirección al dashboard
│   │   ├── portafolio/
│   │   │   ├── page.js        # Dashboard principal
│   │   │   └── [symbol]/
│   │   │       └── page.js    # Vista detalle por activo
│   │   ├── operaciones/
│   │   │   ├── page.js        # Historial de operaciones
│   │   │   ├── BotonEliminar.js
│   │   │   ├── BotonExportar.js
│   │   │   └── nueva/
│   │   │       ├── page.js
│   │   │       └── FormularioOperacion.js
│   │   ├── activos/
│   │   │   └── [tipo]/
│   │   │       ├── page.js    # Listado por tipo (crypto/stock/etf)
│   │   │       └── FormPrecioManual.js
│   │   └── api/
│   │       ├── assets/
│   │       │   └── route.js   # GET, POST, PATCH /api/assets
│   │       ├── operations/
│   │       │   └── route.js   # GET, POST /api/operations
│   │       └── portafolio/
│   │           └── route.js   # GET /api/portafolio
│   │
│   ├── components/
│   │   ├── NavBar.js          # Navegación principal con menú desplegable
│   │   ├── Footer.js          # Banner inferior con redes sociales
│   │   ├── TarjetaMetrica.js  # Tarjeta de métricas reutilizable
│   │   └── GraficaDistribucion.js  # Gráfica de torta con Recharts
│   │
│   └── lib/
│       ├── actions.js         # Server Actions (lógica de negocio)
│       ├── portafolio.js      # Motor de cálculo del portafolio
│       ├── precios.js         # Integración con APIs de precios
│       ├── formato.js         # Funciones de formato de números
│       └── prisma.js          # Cliente Prisma compartido
```

---

## Modelo de Datos

### Asset (Activos)

| Campo | Tipo | Descripción |
|---|---|---|
| id | Int | Clave primaria autoincremental |
| symbol | String | Símbolo único del activo (ej. BTC, NVDA) |
| name | String | Nombre completo del activo |
| type | String | Tipo: `stock`, `etf`, `crypto` |
| manualPrice | Float? | Precio manual en COP (solo activos BVC) |
| isBVC | Boolean | Indica si cotiza en la Bolsa de Colombia |
| createdAt | DateTime | Fecha de creación |

### Operation (Operaciones)

| Campo | Tipo | Descripción |
|---|---|---|
| id | Int | Clave primaria autoincremental |
| assetSymbol | String | Referencia al símbolo del activo |
| type | String | Tipo: `buy` o `sell` |
| quantity | Float | Cantidad de unidades |
| price | Float | Precio por unidad en USD |
| currency | String | Moneda: `USD` o `COP` |
| trm | Float | TRM en la fecha de la operación |
| commission | Float | Comisión (default: 0) |
| date | DateTime | Fecha y hora de la operación |

---

## Fuentes de Datos Externas

| Fuente | Datos | Caché |
|---|---|---|
| Yahoo Finance | Precios acciones y ETFs | 15 minutos |
| CoinGecko | Precios criptomonedas | 15 minutos |
| ExchangeRate API | TRM USD/COP actual | 1 hora |
| Manual (usuario) | Precios BVC Colombia | Sin caché |

### Activos soportados automáticamente

- **NASDAQ:** Top 50 acciones más populares
- **ETFs:** SPY, QQQ, VTI, VOO, IWM
- **Criptomonedas:** BTC, ETH, BNB, SOL, XRP, ADA, AVAX, DOT, MATIC, LINK, UNI, ATOM, LTC, DOGE, SHIB
- **BVC Colombia:** Precio manual (Yahoo Finance no soporta la BVC)

---

## API Endpoints

### Assets

```
GET    /api/assets           Lista todos los activos
POST   /api/assets           Crea un nuevo activo
PATCH  /api/assets           Actualiza el precio manual de un activo
```

### Operations

```
GET    /api/operations       Lista todas las operaciones
POST   /api/operations       Registra una nueva operación
```

### Portafolio

```
GET    /api/portafolio       Calcula y retorna el portafolio actual
```

---

## Funcionalidades Principales

- **Dashboard** con valor total, rentabilidad y distribución del portafolio
- **Registro de operaciones** de compra y venta con cálculo automático de cantidad
- **Precios en tiempo real** desde Yahoo Finance y CoinGecko
- **Tipo de cambio USD/COP** actualizado automáticamente
- **Vista de detalle** por activo con historial de operaciones
- **Catálogo de activos** por tipo con precios actuales
- **Precios manuales** para acciones de la Bolsa de Colombia (BVC)
- **Exportar a CSV** el historial completo de operaciones
- **Eliminar operaciones** con recálculo automático del portafolio

---

## Motor de Cálculo

El portafolio se calcula a partir del historial de operaciones usando **costo promedio ponderado**:

```
Precio promedio = Costo total acumulado / Cantidad disponible
Rentabilidad    = (Valor actual - Costo total) / Costo total × 100
Exposición      = Costo activo / Costo total portafolio × 100
```

Las ventas reducen proporcionalmente el costo acumulado sin afectar el precio promedio.

---

## Consideraciones de la BVC

Yahoo Finance no tiene cobertura confiable para acciones de la Bolsa de Colombia. Los activos marcados con `isBVC: true` utilizan precio manual ingresado por el usuario en COP, que se convierte a USD usando la TRM actual para los cálculos del portafolio.

---

## Deploy a Producción

> Pendiente — se realizará migrando SQLite a PostgreSQL en Supabase y desplegando en Vercel.

### Pasos planeados

1. Crear proyecto en Supabase y obtener `DATABASE_URL`
2. Actualizar `prisma/schema.prisma` cambiando provider a `postgresql`
3. Ejecutar `npx prisma migrate deploy` en producción
4. Configurar variables de entorno en Vercel
5. Conectar repositorio GitHub a Vercel para deploy automático

---

## Licencia

Proyecto personal — todos los derechos reservados.