# Flowly App - Guía para Asistentes de IA

## 📋 Descripción del Proyecto

Flowly es una aplicación de gestión de finanzas personales construida con Next.js. Permite a los usuarios:

- Gestionar presupuestos (recurrentes y proyectos)
- Registrar deudas y pagos
- Establecer y monitorear metas de ahorro
- Registrar ingresos
- Recibir alertas sobre budgets y deudas

## 🏗️ Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **ORM**: Prisma 7 con PostgreSQL
- **Auth**: Better Auth
- **Client State**: Zustand, TanStack Query v5
- **UI**: Tailwind CSS, Radix UI, shadcn
- **Forms**: React Hook Form + Zod
- **Language**: TypeScript (strict mode)
- **Path Alias**: `@/*` → `./src/*`

## 📁 Estructura del Proyecto

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/auth/             # Auth pages (login, register)
│   ├── (private)/               # Protected routes
│   ├── (site)/                  # Public pages
│   │   ├── budgets/
│   │   ├── debts/
│   │   └── goals/
│   ├── admin/
│   └── api/auth/
├── actions/                      # Server actions
│   ├── auth/
│   ├── budgets/
│   └── incomes/
├── components/
│   ├── ui/                      # UI components (button, input, etc.)
│   ├── main/                    # Main layout components
│   ├── modal/                   # Modal components
│   ├── auth/                    # Auth-specific components
│   ├── providers/               # Context providers
│   └── shared/                  # Shared utilities
├── hooks/                        # React custom hooks
├── helpers/                      # Utility functions (formatters, etc.)
├── lib/                          # Core functionality
│   ├── auth.ts                  # Auth configuration
│   ├── auth-client.ts           # Client-side auth
│   ├── prisma.ts                # Prisma instance
│   └── utils.ts                 # General utilities
├── schemas/                      # Zod validation schemas
│   ├── auth.ts                  # Auth schemas
│   ├── pagination.ts            # Pagination schemas
│   └── prisma/                  # Auto-generated from Prisma
├── stores/                       # Zustand stores
├── types/                        # TypeScript types
└── generated/prisma/            # AUTO-GENERATED: Prisma Client
prisma/
├── schema.prisma                # DB models definition
├── seed.ts                      # DB seeding script
└── migrations/                  # DB migrations (DO NOT EDIT MANUALLY)
```

## 📊 Modelos de Base de Datos

### Users

- `id`, `name`, `email`, `emailVerified`, `image`
- `fullName`, `totalMoney`, `unassignedMoney`
- Relations: budgets, debts, goals, incomes, alerts, budgetTransactions, debtPayments, goalContributions

### Budgets

- `id`, `userId`, `name`, `type` (recurrent | project)
- `totalAssigned`, `spent`, `createdAt`
- Relations: transactions (BudgetTransaction[])

### BudgetTransaction

- `id`, `budgetId`, `userId`, `amount`, `description`
- `type` (expense | assignment), `date`, `createdAt`
- Relations: budget, user

### Debts

- `id`, `userId`, `name`, `totalDebt`, `remaining`
- `minimumPayment`, `dueDate`, `priority` (high | medium | low)
- Relations: payments (DebtPayment[])

### DebtPayment

- `id`, `debtId`, `userId`, `amount`, `description`, `date`, `createdAt`

### Goals

- `id`, `userId`, `name`, `target`, `current`, `deadline`
- Relations: contributions (GoalContribution[])

### GoalContribution

- `id`, `goalId`, `userId`, `amount`, `description`, `date`

### Income

- `id`, `userId`, `amount`, `description`, `date`, `createdAt`

### Alerts

- `id`, `userId`, `type` (debt | budget | goal)
- `title`, `message`, `isRead`, `createdAt`

## � Documentación de Esquema Detallada

Para una **referencia completa del esquema** con todas las fields, relaciones, validaciones y ejemplos de queries, consulta **[SCHEMA.md](./SCHEMA.md)**.

Este archivo es esencial cuando diseñes server actions y necesites:

- Conocer exactamente qué campos tiene cada modelo
- Ver ejemplos de queries Prisma
- Entender relaciones y cómo actualizar datos relacionados
- Consultar casos de uso típicos

## �🛠️ Convenciones

### Naming

- **Archivos de acciones**: kebab-case (e.g., `create-budget.action.ts`, `get-budgets.ts`)
- **Componentes**: PascalCase (e.g., `BudgetCard.tsx`, `HeroSection.tsx`)
- **Variables/functions**: camelCase (e.g., `calculateTotal`, `userId`)
- **Database fields**: snake_case en schema, camelCase en TypeScript

### Server Actions

- Ubicadas en `src/actions/[feature]/`
- Siempre incluir `'use server'` al inicio
- Retornar `ActionResponse` type
- Validar entrada con Zod schemas
- Manejar errores apropiadamente

### Schemas Zod

- Ubicadas en `src/schemas/`
- Nombres descriptivos (e.g., `CreateBudgetSchema`, `UpdateDebtSchema`)
- Exportar como tipos: `type CreateBudget = z.infer<typeof CreateBudgetSchema>`

### Tipos TypeScript

- Custom types en `src/types/`
- Interfaces para objetos complejos
- Usar `type` para uniones y tipos simples

### Componentes

- Functional components con TypeScript
- Props interface: `interface ComponentNameProps { }`
- Ubicación según tipo:
  - UI base: `components/ui/`
  - Feature-specific: `components/[feature]/`
  - Reusables: `components/shared/`

## 📚 Patterns Importantes

### Data Fetching

```typescript
// Server action para fetch
"use server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/actions/auth/get-user-id";

export async function getBudgets() {
  const userId = await getCurrentUserId();
  return prisma.budget.findMany({ where: { userId } });
}
```

### Validation

```typescript
import { z } from "zod";

const CreateBudgetSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["recurrent", "project"]),
});

type CreateBudget = z.infer<typeof CreateBudgetSchema>;
```

### Components

```typescript
interface HeroSectionProps {
  title: string;
  subtitle?: string;
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  // component code
}
```

## ✅ Buenas Prácticas

1. **Type Safety**: Siempre usar TypeScript, evitar `any`
2. **Validation**: Validar datos de usuario con Zod en server actions
3. **Error Handling**: Retornar ActionResponse con status y mensaje
4. **Prisma**: Usar el cliente generado en `src/generated/prisma`
5. **Queries**: Usar TanStack Query para client-side data fetching
6. **Auth**: Usar `getCurrentUserId()` o `getSession()` para obtener usuario actual
7. **Naming**: Mantener consistencia en nombres (snake_case BD, camelCase código)
8. **Indexes**: Mantener indexes en campos `userId` y foreign keys
9. **Dates**: Usar `DateTime` en Prisma, `@db.Date` para solo fechas

## ❌ No Hacer

- ❌ Modificar migration files manualmente → usar `pnpm prisma migrate dev`
- ❌ Cambiar estructura de carpetas sin considerar impacto
- ❌ Usar `any` en TypeScript
- ❌ Hardcodear IDs de usuario → usar `getCurrentUserId()`
- ❌ Queries a BD sin validación de userId (security)
- ❌ Modificar `src/generated/prisma/` → es auto-generado
- ❌ Usar `Float` para moneda sin considerar precisión (considerar `Decimal`)
- ❌ Queries N+1 sin relaciones incluidas en Prisma

## 🚀 Comandos Útiles

```bash
# Development
pnpm dev              # Start dev server
pnpm build           # Build proyecto
pnpm prisma studio  # Ver/editar BD visualmente

# Database
pnpm prisma migrate dev -n "nombre_cambio"  # Create migration
pnpm prisma migrate reset --force            # Reset DB (dev only!)
pnpm seed            # Run seed script

# Linting
pnpm lint            # Run ESLint
```

## 📝 Convención de Tipos de Strings Enumerados

Algunos campos usan strings en lugar de enums para mayor flexibilidad:

- `Budget.type`: "recurrent" | "project"
- `BudgetTransaction.type`: "expense" | "assignment"
- `Debt.priority`: "high" | "medium" | "low"
- `Alert.type`: "debt" | "budget" | "goal"

Considerar usar `String` enums en Prisma si estos valores se vuelven más predecibles.

## 🔐 Auth Context

El proyecto usa **Better Auth** para autenticación. Para operaciones que requieran usuario actual:

- `getSession()` → obtener sesión completa
- `getCurrentUserId()` → obtener solo el ID del usuario (ubicado en `src/actions/auth/get-user-id.ts`)

Siempre validar que el userId del usuario matchee con los datos que está accediendo.

---

**Última actualización**: Febrero 2026
**Versión**: 1.0
