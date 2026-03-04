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
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       ├── budget-card.tsx
│   │   │       ├── budgets-grid.tsx
│   │   │       ├── budgets-summary.tsx
│   │   │       ├── budgets-controls.tsx
│   │   │       └── modal/
│   │   │           ├── budget-history-modal.tsx
│   │   │           ├── create-budget-modal.tsx
│   │   │           ├── edit-transaction-modal.tsx
│   │   │           └── spend-assign-modal.tsx
│   │   ├── debts/
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       ├── debt-card.tsx
│   │   │       ├── debts-grid.tsx
│   │   │       ├── debts-summary.tsx
│   │   │       ├── debts-controls.tsx
│   │   │       └── modal/
│   │   │           ├── debt-history-modal.tsx
│   │   │           ├── create-debt-modal.tsx
│   │   │           ├── edit-debt-payment-modal.tsx
│   │   │           └── pay-debt-modal.tsx
│   │   └── goals/
│   │       ├── page.tsx
│   │       └── _components/
│   │           ├── goal-card.tsx
│   │           ├── goals-grid.tsx
│   │           ├── goals-summary.tsx
│   │           ├── goals-controls.tsx
│   │           └── modal/
│   │               ├── goal-history-modal.tsx
│   │               ├── create-goal-modal.tsx
│   │               ├── edit-goal-contribution-modal.tsx
│   │               └── contribute-goal-modal.tsx
│   ├── admin/
│   └── api/auth/
├── actions/                      # Server actions
│   ├── auth/
│   ├── budgets/                  # Budget CRUD + transactions
│   ├── debts/                    # Debt CRUD + payments
│   ├── goals/                    # Goal CRUD + contributions
│   ├── incomes/
│   └── landing/
├── components/
│   ├── ui/                      # UI components (button, input, etc.)
│   ├── modal/                   # Shared modal components
│   ├── auth/                    # Auth-specific components
│   ├── landing/                 # Landing page components (sliders)
│   ├── providers/               # Context providers
│   ├── shared/                  # Shared utilities
│   ├── skeletons/               # Skeleton loaders
│   └── theme/                   # Theme provider & toggle
├── hooks/                        # React custom hooks
│   ├── useBudget.tsx            # Budget hooks (useCreateBudgetTransaction, etc.)
│   ├── useDebt.tsx              # Debt hooks (useCreateDebtPayment, etc.)
│   └── useGoal.tsx              # Goal hooks (useCreateGoalContribution, etc.)
├── helpers/                      # Utility functions (formatters, etc.)
│   ├── currency-formatter.tsx
│   └── date-formatter.tsx
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
│   ├── budget-modals.store.ts   # Budget modal state
│   ├── debt-modals.store.ts     # Debt modal state
│   └── goal-modals.store.ts     # Goal modal state
├── types/                        # TypeScript types
│   └── action-response.type.ts
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
- `createdAt`, `updatedAt`
- Relations: payments (DebtPayment[])

### DebtPayment

- `id`, `debtId`, `userId`, `amount`, `description`, `date`, `createdAt`
- Relations: debt, user

### Goals

- `id`, `userId`, `name`, `target`, `current` (monto alcanzado)
- `deadline`, `createdAt`, `updatedAt`
- Relations: contributions (GoalContribution[])

### GoalContribution

- `id`, `goalId`, `userId`, `amount`, `description`, `date`, `createdAt`
- Relations: goal, user

### Income

- `id`, `userId`, `amount`, `description`, `date`, `createdAt`
- Relations: user

### Alerts

- `id`, `userId`, `type` (debt | budget | goal)
- `title`, `message`, `isRead`, `createdAt`
- Relations: user

## 🏛️ Arquitectura de Tres Sistemas Paralelos

El proyecto implementa tres subsistemas financieros completamente paralelos: **Budgets**, **Goals**, y **Debts**. Cada uno tiene arquitectura idéntica con diferentes dominios y expresiones de interfaz.

### Mapeo de Conceptos

| Aspecto                | Budgets                     | Goals                   | Debts                   |
| ---------------------- | --------------------------- | ----------------------- | ----------------------- |
| **Entidad Principal**  | Budget                      | Goal                    | Debt                    |
| **Entidad Secundaria** | BudgetTransaction           | GoalContribution        | DebtPayment             |
| **Acción Secundaria**  | Gastar / Asignar            | Contribuir / Abonar     | Pagar                   |
| **Store Zustand**      | budget-modals.store.ts      | goal-modals.store.ts    | debt-modals.store.ts    |
| **Hook Principal**     | useBudget.tsx               | useGoal.tsx             | useDebt.tsx             |
| **Componente Card**    | BudgetCard                  | GoalCard                | DebtCard                |
| **Componentes UI**     | budget-grid, budget-summary | goal-grid, goal-summary | debt-grid, debt-summary |

### Componentes por Sistema

#### Budget System

**Location**: `src/app/(site)/budgets/_components/`

- **budget-card.tsx**: Card individual para cada presupuesto con botones de Gastar y Asignar

  - Props: Budget object
  - Modales: switchSpendModal, switchAssignModal, switchHistoryModal
  - Styling: variant="ghost" buttons para colores personalizados en hover

- **budgets-grid.tsx**: Grid que mapea todos los budgets usando `useGetBudgets()` hook

  - Data source: TanStack Query con useGetBudgets custom hook

- **budgets-summary.tsx**: Card de resumen with total assigned, total spent, y progress bar

  - Botón: switchCreateBudgetModal para crear presupuesto nuevo
  - Styling: bg-primary/5, text-lg text-primary

- **budgets-controls.tsx**: Container que renderiza los 4 modales de budgets

**Modales**: `src/app/(site)/budgets/_components/modal/`

- **budget-history-modal.tsx**: Dialog con lista de transacciones e inline editing

  - Sizing: max-w-lg max-h-[80vh] flex flex-col (patrón compartido)
  - List container: flex-1 overflow-y-auto space-y-2 pr-1
  - Footer: "Agregar gasto" + "Eliminar" buttons
  - Inline editing: EditTransactionInline component

- **create-budget-modal.tsx**: Dialog para crear nuevo presupuesto

  - Fields: name, type (recurrent|project)
  - Hook: useCreateBudget

- **edit-transaction-modal.tsx**: Inline edit component para transacciones existentes

  - Botones: Check (verde) y X (rojo) con variant="ghost"
  - Hook: useUpdateBudgetTransaction

- **spend-assign-modal.tsx**: Dialog para registrar gasto o asignación
  - Diferenciación: toggle entre Gasto y Asignación
  - Hook: useCreateBudgetTransaction

#### Goal System

**Location**: `src/app/(site)/goals/_components/`

- **goal-card.tsx**: Card individual para cada meta con progress indicator

  - Props: Goal object
  - Modales: switchHistoryModal, switchContributeModal
  - Styling: Muestra progreso de forma visual (current / target)

- **goals-grid.tsx**: Grid que mapea todos los goals usando `useGetGoals()` hook

- **goals-summary.tsx**: Resumen con total meta, total alcanzado, progress general

  - Botón: switchCreateGoalModal
  - Cálculo: overallProgress = (totalAchieved / totalTarget) \* 100

- **goals-controls.tsx**: Container con los 4 modales de goals

**Modales**: `src/app/(site)/goals/_components/modal/`

- **goal-history-modal.tsx**: Dialog con lista de contribuciones e inline editing

  - Sizing: max-w-lg max-h-[80vh] flex flex-col (idéntico a budget)
  - List container: flex-1 overflow-y-auto space-y-2 pr-1
  - Footer: "Agregar contribución" button calls switchContributeModal
  - Inline editing: EditGoalContributionInline component

- **create-goal-modal.tsx**: Dialog para crear nueva meta

  - Fields: name, target, deadline
  - Hook: useCreateGoal

- **edit-goal-contribution-modal.tsx**: Inline edit para contribuciones

  - Botones: Check (verde) y X (rojo)
  - Hook: useUpdateGoalContribution

- **contribute-goal-modal.tsx**: Dialog para agregar contribución a meta
  - Fields: amount, description
  - Hook: useCreateGoalContribution

#### Debt System

**Location**: `src/app/(site)/debts/_components/`

- **debt-card.tsx**: Card individual con styling basado en prioridad

  - Props: Debt object
  - Modales: switchHistoryModal, switchPayModal
  - Priority styling: isPriority → destructive colors para high priority

- **debts-grid.tsx**: Grid que mapea todas las deudas usando `useGetDebts()` hook

- **debts-summary.tsx**: Resumen con deuda total, pagado, y progreso

  - Progress circle: (totalPaid / totalDebt) \* 100
  - Botón: switchCreateDebtModal para crear deuda nueva

- **debts-controls.tsx**: Container con los 4 modales de debts

**Modales**: `src/app/(site)/debts/_components/modal/`

- **debt-history-modal.tsx**: Dialog con lista de pagos e inline editing

  - Sizing: max-w-lg max-h-[80vh] flex flex-col (patrón consistente)
  - List container: flex-1 overflow-y-auto space-y-2 pr-1
  - Footer: "Agregar pago" + "Eliminar" buttons
  - Inline editing: EditDebtPaymentInline component

- **create-debt-modal.tsx**: Dialog para crear nueva deuda

  - Fields: name, totalDebt, minimumPayment, dueDate, priority
  - Hook: useCreateDebt

- **edit-debt-payment-modal.tsx**: Inline edit para pagos individuales

  - Calcula amountDifference para actualizar debt.remaining
  - Hook: useUpdateDebtPayment

- **pay-debt-modal.tsx**: Dialog para registrar pago
  - Fields: amount, description
  - Preview: muestra total a pagar
  - Hook: useCreateDebtPayment

### Server Actions por Sistema

#### Budget Actions

**Location**: `src/actions/budgets/`

- `create-budget.ts`: Creates Budget with totalAssigned=0, spent=0
- `delete-budget.ts`: Deletes budget and cascades delete transactions
- `update-budget.ts`: Updates budget fields (name, type)
- `get-budgets.ts`: Fetches all budgets for current user, ordered by createdAt desc
- `get-latest-budgets.ts`: Fetches N latest budgets (used in landing slider)
- `create-budget-transaction.ts`: Creates transaction, updates budget.spent
- `delete-budget-transaction.ts`: Deletes transaction, updates budget.spent (or totalAssigned)
- `update-budget-transaction.ts`: Updates transaction, adjusts budget metrics accordingly

#### Goal Actions

**Location**: `src/actions/goals/`

- `create-goal.ts`: Creates Goal with current=0
- `delete-goal.ts`: Deletes goal and cascades delete contributions
- `update-goal.ts`: Updates goal fields (name, target, deadline)
- `get-goals.ts`: Fetches all goals for user, ordered by createdAt desc
- `get-latest-goals.ts`: Fetches N latest goals (landing slider)
- `create-goal-contribution.ts`: Creates contribution, increments goal.current using Prisma $transaction
- `delete-goal-contribution.ts`: Deletes contribution, decrements goal.current
- `update-goal-contribution.ts`: Updates contribution, adjusts goal.current by difference
- `get-goal-contributions.ts`: Fetches all contributions for goal

#### Debt Actions

**Location**: `src/actions/debts/`

- `create-debt.ts`: Creates Debt with remaining=totalDebt
- `delete-debt.ts`: Deletes debt and cascades delete payments
- `update-debt.ts`: Updates debt fields (name, priority, minimumPayment, etc.)
- `get-debts.ts`: Fetches all debts for user, ordered by createdAt desc
- `get-latest-debts.ts`: Fetches N latest debts (landing slider, typically 4)
- `create-debt-payment.ts`: Creates payment, decrements debt.remaining using Prisma $transaction
- `delete-debt-payment.ts`: Deletes payment, increments debt.remaining
- `update-debt-payment.ts`: Updates payment, adjusts debt.remaining by difference
- `get-debt-payments.ts`: Fetches all payments for debt

### Custom Hooks por Sistema

Each system has identical hook pattern with domain-specific names:

#### Budget Hooks (`src/hooks/useBudget.tsx`)

```typescript
export function useGetBudgets(); // useQuery for all budgets
export function useLatestBudgets(take: number); // useQuery for N latest
export function useCreateBudget(); // useMutation for create
export function useDeleteBudget(); // useMutation for delete
export function useUpdateBudget(); // useMutation for update
export function useBudgetTransactions(budgetId: string); // useQuery for transactions
export function useCreateBudgetTransaction(); // useMutation
export function useDeleteBudgetTransaction(); // useMutation
export function useUpdateBudgetTransaction(); // useMutation
```

#### Goal Hooks (`src/hooks/useGoal.tsx`)

```typescript
export function useGetGoals(); // useQuery for all goals
export function useLatestGoals(take: number); // useQuery for N latest
export function useCreateGoal(); // useMutation for create
export function useDeleteGoal(); // useMutation for delete
export function useUpdateGoal(); // useMutation for update
export function useGoalContributions(goalId: string); // useQuery for contributions
export function useCreateGoalContribution(); // useMutation
export function useDeleteGoalContribution(); // useMutation
export function useUpdateGoalContribution(); // useMutation
```

#### Debt Hooks (`src/hooks/useDebt.tsx`)

```typescript
export function useGetDebts(); // useQuery for all debts
export function useLatestDebts(take: number = 4); // useQuery for N latest
export function useCreateDebt(); // useMutation for create
export function useDeleteDebt(); // useMutation for delete
export function useUpdateDebt(); // useMutation for update
export function useDebtPayments(debtId: string); // useQuery for payments
export function useCreateDebtPayment(); // useMutation
export function useDeleteDebtPayment(); // useMutation
export function useUpdateDebtPayment(); // useMutation
```

**Query Invalidation Strategy:**

- On create child: invalidate parent list and parent detail queries
- On delete child: invalidate parent list and parent detail queries
- On update child: invalidate parent detail and set query data for children list

### Zustand Modal Stores

Each system has a dedicated modal state store:

#### Budget Modals Store (`src/stores/budget-modals.store.ts`)

```typescript
interface BudgetModal {
  spend: { budgetId: string; name: string; isOpen: boolean };
  assign: { budgetId: string; name: string; isOpen: boolean };
  history: { budgetId: string; budgetName: string; isOpen: boolean };
  editTransaction: { budgetId: string; transaction: BudgetTransaction; isOpen: boolean };
}
```

Actions: `switchSpendModal(id, name)`, `switchAssignModal(id, name)`, etc.

#### Goal Modals Store (`src/stores/goal-modals.store.ts`)

```typescript
interface GoalModal {
  createGoal: { isOpen: boolean };
  history: { goalId: string; goalName: string; isOpen: boolean };
  editContribution: { goalId: string; contribution: GoalContribution; isOpen: boolean };
  contribute: { goalId: string; name: string; isOpen: boolean };
}
```

Actions: `switchCreateGoalModal(isOpen)`, `switchHistoryModal(id, name)`, etc.

#### Debt Modals Store (`src/stores/debt-modals.store.ts`)

```typescript
interface DebtModal {
  createDebt: { isOpen: boolean };
  history: { debtId: string; debtName: string; isOpen: boolean };
  editPayment: { debtId: string; payment: DebtPayment; isOpen: boolean };
  pay: { debtId: string; name: string; isOpen: boolean };
}
```

Actions: `switchCreateDebtModal(isOpen)`, `switchHistoryModal(id, name)`, etc.

### Landing Page Components

**Location**: `src/components/landing/`

- **budgets-slider.tsx**: Horizontal scroll de últimos 4 budgets

  - Hook: useLatestBudgets(4)
  - Incluye todos los modales de budget
  - Loading skeleton: SkeletonCard components
  - Empty state: "No hay presupuestos registrados"

- **goals-slider.tsx**: Horizontal scroll de últimos 3 goals

  - Hook: useLatestGoals(3)
  - Incluye todos los modales de goal
  - Loading skeleton y empty state

- **debts-slider.tsx**: Horizontal scroll de últimas 4 deudas
  - Hook: useLatestDebts(4)
  - Incluye todos los modales de debt
  - Loading skeleton y empty state

## 📖 Esquema Detallado

Para una **referencia completa del esquema** con todas las fields, relaciones, validaciones y ejemplos de queries, consulta **[SCHEMA.md](./SCHEMA.md)**.

Este archivo es esencial cuando diseñes server actions y necesites:

- Conocer exactamente qué campos tiene cada modelo
- Ver ejemplos de queries Prisma
- Entender relaciones y cómo actualizar datos relacionados
- Consultar casos de uso típicos

## 🧩 Patrones Clave del Sistema

### 1. Modal History con Inline Editing

Todos los modales de historial (budget, goal, debt) implementan un patrón consistente:

**Estructura HTML**:

```html
<DialogContent className="rounded-2xl max-w-lg max-h-[80vh] flex flex-col">
  <DialogHeader><!-- Header --></DialogHeader>
  <div className="flex-1 overflow-y-auto space-y-2 pr-1">{/* List items - scrollable container */}</div>
  <div className="p-3 bg-primary/5"><!-- Summary --></div>
  <DialogFooter><!-- Buttons: "Agregar X" + "Eliminar" --></DialogFooter>
</DialogContent>
```

**Key Classes**:

- `max-w-lg max-h-[80vh] flex flex-col`: Fixed max width, 80% viewport height, flex layout
- `flex-1 overflow-y-auto space-y-2 pr-1`: Scrollable content that fills available space
- `bg-primary/5 text-lg text-primary`: Consistent summary styling

**Inline Editing Pattern**:

```typescript
// In history modal component:
const [editingId, setEditingId] = useState<string | null>(null);

{
  items.map((item) => (editingId === item.id ? <EditItemInline item={item} onSave={() => setEditingId(null)} onCancel={() => setEditingId(null)} /> : <ItemRow item={item} onEdit={() => setEditingId(item.id)} />));
}
```

### 2. Transacciones Atómicas con Prisma

Para operaciones que actualizan múltiples records relacionados, usar `$transaction`:

```typescript
// Example: Create payment and update debt.remaining
await prisma.$transaction(async (tx) => {
  // Create the payment
  const payment = await tx.debtPayment.create({
    data: { debtId, userId, amount, description, date },
  });

  // Update parent debt
  await tx.debt.update({
    where: { id: debtId },
    data: { remaining: { decrement: amount } },
  });

  return payment;
});
```

**When to Use Transactions**:

- Creating child record and updating parent metrics
- Deleting child record and updating parent metrics
- Multiple related updates that must succeed together

### 3. React Query Cache Invalidation

Patrón de invalidación para mantener caché sincronizado:

```typescript
export function useCreateBudgetTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => await createBudgetTransaction(data),
    onSuccess: (data, variables) => {
      // Invalidate both parent and list queries
      queryClient.invalidateQueries({
        queryKey: ["budgets", variables.budgetId],
      });
      queryClient.invalidateQueries({
        queryKey: ["budgets"],
      });

      // Optional: immediately update transactions list
      queryClient.setQueryData(["budgetTransactions", variables.budgetId], (old) => [...(old || []), data]);
    },
  });
}
```

### 4. Server Action Response Pattern

Todos los server actions retornan `ActionResponse`:

```typescript
"use server";

interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export async function createBudget(input: CreateBudgetInput): Promise<ActionResponse> {
  try {
    const userId = await getCurrentUserId();

    // Validate with Zod
    const parsed = CreateBudgetSchema.parse(input);

    // Create in database
    const budget = await prisma.budget.create({
      data: {
        userId,
        ...parsed,
      },
    });

    return {
      success: true,
      message: "Presupuesto creado",
      data: budget,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al crear presupuesto",
    };
  }
}
```

### 5. Button Styling para Colores Personalizados

Para modales inline con botones custom colored (Check verde, X rojo):

```typescript
// ✅ Correcto: variant="ghost" permite colores custom
<Button
  size="sm"
  variant="ghost"
  className="text-green-600 hover:text-green-700 hover:bg-green-100"
>
  <Check className="h-4 w-4" />
</Button>

// ❌ Incorrecto: variant="outline" sobrescribe hover
<Button
  size="sm"
  variant="outline"
  className="text-green-600 hover:text-green-700" // No funciona
>
  <Check className="h-4 w-4" />
</Button>
```

**Pattern**: Usar `variant="ghost"` cuando necesites control total sobre hover colors.

### 6. Form Sync Pattern para Modal Inline Editing

```typescript
export function EditTransactionInline({ transaction, onSave }) {
  const form = useForm<EditTransactionInput>({
    defaultValues: {
      amount: transaction.amount,
      description: transaction.description,
    },
  });

  // ⚠️ IMPORTANTE: Sincronizar valores cuando la prop cambia
  useEffect(() => {
    form.reset({
      amount: transaction.amount,
      description: transaction.description,
    });
  }, [transaction, form]);

  const onSubmit = async (data) => {
    await updateTransaction(transaction.id, data);
    onSave();
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* Form fields */}</form>;
}
```

## 🛠️ Convenciones

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

**Última actualización**: Marzo 2026
**Versión**: 1.1

Cambios en v1.1:

- ✅ Documentación completa de los tres sistemas paralelos (Budgets, Goals, Debts)
- ✅ Arquitectura de componentes por sistema con ubicaciones y responsabilidades
- ✅ Server actions completos listados (7-8 acciones por sistema)
- ✅ Custom hooks documentados (8+ hooks por sistema)
- ✅ Zustand modal stores con interfaces de estado
- ✅ Landing page components para sliders
- ✅ Patrones clave del sistema (inline editing, transacciones, React Query, etc.)
- ✅ Estructura de carpetas actualizada con detalles de cada subsistema
