# SKILL — Agente Fullstack SnapURL

> Documento de instrucciones para el agente IA que construirá SnapURL de principio a fin.
> Lee este documento completo antes de escribir una sola línea de código.
> Aplica SOLID · Clean Code · DRY · KISS en cada decisión.

---

## 0. IDENTIDAD Y MISIÓN

Eres el agente fullstack de SnapURL. Tu responsabilidad es construir la aplicación completa siguiendo esta SKILL al pie de la letra. No improvises arquitectura. No agregues librerías no listadas. No asumas: si algo no está claro, pregunta antes de escribir código.

**Tu único objetivo es producir código listo para producción, seguro, mantenible y funcional.**

---

## 1. CONTEXTO DEL PROYECTO

SnapURL es un acortador de URLs fullstack construido con Next.js 14 App Router. Sin backend separado. Cualquier usuario puede:

- Registrarse e iniciar sesión
- Recuperar su contraseña vía email
- Crear links cortos con título, password opcional y fecha de expiración opcional
- Ver y gestionar sus links desde un dashboard privado
- Consultar analytics básicos por link (clicks por día, referers)

Cuando alguien visita `/r/abc123`, el Middleware de Next.js intercepta, valida y redirige. Es el flujo más crítico de la app — debe ser el más rápido.

**Deploy objetivo:**

- Desarrollo local: Next.js (`npm run dev`) + Docker Compose (PostgreSQL + Mailpit)
- Producción: Vercel (app) + Neon (PostgreSQL) + Resend (email)
- El deploy a Vercel NO se hace hasta que el usuario confirme que todo funciona localmente.

---

## 2. STACK TECNOLÓGICO COMPLETO

| Capa           | Tecnología       | Versión                | Notas                         |
| -------------- | ---------------- | ---------------------- | ----------------------------- |
| Framework      | Next.js          | 14.x (App Router)      | `create-next-app`             |
| Lenguaje       | TypeScript       | estricto               | `strict: true` en tsconfig    |
| Base de datos  | PostgreSQL       | 16-alpine (Docker dev) | Neon en producción            |
| ORM            | Prisma           | latest                 | Schema como fuente de verdad  |
| Auth           | NextAuth.js      | v5 (beta)              | `next-auth@beta`              |
| Estilos        | Tailwind CSS     | v3                     | Con dark mode `class`         |
| Componentes UI | shadcn/ui        | latest                 | `npx shadcn@latest add`       |
| Charts         | shadcn/ui Charts | (Recharts)             | `npx shadcn@latest add chart` |
| Validación     | Zod              | latest                 | Cliente + servidor            |
| Estado global  | Zustand          | latest                 | UI state + optimistic updates |
| Forms          | react-hook-form  | latest                 | Con `@hookform/resolvers`     |
| Email dev      | Mailpit          | Docker                 | Captura sin enviar            |
| Email prod     | Resend           | latest                 | `npm install resend`          |
| Slugs únicos   | nanoid           | latest                 | `customAlphabet`              |
| Password hash  | bcryptjs         | latest                 | `@types/bcryptjs`             |
| Contenedores   | Docker Compose   | -                      | Solo DB + Mailpit en dev      |

**NUNCA agregar** librerías fuera de esta lista sin consultar al usuario primero.

---

## 3. ESTRUCTURA DE CARPETAS COMPLETA

```
snapurl/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                          # Landing: hero + form acortado rápido
│   │   ├── login/
│   │   │   └── page.tsx                      # Form email + password
│   │   ├── register/
│   │   │   └── page.tsx                      # Form nombre + email + password
│   │   ├── forgot-password/
│   │   │   └── page.tsx                      # Solicitar reset: solo pide email
│   │   └── reset-password/
│   │       └── page.tsx                      # Ingresar nueva password (con token en URL)
│   ├── (protected)/
│   │   └── dashboard/
│   │       ├── layout.tsx                    # Sidebar + Header layout
│   │       ├── page.tsx                      # Overview: KPI cards + links recientes + mini chart
│   │       ├── links/
│   │       │   ├── page.tsx                  # Tabla paginada de todos los links
│   │       │   ├── new/
│   │       │   │   └── page.tsx              # Form crear link
│   │       │   └── [id]/
│   │       │       └── edit/
│   │       │           └── page.tsx          # Form editar link (pre-poblado)
│   │       ├── analytics/
│   │       │   └── [id]/
│   │       │       └── page.tsx              # Analytics detallado de un link
│   │       └── settings/
│   │           └── page.tsx                  # Cambiar nombre, email, password
│   ├── r/
│   │   └── [slug]/
│   │       ├── page.tsx                      # Password gate (si el link lo requiere)
│   │       └── route.ts                      # API handler de redirect (no renderiza HTML)
│   ├── link-expired/
│   │   └── page.tsx                          # Página informativa de link expirado
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts                  # NextAuth handlers
│   ├── layout.tsx                            # Root layout con ThemeProvider
│   ├── globals.css
│   └── not-found.tsx                         # 404 personalizada
│
├── components/
│   ├── ui/                                   # shadcn/ui — generado automáticamente, NO editar
│   │   └── [button, card, input, table, dialog, chart, sidebar, badge, dropdown-menu, ...]
│   ├── dashboard/
│   │   ├── app-sidebar.tsx                   # Sidebar con nav items y user info
│   │   ├── dashboard-header.tsx              # Topbar: breadcrumb + user menu + theme toggle
│   │   ├── overview-cards.tsx                # 4 KPI cards (total links, clicks, activos, protegidos)
│   │   ├── recent-links-table.tsx            # Tabla de 5 links más recientes
│   │   └── clicks-overview-chart.tsx         # Área chart: clicks últimos 7 días
│   ├── links/
│   │   ├── link-form.tsx                     # Form crear/editar (Zod + react-hook-form)
│   │   ├── links-table.tsx                   # Tabla completa con paginación y acciones
│   │   ├── link-row-actions.tsx              # Dropdown: copiar, editar, toggle, eliminar
│   │   └── delete-link-dialog.tsx            # Dialog de confirmación antes de eliminar
│   ├── analytics/
│   │   ├── clicks-bar-chart.tsx              # Clicks por día (últimos 30 días)
│   │   ├── referers-pie-chart.tsx            # Top referers como pie chart
│   │   └── analytics-stat-card.tsx           # Card de métrica: total, hoy, semana, promedio
│   ├── auth/
│   │   ├── login-form.tsx                    # Form login con validación Zod
│   │   ├── register-form.tsx                 # Form registro con validación Zod
│   │   ├── forgot-password-form.tsx          # Solo campo email
│   │   └── reset-password-form.tsx           # Nueva password + confirmar password
│   └── shared/
│       ├── navbar.tsx                        # Navbar pública (logo + nav + botones auth)
│       ├── footer.tsx                        # Footer simple
│       ├── theme-toggle.tsx                  # Switch dark/light
│       ├── copy-button.tsx                   # Botón con feedback visual al copiar
│       ├── page-header.tsx                   # Header reutilizable (título + descripción)
│       └── loading-skeleton.tsx              # Skeletons para estados de carga
│
├── lib/
│   ├── actions/                              # Server Actions — aquí vive la lógica de negocio
│   │   ├── links.actions.ts                  # createLink, updateLink, deleteLink, toggleActive
│   │   ├── auth.actions.ts                   # register, y helpers de auth
│   │   └── analytics.actions.ts             # getLinkAnalytics, getDashboardStats
│   ├── db/
│   │   └── prisma.ts                         # Singleton del cliente Prisma
│   ├── email/
│   │   ├── mailer.ts                         # Abstracción: dev usa Mailpit SMTP, prod usa Resend
│   │   └── templates/
│   │       └── reset-password.tsx            # Template HTML del email de reset
│   ├── utils/
│   │   ├── slug.ts                           # generateUniqueSlug con nanoid
│   │   ├── hash.ts                           # hashPassword + verifyPassword con bcryptjs
│   │   ├── date.ts                           # formatDate, isExpired, daysFromNow
│   │   └── url.ts                            # sanitizeUrl, isValidUrl (evita javascript: URIs)
│   └── validations/
│       ├── link.schema.ts                    # CreateLinkSchema, UpdateLinkSchema
│       └── auth.schema.ts                    # RegisterSchema, LoginSchema, ResetPasswordSchema
│
├── store/                                    # Zustand stores
│   ├── use-links-store.ts                    # Optimistic updates para links
│   └── use-ui-store.ts                       # Estado UI: sidebar, modals, toasts pendientes
│
├── hooks/
│   ├── use-copy-to-clipboard.ts              # Hook: copia + estado "copiado" con timeout
│   └── use-debounce.ts                       # Debounce genérico para search inputs
│
├── types/
│   └── index.ts                              # DTOs de output y tipos compartidos
│
├── middleware.ts                             # Intercepta /r/:slug + protege rutas dashboard
├── auth.ts                                   # Configuración de NextAuth.js v5
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                               # Seed con usuario y links de prueba
├── docker-compose.yml                        # PostgreSQL + Mailpit para desarrollo
├── .env.example                              # Plantilla de variables de entorno
├── .env.local                                # Local (en .gitignore)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── components.json                           # Config de shadcn/ui
```

---

## 4. SCHEMA DE BASE DE DATOS (Prisma Version 7)

Antes de configurar Prisma, debes revisar: https://www.prisma.io/docs/prisma-orm/quickstart/postgresql
Esto debido a que pueden haber incongruencias en la configuracion de la misma...Como por ejemplo, que la url ya no va en datasource, sino en el archivo .env

```typescript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    seed: "npx ts-node --transpile-only prisma/seed.ts",
  },
});
```

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  links              Link[]
  passwordResetTokens PasswordResetToken[]

  @@index([email])
}

model PasswordResetToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([token])
  @@index([userId])
}

model Link {
  id            String    @id @default(cuid())
  slug          String    @unique
  originalUrl   String
  userId        String
  title         String?
  passwordHash  String?
  expiresAt     DateTime?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  clicks        Click[]

  @@index([slug])
  @@index([userId])
}

model Click {
  id          String   @id @default(cuid())
  linkId      String
  visitorIp   String?
  userAgent   String?
  referer     String?
  country     String?
  clickedAt   DateTime @default(now())

  link        Link     @relation(fields: [linkId], references: [id], onDelete: Cascade)

  @@index([linkId, clickedAt])
}
```

**Reglas estrictas del schema:**

- `passwordHash` NUNCA aparece en ningún `select` que devuelva datos al cliente
- `PasswordResetToken.usedAt` se marca al usar el token; nunca se reutiliza
- Los tokens de reset expiran en 1 hora (`expiresAt = now() + 1h`)

---

## 5. VARIABLES DE ENTORNO

```env
# === BASE DE DATOS ===
POSTGRES_USER: snapurl
POSTGRES_PASSWORD: snapurl_dev
POSTGRES_DB: snapurl
DATABASE_URL="postgresql://snapurl:snapurl_dev@localhost:5432/snapurl"

# === NEXTAUTH ===
AUTH_SECRET="genera-con: openssl rand -base64 32"
AUTH_URL="http://localhost:3000"

# === EMAIL (desarrollo con Mailpit) ===
EMAIL_SERVER_HOST="localhost"
EMAIL_SERVER_PORT="1025"
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM="noreply@snapurl.dev"

# === EMAIL (producción con Resend — dejar vacío en dev) ===
RESEND_API_KEY=""

# === APP ===
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

```

**Regla:** El agente nunca hardcodea valores de estas variables. Siempre usa `process.env.VARIABLE`.

---

## 6. DOCKER COMPOSE (desarrollo)

Las variables no deberian ir en el docker-compose, sino en el .env y de ahi llamarlas desde el docker-compose

```env

```

```yaml
# docker-compose.yml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    container_name: snapurl_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U snapurl"]
      interval: 5s
      timeout: 5s
      retries: 5

  mailpit:
    image: axllent/mailpit:latest
    container_name: snapurl_mail
    restart: unless-stopped
    ports:
      - "1025:1025" # SMTP — Next.js envía aquí
      - "8025:8025" # Web UI — ver emails en http://localhost:8025
    environment:
      MP_MAX_MESSAGES: 50
      MP_SMTP_AUTH_ACCEPT_ANY: 1
      MP_SMTP_AUTH_ALLOW_INSECURE: 1

volumes:
  postgres_data:
```

**Comandos útiles:**

```bash
docker compose up -d          # Arranca DB + Mailpit
docker compose down           # Para todo
docker compose logs -f        # Ver logs
# Ver emails de reset → http://localhost:8025
```

---

## 7. CONFIGURACIÓN DE EMAIL (mailer.ts)

La abstracción de email usa SMTP en desarrollo (Mailpit) y Resend en producción. El código nunca sabe cuál usa — solo llama `sendEmail()`.

```typescript
// lib/email/mailer.ts
import nodemailer from "nodemailer";

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailOptions): Promise<void> {
  if (process.env.NODE_ENV === "production" && process.env.RESEND_API_KEY) {
    // Producción: Resend
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject,
      html,
    });
  } else {
    // Desarrollo: Mailpit SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: process.env.EMAIL_SERVER_USER
        ? {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          }
        : undefined,
    });
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
  }
}
```

**Dependencias necesarias:**

```bash
npm install nodemailer resend
npm install -D @types/nodemailer
```

---

## 8. FLUJO DE RECUPERACIÓN DE CONTRASEÑA

```
1. Usuario en /forgot-password ingresa su email
2. Server Action: busca el usuario por email
   → Si no existe: responde igual (no revelar si existe la cuenta)
   → Si existe: genera token con crypto.randomBytes(32).toString('hex')
   → Guarda en PasswordResetToken con expiresAt = now() + 1 hora
   → Envía email con link: /reset-password?token=<token>
3. Usuario recibe email, hace click en el link
4. /reset-password?token=xxx carga la página
   → Server verifica token: existe, no expirado, no usado
   → Si token inválido: muestra error "enlace inválido o expirado"
5. Usuario ingresa nueva password + confirmar password
6. Server Action:
   → Valida token otra vez (puede haber pasado tiempo)
   → Hashea nueva password con bcrypt
   → Actualiza User.passwordHash
   → Marca token como usado (usedAt = now())
   → Redirige a /login con mensaje de éxito
```

**Seguridad crítica:**

- El mensaje de "email enviado" es siempre el mismo, exista o no la cuenta (evita user enumeration)
- El token es de uso único: una vez marcado como `usedAt`, nunca más funciona
- Expiración de 1 hora estricta
- No exponer el token en logs

---

## 9. CONFIGURACIÓN NEXTAUTH v5

```typescript
// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/utils/hash";
import { LoginSchema } from "@/lib/validations/auth.schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          select: { id: true, email: true, name: true, passwordHash: true },
        });
        if (!user) return null;

        const isValid = await verifyPassword(
          parsed.data.password,
          user.passwordHash,
        );
        if (!isValid) return null;

        // NUNCA retornar passwordHash al cliente
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
```

---

## 10. MIDDLEWARE (intercepta redirect + protege dashboard)

```typescript
// middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard"];
const AUTH_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export default auth(async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await auth();

  // Proteger rutas del dashboard
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Si ya está autenticado, no volver a login/register
  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  // No interceptar archivos estáticos ni API de NextAuth
  // /r/:slug se maneja en app/r/[slug]/route.ts (no necesita middleware aquí)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

---

## 11. SERVER ACTIONS — PATRÓN OBLIGATORIO

**Todas las Server Actions deben seguir este patrón sin excepción:**

```typescript
"use server";
import { auth } from "@/auth";
import { z } from "zod";

// Tipo de retorno siempre consistente
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// Ejemplo real
export async function createLink(
  rawData: unknown,
): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    // 1. Verificar autenticación
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autorizado" };
    }

    // 2. Validar input con Zod
    const parsed = CreateLinkSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    // 3. Lógica de negocio
    const slug = await generateUniqueSlug(prisma);
    const passwordHash = parsed.data.password
      ? await hashPassword(parsed.data.password)
      : null;

    // 4. Persistir
    const link = await prisma.link.create({
      data: {
        slug,
        originalUrl: parsed.data.originalUrl,
        title: parsed.data.title,
        passwordHash,
        expiresAt: parsed.data.expiresAt,
        userId: session.user.id,
      },
      select: { id: true, slug: true }, // NUNCA seleccionar passwordHash
    });

    // 5. Revalidar cache
    revalidatePath("/dashboard/links");
    revalidatePath("/dashboard");

    return { success: true, data: link };
  } catch (error) {
    console.error("[createLink]", error);
    return { success: false, error: "Error interno del servidor" };
  }
}
```

**Reglas obligatorias de Server Actions:**

1. Siempre `'use server'` al inicio
2. Siempre verificar sesión antes de cualquier operación
3. Siempre validar con Zod antes de tocar Prisma
4. Siempre verificar ownership: `link.userId === session.user.id`
5. Nunca exponer stack traces al cliente
6. Siempre usar `select` en Prisma para controlar qué campos se devuelven
7. Siempre llamar `revalidatePath` después de mutaciones
8. Nunca retornar `passwordHash` de User ni Link en ningún select

---

## 12. ZOD SCHEMAS

```typescript
// lib/validations/link.schema.ts
import { z } from "zod";

export const CreateLinkSchema = z.object({
  originalUrl: z
    .string()
    .url("URL inválida")
    .refine(
      (url) => !url.startsWith("javascript:") && !url.startsWith("data:"),
      {
        message: "URL no permitida",
      },
    ),
  title: z.string().max(100, "Máximo 100 caracteres").optional(),
  password: z
    .string()
    .min(4, "Mínimo 4 caracteres")
    .max(50)
    .optional()
    .or(z.literal("")),
  expiresAt: z.coerce
    .date()
    .min(new Date(), "La fecha debe ser futura")
    .optional()
    .nullable(),
});

export const UpdateLinkSchema = CreateLinkSchema.extend({
  isActive: z.boolean().optional(),
});

export type CreateLinkInput = z.infer<typeof CreateLinkSchema>;
export type UpdateLinkInput = z.infer<typeof UpdateLinkSchema>;
```

```typescript
// lib/validations/auth.schema.ts
import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(50),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres").max(100),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, "Mínimo 8 caracteres").max(100),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
```

---

## 13. ZUSTAND STORES

```typescript
// store/use-ui-store.ts
import { create } from "zustand";

type UIStore = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  deletingLinkId: string | null;
  setDeletingLinkId: (id: string | null) => void;
};

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  deletingLinkId: null,
  setDeletingLinkId: (id) => set({ deletingLinkId: id }),
}));
```

```typescript
// store/use-links-store.ts
// Para optimistic updates — se actualiza antes de que el servidor confirme
import { create } from "zustand";

type LinkItem = {
  id: string;
  slug: string;
  originalUrl: string;
  title: string | null;
  isActive: boolean;
  createdAt: Date;
  _count: { clicks: number };
};

type LinksStore = {
  links: LinkItem[];
  setLinks: (links: LinkItem[]) => void;
  addLink: (link: LinkItem) => void;
  removeLink: (id: string) => void;
  toggleLink: (id: string) => void;
};

export const useLinksStore = create<LinksStore>((set) => ({
  links: [],
  setLinks: (links) => set({ links }),
  addLink: (link) => set((state) => ({ links: [link, ...state.links] })),
  removeLink: (id) =>
    set((state) => ({ links: state.links.filter((l) => l.id !== id) })),
  toggleLink: (id) =>
    set((state) => ({
      links: state.links.map((l) =>
        l.id === id ? { ...l, isActive: !l.isActive } : l,
      ),
    })),
}));
```

---

## 14. FLUJO DE REDIRECT (/r/[slug])

```typescript
// app/r/[slug]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const link = await prisma.link.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      originalUrl: true,
      isActive: true,
      expiresAt: true,
      passwordHash: true, // Solo para saber si tiene password, no se envía al cliente
    },
  });

  if (!link || !link.isActive) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  if (link.expiresAt && link.expiresAt < new Date()) {
    return NextResponse.redirect(new URL("/link-expired", request.url));
  }

  if (link.passwordHash) {
    const url = new URL(`/r/${params.slug}`, request.url);
    url.searchParams.set("auth", "true");
    return NextResponse.redirect(url);
  }

  // Registrar click de forma asíncrona (no bloqueante)
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const userAgent = request.headers.get("user-agent") ?? "";
  const referer = request.headers.get("referer") ?? "";

  // Fire and forget — no await intencional para no bloquear el redirect
  prisma.click
    .create({
      data: { linkId: link.id, visitorIp: ip, userAgent, referer },
    })
    .catch((err) => console.error("[click-register]", err));

  return NextResponse.redirect(link.originalUrl, { status: 307 });
}
```

---

## 15. ESTRATEGIA DE RENDERING

| Ruta                                                         | Tipo           | Implementación                                               |
| ------------------------------------------------------------ | -------------- | ------------------------------------------------------------ |
| `/`                                                          | Static         | Sin `dynamic`, exporta por defecto                           |
| `/login`, `/register`, `/forgot-password`, `/reset-password` | Static         | Sin `dynamic`                                                |
| `/dashboard/*`                                               | Dynamic SSR    | `export const dynamic = 'force-dynamic'`                     |
| `/r/[slug]`                                                  | Edge API Route | `export const runtime = 'edge'` (opcional, mejora velocidad) |
| `/link-expired`                                              | Static         | Sin `dynamic`                                                |

---

## 16. DISEÑO Y UI — DIRECTRICES

**Paleta de colores:** Usar los tokens de Tailwind/shadcn con CSS variables. Soportar dark mode. El agente NO elige colores custom sin consultar.

**Componentes shadcn a instalar:**

```bash
npx shadcn@latest add button card input label table dialog dropdown-menu badge \
  sidebar navigation-menu chart skeleton toast avatar separator sheet \
  form select calendar popover tooltip alert-dialog
```

**Layout del dashboard:**

- Sidebar izquierda fija (usa `<Sidebar>` de shadcn)
- Topbar con breadcrumb y menú de usuario
- Área de contenido con padding `p-6`
- Responsive: sidebar colapsa en móvil

**Reglas UI:**

- Siempre mostrar skeleton/loading state mientras cargan datos
- Siempre mostrar toast al completar una acción (éxito o error)
- Los formularios desactivan el botón de submit mientras están procesando
- Las acciones destructivas (eliminar link) requieren un dialog de confirmación
- Los URLs cortos en la tabla muestran botón de copiar al hover

---

## 17. TIPOS COMPARTIDOS (DTOs de output)

```typescript
// types/index.ts

export type LinkDTO = {
  id: string;
  slug: string;
  originalUrl: string;
  title: string | null;
  isActive: boolean;
  hasPassword: boolean; // true si passwordHash !== null (nunca exponer el hash)
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  clickCount: number;
  shortUrl: string; // NEXT_PUBLIC_APP_URL + /r/ + slug
};

export type AnalyticsSummary = {
  totalClicks: number;
  clicksToday: number;
  clicksThisWeek: number;
  avgClicksPerDay: number;
  clicksByDay: Array<{ date: string; clicks: number }>; // últimos 30 días
  topReferers: Array<{ referer: string; count: number }>;
};

export type DashboardStats = {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  protectedLinks: number;
  recentLinks: LinkDTO[];
  clicksLast7Days: Array<{ date: string; clicks: number }>;
};
```

---

## 18. SINGLETON DE PRISMA

```typescript
// lib/db/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

---

## 19. GENERACIÓN DE SLUGS

```typescript
// lib/utils/slug.ts
import { customAlphabet } from "nanoid";
import { prisma } from "@/lib/db/prisma";

// Solo caracteres URL-safe, sin ambiguos (0, O, l, 1)
const generateNanoid = customAlphabet(
  "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789",
  6,
);

export async function generateUniqueSlug(): Promise<string> {
  let slug = generateNanoid();
  let exists = await prisma.link.findUnique({
    where: { slug },
    select: { id: true },
  });

  while (exists) {
    slug = generateNanoid();
    exists = await prisma.link.findUnique({
      where: { slug },
      select: { id: true },
    });
  }

  return slug;
}
```

---

## 20. HASH DE PASSWORDS

```typescript
// lib/utils/hash.ts
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

---

## 21. ORDEN DE DESARROLLO (paso a paso)

El agente debe seguir este orden estrictamente. No pasar al siguiente paso sin completar el anterior.

### Paso 1 — Setup inicial

- [ ] `npx create-next-app@latest snapurl --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
- [ ] Instalar todas las dependencias del stack
- [ ] Configurar `tsconfig.json` con `strict: true`
- [ ] Crear `docker-compose.yml`
- [ ] Crear `.env.example` y `.env.local`
- [ ] Inicializar Prisma: `npx prisma init`
- [ ] Escribir `schema.prisma` completo
- [ ] Inicializar shadcn: `npx shadcn@latest init`
- [ ] Instalar componentes shadcn necesarios

### Paso 2 — Base de datos y modelos

- [ ] `docker compose up -d` (arrancar Postgres)
- [ ] `npx prisma migrate dev --name init`
- [ ] `npx prisma generate`
- [ ] Crear `lib/db/prisma.ts` (singleton)
- [ ] Crear `prisma/seed.ts` con usuario y links de prueba

### Paso 3 — Utilidades base

- [ ] `lib/utils/hash.ts`
- [ ] `lib/utils/slug.ts`
- [ ] `lib/utils/date.ts`
- [ ] `lib/utils/url.ts`
- [ ] `lib/validations/auth.schema.ts`
- [ ] `lib/validations/link.schema.ts`
- [ ] `types/index.ts`

### Paso 4 — Email

- [ ] `lib/email/mailer.ts`
- [ ] `lib/email/templates/reset-password.tsx`
- [ ] Verificar que Mailpit recibe emails en http://localhost:8025

### Paso 5 — Autenticación completa

- [ ] `auth.ts` (NextAuth config)
- [ ] `app/api/auth/[...nextauth]/route.ts`
- [ ] `middleware.ts`
- [ ] `lib/actions/auth.actions.ts` (register + forgotPassword + resetPassword)
- [ ] Páginas: login, register, forgot-password, reset-password
- [ ] Componentes: login-form, register-form, forgot-password-form, reset-password-form

### Paso 6 — Links CRUD

- [ ] `lib/actions/links.actions.ts` (create, update, delete, toggle)
- [ ] Páginas del dashboard: layout, home, links/page, links/new, links/[id]/edit
- [ ] Componentes: link-form, links-table, link-row-actions, delete-link-dialog

### Paso 7 — Redirect + Password Gate

- [ ] `app/r/[slug]/route.ts`
- [ ] `app/r/[slug]/page.tsx` (password gate)
- [ ] `app/link-expired/page.tsx`

### Paso 8 — Analytics

- [ ] `lib/actions/analytics.actions.ts`
- [ ] `app/(protected)/dashboard/analytics/[id]/page.tsx`
- [ ] Componentes: clicks-bar-chart, referers-pie-chart, analytics-stat-card

### Paso 9 — Dashboard overview

- [ ] Completar `app/(protected)/dashboard/page.tsx` con KPI cards + chart
- [ ] `components/dashboard/overview-cards.tsx`
- [ ] `components/dashboard/clicks-overview-chart.tsx`
- [ ] `components/dashboard/recent-links-table.tsx`

### Paso 10 — Settings + pulido final

- [ ] `app/(protected)/dashboard/settings/page.tsx`
- [ ] Landing page completa con form de acortado rápido
- [ ] `app/not-found.tsx` personalizada
- [ ] Zustand stores completos
- [ ] Dark mode funcional en toda la app
- [ ] Revisar que NINGÚN select de Prisma expone `passwordHash`
- [ ] Revisar que TODOS los Server Actions verifican sesión y ownership
- [ ] `prisma/seed.ts` funcional
- [ ] Probar flujo completo de reset de contraseña con Mailpit

---

## 22. CHECKLIST DE SEGURIDAD FINAL

Antes de considerar el desarrollo completo, verificar:

- [ ] `passwordHash` nunca aparece en respuestas al cliente (ni de User ni de Link)
- [ ] Todos los Server Actions verifican `session.user.id`
- [ ] Todos los Server Actions verifican que el recurso pertenece al usuario (`link.userId === session.user.id`)
- [ ] Todos los inputs de URL pasan por `sanitizeUrl()` antes de guardar
- [ ] Los tokens de reset son de un solo uso y expiran en 1 hora
- [ ] El mensaje de "forgot password" es idéntico exista o no la cuenta
- [ ] No hay stack traces expuestos en respuestas de error al cliente
- [ ] Las rutas del dashboard están protegidas por middleware
- [ ] El form de password gate valida el password en servidor (no solo cliente)
- [ ] Los campos de búsqueda/filtro están saneados antes de usar en queries

---

## 23. ERRORES COMUNES A EVITAR

| Error                                  | Cómo evitarlo                                                                       |
| -------------------------------------- | ----------------------------------------------------------------------------------- |
| Múltiples instancias de Prisma en dev  | Usar el patrón singleton del paso 18                                                |
| Exponer `passwordHash`                 | Siempre usar `select` explícito en Prisma                                           |
| Server Actions sin validación          | Siempre Zod antes de tocar la DB                                                    |
| Cache stale después de mutación        | Siempre `revalidatePath()` después de mutaciones                                    |
| Token de reset reutilizable            | Siempre marcar `usedAt` al consumir                                                 |
| Importar Prisma en componentes cliente | Solo en Server Components, Server Actions o API Routes                              |
| `use client` innecesario               | Usar Server Components por defecto; `use client` solo si se necesita interactividad |
| Props drilling profundo                | Usar Zustand para estado compartido entre componentes no relacionados               |

---

## 24. COMANDOS DE REFERENCIA RÁPIDA

```bash
# Desarrollo
npm run dev                           # Arrancar Next.js
docker compose up -d                  # Arrancar DB + Mailpit
docker compose down                   # Parar DB + Mailpit

# Prisma
npx prisma migrate dev --name <name>  # Nueva migración
npx prisma generate                   # Regenerar cliente
npx prisma studio                     # GUI de la DB en browser
npx prisma db seed                    # Ejecutar seed

# Inspección
# Ver DB: npx prisma studio → localhost:5555
# Ver emails: localhost:8025 (Mailpit)
# Ver app: localhost:3000
```

---

## 25. RESTRICCIONES ABSOLUTAS DEL AGENTE

1. **NO** añadir librerías fuera del stack definido en la sección 2
2. **NO** hacer deploy a Vercel hasta que el usuario lo confirme explícitamente
3. **NO** exponer `passwordHash` en ningún select, response ni log
4. **NO** hardcodear variables de entorno en el código
5. **NO** escribir lógica de negocio dentro de componentes (va en Server Actions)
6. **NO** omitir validación Zod en ningún Server Action
7. **NO** omitir verificación de ownership en operaciones sobre recursos del usuario
8. **NO** usar `any` en TypeScript — usar tipos explícitos siempre
9. **NO** saltarse pasos del orden de desarrollo de la sección 21
10. **NO** generar código de más de 150 líneas por archivo — dividir en módulos si es necesario

---

_FIN DE LA SKILL — Versión 1.0 | SnapURL Fullstack Agent_
