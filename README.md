# 💰 Flowly - Gestor de Finanzas Personales

Una aplicación moderna de gestión de finanzas personales construida con Next.js. Diseñada para ayudarte a controlar tus presupuestos, deudas, ingresos y metas de ahorro de forma sencilla e intuitiva.

## ✨ Características

- 💵 **Gestión de Presupuestos**: Crea presupuestos recurrentes o para proyectos específicos
- 📊 **Tracking de Gastos**: Registra tus gastos y monitorea el progreso
- 💳 **Gestión de Deudas**: Controla tus deudas, pagos y fechas de vencimiento
- 🎯 **Metas de Ahorro**: Establece objetivos financieros y monitorea tu progreso
- 💰 **Registro de Ingresos**: Documenta todas tus fuentes de ingresos
- 🔔 **Alertas Inteligentes**: Recibe notificaciones sobre presupuestos excedidos y deudas
- 🌙 **Dark Mode**: Interfaz adaptable a tu preferencia de tema
- 🔐 **Autenticación Segura**: Sistema de autenticación con Better Auth

## 🏗️ Stack Tecnológico

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Base de Datos**: [PostgreSQL](https://www.postgresql.org/) con [Prisma 7](https://www.prisma.io/)
- **Autenticación**: [Better Auth](https://www.better-auth.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Styles**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Formularios**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (strict mode)

## 📋 Requisitos Previos

- Node.js 18+
- pnpm 8+ (recomendado)
- PostgreSQL 12+

## 🚀 Instalación y Setup

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd flowly-app
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/flowly"

# Auth - Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Optional: OAuth providers
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

### 4. Configurar base de datos

```bash
# Crear y aplicar migraciones
pnpm prisma migrate dev

# (Opcional) Seed de datos de prueba
pnpm seed
```

## 📖 Desarrollo

### Iniciar servidor de desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Ver/editar datos en BD

```bash
pnpm prisma studio
```

### Linting

```bash
pnpm lint
```

## 📦 Scripts Disponibles

| Script                      | Descripción                             |
| --------------------------- | --------------------------------------- |
| `pnpm dev`                  | Inicia servidor de desarrollo           |
| `pnpm build`                | Construye la aplicación para producción |
| `pnpm start`                | Inicia servidor de producción           |
| `pnpm lint`                 | Ejecuta ESLint                          |
| `pnpm seed`                 | Ejecuta script de seeding               |
| `pnpm prisma studio`        | Abre Prisma Studio                      |
| `pnpm prisma migrate dev`   | Crea nueva migración                    |
| `pnpm prisma migrate reset` | Reset de BD (solo desarrollo)           |

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rutas de autenticación
│   ├── (private)/         # Rutas protegidas
│   ├── (site)/            # Rutas públicas
│   │   ├── budgets/
│   │   ├── debts/
│   │   └── goals/
│   └── api/
├── actions/               # Server Actions
│   ├── auth/
│   ├── budgets/
│   └── incomes/
├── components/            # Componentes React
│   ├── ui/               # Componentes base
│   ├── main/             # Componentes principales
│   ├── modal/            # Modales
│   └── providers/        # Context/Providers
├── hooks/                 # Custom Hooks
├── lib/                   # Utilidades core
├── schemas/              # Esquemas Zod
├── stores/               # Zustand stores
├── types/                # Tipos TypeScript
└── helpers/              # Funciones auxiliares

prisma/
├── schema.prisma         # Definición de modelos
├── migrations/           # Historial de migraciones
└── seed.ts              # Script de seeding
```

## 📊 Modelos de Base de Datos

- **User**: Usuario con información de finanzas
- **Budget**: Presupuestos recurrentes o por proyecto
- **BudgetTransaction**: Transacciones de presupuestos
- **Debt**: Deudas registradas
- **DebtPayment**: Pagos de deudas
- **Goal**: Metas de ahorro
- **GoalContribution**: Contribuciones a metas
- **Income**: Registros de ingresos
- **Alert**: Notificaciones y alertas

## 📚 Documentación Interna

Para información detallada sobre convenciones, patrones y guías de desarrollo, consulta [CLAUDE.md](./CLAUDE.md).

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/mi-feature`)
3. Commit tus cambios (`git commit -am 'Agrego mi feature'`)
4. Push a la rama (`git push origin feature/mi-feature`)
5. Abre un Pull Request

## 👤 Autor

**Orlando Armando Apodaca Concha**

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

Hecho con ❤️ para simplificar tu gestión financiera
