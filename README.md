# 🔗 SnapURL

**Acortador de URLs fullstack construido con Next.js 14 App Router.** Una plataforma que te permite crear links cortos, protegerlos con contraseña, establecer fechas de expiración y analizar su rendimiento desde un dashboard privado.

---

## 🚀 Características Principales

- 🔐 **Autenticación completa** (Registro, Login, Recuperación de contraseña).
- 🔗 **Gestión de URLs** acortadas con soporte para expiración y protección por contraseña.
- 📊 **Dashboard Privado** con métricas detalladas (clicks, referers, fechas).
- 🛡️ **Seguridad Nativa**: Middleware para interceptar links, Server Actions protegidas y Zod schemas.
- 💻 **Desarrollo Limpio**: Arquitectura robusta siguiendo principios SOLID y Clean Code.

---

## 🛠️ Stack Tecnológico

| Capa              | Tecnología         | Detalles                                          |
| :---------------- | :----------------- | :------------------------------------------------ |
| **Framework**     | ⚛️ Next.js 14      | App Router (`create-next-app`)                    |
| **Lenguaje**      | 📘 TypeScript      | Modo estricto (`strict: true`)                    |
| **Base de Datos** | 🐘 PostgreSQL 16   | Imagen Alpine (Docker dev) / Neon (Prod)          |
| **ORM**           | 📐 Prisma v7       | Schema como fuente de verdad (`prisma.config.ts`) |
| **Autenticación** | 🔒 NextAuth.js v5  | `@auth/core` versión beta                         |
| **Estilos**       | 🎨 Tailwind CSS v3 | Soporte nativo para _Dark Mode_                   |
| **Componentes**   | 🧩 shadcn/ui       | UI responsiva y moderna                           |
| **Gráficas**      | 📈 Recharts        | Integrado con `shadcn/ui Charts`                  |
| **Validación**    | ✅ Zod             | Cliente y servidor                                |
| **Estado Global** | 🐻 Zustand         | Interfaz ágil (_optimistic updates_)              |
| **Email (Dev)**   | 📬 Mailpit         | Cliente SMTP local en Docker                      |
| **Email (Prod)**  | 📨 Resend          | Entregabilidad de correos transaccionales         |

---

## ⚙️ Requisitos Previos

Asegúrate de tener instalados los siguientes componentes antes de iniciar:

- 🟢 **Node.js** (v18.17 o superior)
- 🐳 **Docker Desktop** o **Docker Compose** (necesario para levantar PostgreSQL y Mailpit)
- 🐙 **Git**

---

## 🚦 Instalación y Puesta en Marcha

Sigue estos pasos cuidadosamente para levantar el proyecto sin errores:

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/snapurl.git
cd snapurl
```

### 2️⃣ Instalar Dependencias

```bash
npm install
```

### 3️⃣ Configurar Variables de Entorno

Crear el archivo `.env.local` y `.env` basándote en el archivo de ejemplo predeterminado. **Esto es indispensable para que Prisma pueda leer la Base de Datos:**

```bash
cp .env.example .env.local
cp .env.example .env
```

Abre el archivo y edita tus configuraciones o utiliza la de defecto orientada a Docker:

```env
# === BASE DE DATOS ===
DB_USER=snapurl
DB_PASSWORD=snapurl_dev
DB_NAME=snapurl
DB_PORT=3002

DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}

# === NEXTAUTH ===
AUTH_SECRET="genera-con: openssl rand -base64 32"
AUTH_URL="http://localhost:3000"

# === EMAIL (Desarrollo con Mailpit) ===
MAILPIT_UI_PORT=3004
MAILPIT_SMTP_PORT=3005

EMAIL_SERVER_HOST="localhost"
EMAIL_SERVER_PORT=${MAILPIT_SMTP_PORT}
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM="noreply@snapurl.dev"

# === APP ===
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 4️⃣ Levantar Servicios en Docker (DB + Mailpit)

Para evitar instalar librerías globales innecesariamente en tu sistema operativo, lanzamos nuestros servicios de Database y servidor SMTP local para Emails usando Docker de manera limpia:

```bash
docker compose up -d
```

✅ **Comprobación:**

- PostgreSQL está corriendo ahora mapeado en tu puerto definidio (`localhost:3002`).
- El buzón de **Mailpit** (donde llegarán tus emails de recuperar contraseña, sin salir a internet) está en su puerto UI: [http://localhost:3004](http://localhost:3004).

### 5️⃣ Inicializar la Base de Datos (Prisma v7)

_⚠️ Recuerda que usamos prisma.config.ts y necesitamos nuestro archivo `.env` bien estructurado para este proceso._

Vamos a sincronizar la base de datos aplicando todas las migraciones necesarias (tablas de Usuarios, Links, Clicks e Historiales):

```bash
npx prisma generate
npx prisma migrate dev
```

_(Opcional: Si deseas tener cuenta y enlaces generados ficticiamente de forma inicial, carga el dataset del *seeder*)_

```bash
npx prisma db seed
```

### 6️⃣ Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

🚀 ¡Listo! Interactúa y disfruta la plataforma en: [http://localhost:3000](http://localhost:3000)

---

## 📂 Estructura del Proyecto

La arquitectura mantiene orden por características, abstrayendo UI, Server Actions y Utilidades de manera modular.

```text
snapurl/
├── app/
│   ├── (public)/             # 🔓 Rutas sin login (landing, login, auth)
│   ├── (protected)/          # 🔐 Rutas privadas en dashboard
│   ├── api/                  # 🌐 NextAuth API Handlers
│   ├── link-expired/         # ⏳ Pantalla de URL estatus expirada
│   └── r/[slug]/             # 🔀 Endpoint que procesa el redirect público
├── components/
│   ├── analytics/            # 📊 Gráficos responsivos de métricas (Recharts)
│   ├── auth/                 # 🔑 Formularios react-hook-form y zod
│   ├── dashboard/            # 🎛️ Header superior, App Sidebar, Widgets KPI
│   ├── links/                # 🔗 Tabla en grilla y formularios de enlace
│   ├── shared/               # 🧩 Elementos globales: loaders, Navbar, Theme toggles
│   └── ui/                   # 🎨 Elementos atómicos y bloques generados de shadcn/ui
├── hooks/                    # 🎣 React hooks (Portapapeles, Debounce UI)
├── lib/
│   ├── actions/              # ⚡ Next.js Server Actions (Lógica pesada / transaccional)
│   ├── db/                   # 🐘 Cliente prisma (singleton)
│   ├── email/                # 📧 Gestor agnóstico para enrutamiento (Mailpit / Resend)
│   ├── utils/                # ⚙️ Hash / Fechas / Strings y formatiado general
│   └── validations/          # ✅ Las capas Zod obligatorias pre-server actions
├── prisma/                   # 🧊 Schema principal y archivos Semilla (seed)
├── store/                    # 🏬 Stores (Zustand) para actualización pesimista/optimista
├── types/                    # 🏷️ Types compartidos
├── middleware.ts             # 🛡️ El muro perimetral para rutas /r/:slug y dashboard privados
├── auth.ts                   # 🔑 Credenciales NextAuth Core Setup
└── prisma.config.ts          # ⚙️ Configuración base para Prisma v7 Data-Source
```

---

## 🔍 Detalles y Reglas del Flujo del Proyecto

### Flujo Crítico: Redireccionamiento (`/link/[slug]`)

1. Visitante abre el link desde X lugar.
2. `route.ts` intercepta con velocidad la petición.
3. Lo consulta a base de datos y evalúa si **cumple con estar verificado, activo y que la fecha de expiración esté pendiente.**
4. Verifica si amerita protección por **Contraseña**.
5. Si superó las capas exitosamente:
   - **Guarda Analíticas:** Ip del clicker, referencia, Timestamp, Fecha.
   - **Ejecuta `Redirect 307` llevando a la URL destino al visitante resolviéndolo en milisegundos.**

### Flujo de Recuperar Clave

Para no exponer qué cuentas existen en el sistema ante atacantes (Enumeración de Cuentas), todo paso positivo/negativo se expone idénticamente al cliente. Y el Token es validado celosamente en varias etapas:

- El `Server Action` lanza el mail en segundo plano. (Revísalo en _Mailpit localhost:3004_).
- Verifica tiempo y no repetición de uso en **PasswordResetToken**.
- Concluye almacenando el hash fuerte y mandando el redirect al Login.

---

## 🛑 Resumen de Comandos de Interés

```bash
# Desarrollo Base
npm run dev               # Modo desarrollo en Local
npm run build             # Build transpilado al nivel de Deploy
npm run lint              # Forzar ESLint Clean check

# Database
npx prisma studio         # Lanza un GUI web en localhost:5555 muy útil para ver DB
npx prisma migrate dev    # Al hacer mejoras a tu schema.prisma lánzalo para actualizar PostgreSQL
npx prisma db seed        # Llena bases provisionales

# Docker Dev Environment
docker compose up -d      # Construir e iniciar contenedores
docker compose down       # Apagar los servicios del sistema
docker compose logs -f    # Chequear un stream fluido de logs de base de datos
```

---

## 🔐 Seguridad

- La propiedad `passwordHash` fue estrictamente separada de outputs JSON. Nunca te la devolverá el entorno prisma al frontend.
- Cada _Server Action_ exige el usuario Session autenticado para no contaminar enlaces cruzados.
- Omitiremos todo archivo `.next-env.d.ts` autogenerado y variables en tu `.env` a nivel de Pull Request (están correctamente en `.gitignore`).

---

## 📋 Estado del proyecto

Este proyecto está en desarrollo activo como parte de un portafolio de ingeniería de software. La arquitectura, decisiones de diseño y progreso de implementación están documentados en el historial de commits.
