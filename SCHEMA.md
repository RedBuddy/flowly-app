# 📊 Esquema de Base de Datos - Flowly

Guía de referencia del diseño de la base de datos para consultar mientras programas acciones.

---

## 🧑 Model: `User`

**Tabla:** `user`

Representa el usuario de la aplicación con información de autenticación y finanzas.

### Campos

| Campo             | Tipo     | Atributos                             | Descripción                                   |
| ----------------- | -------- | ------------------------------------- | --------------------------------------------- |
| `id`              | String   | @id                                   | ID único del usuario (auto-generado por Auth) |
| `name`            | String   |                                       | Nombre de la cuenta de usuario                |
| `email`           | String   | @unique                               | Email único para login                        |
| `emailVerified`   | Boolean  | @default(false)                       | Estado de verificación de email               |
| `image`           | String?  | Nullable                              | URL de avatar del usuario                     |
| `fullName`        | String?  | Nullable, @map("full_name")           | Nombre completo                               |
| `totalMoney`      | Float    | @default(0), @map("total_money")      | Dinero total del usuario                      |
| `unassignedMoney` | Float    | @default(0), @map("unassigned_money") | Dinero sin asignar a presupuestos             |
| `createdAt`       | DateTime | @default(now()), @map("created_at")   | Fecha de creación                             |
| `updatedAt`       | DateTime | @updatedAt, @map("updated_at")        | Última actualización                          |

### Relaciones

| Relación             | Tipo                | Descripción                             |
| -------------------- | ------------------- | --------------------------------------- |
| `budgets`            | Budget[]            | Presupuestos del usuario                |
| `debts`              | Debt[]              | Deudas del usuario                      |
| `goals`              | Goal[]              | Metas de ahorro del usuario             |
| `incomes`            | Income[]            | Ingresos registrados                    |
| `alerts`             | Alert[]             | Alertas del usuario                     |
| `budgetTransactions` | BudgetTransaction[] | Todas las transacciones de presupuestos |
| `debtPayments`       | DebtPayment[]       | Todos los pagos de deudas               |
| `goalContributions`  | GoalContribution[]  | Todas las contribuciones a metas        |
| `sessions`           | Session[]           | Sesiones activas                        |
| `accounts`           | Account[]           | Cuentas conectadas (OAuth)              |

### Ejemplo Query

```typescript
// Obtener usuario con todos sus presupuestos
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    budgets: true,
    incomes: true,
  },
});
```

---

## 💳 Model: `Budget`

**Tabla:** `budgets`

Presupuestos del usuario (recurrentes o por proyecto).

### Campos

| Campo           | Tipo     | Atributos                           | Descripción              |
| --------------- | -------- | ----------------------------------- | ------------------------ |
| `id`            | String   | @id, @default(cuid())               | ID único                 |
| `userId`        | String   | @map("user_id"), @index             | ID del propietario       |
| `name`          | String   |                                     | Nombre del presupuesto   |
| `type`          | String   |                                     | "recurrent" \| "project" |
| `totalAssigned` | Float    | @default(0), @map("total_assigned") | Dinero asignado total    |
| `spent`         | Float    | @default(0)                         | Dinero gastado           |
| `createdAt`     | DateTime | @default(now()), @map("created_at") | Fecha de creación        |

### Relaciones

| Relación       | Tipo                | Descripción                             |
| -------------- | ------------------- | --------------------------------------- |
| `user`         | User                | Usuario propietario                     |
| `transactions` | BudgetTransaction[] | Todas las transacciones del presupuesto |

### Validaciones/Constraints

- Requiere `userId` válido
- `type` debe ser "recurrent" o "project"
- Eliminación en cascada: si user se elimina, presupuesto se elimina

### Ejemplo Query

```typescript
// Obtener presupuestos de un usuario con sus transacciones
const budgets = await prisma.budget.findMany({
  where: { userId },
  include: {
    transactions: {
      orderBy: { date: "desc" },
    },
  },
});

// Calcular gastado
const total_spent = budget.transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
```

---

## 💸 Model: `BudgetTransaction`

**Tabla:** `budget_transactions`

Transacciones dentro de un presupuesto (gastos o asignaciones).

### Campos

| Campo         | Tipo     | Atributos                           | Descripción                           |
| ------------- | -------- | ----------------------------------- | ------------------------------------- |
| `id`          | String   | @id, @default(cuid())               | ID único                              |
| `budgetId`    | String   | @map("budget_id"), @index           | ID del presupuesto                    |
| `userId`      | String   | @map("user_id"), @index             | ID del usuario (para queries rápidas) |
| `amount`      | Float    |                                     | Monto de la transacción               |
| `description` | String?  | Nullable                            | Detalle de qué es el gasto            |
| `type`        | String   |                                     | "expense" \| "assignment"             |
| `date`        | DateTime | @default(now())                     | Fecha del movimiento                  |
| `createdAt`   | DateTime | @default(now()), @map("created_at") | Fecha de registro                     |

### Relaciones

| Relación | Tipo   | Descripción                     |
| -------- | ------ | ------------------------------- |
| `budget` | Budget | Presupuesto asociado            |
| `user`   | User   | Usuario que hizo la transacción |

### Tipos Explicados

**type:**

- `"expense"`: Gasto contra el presupuesto (reduce dinero disponible)
- `"assignment"`: Asignación de dinero nuevo al presupuesto

### Ejemplo Query

```typescript
// Obtener gastos de hoy
const todayExpenses = await prisma.budgetTransaction.findMany({
  where: {
    userId,
    type: "expense",
    date: {
      gte: new Date(new Date().setHours(0, 0, 0, 0)),
      lte: new Date(),
    },
  },
});

// Calcular total gastado en un presupuesto
const spent = await prisma.budgetTransaction.aggregate({
  where: { budgetId, type: "expense" },
  _sum: { amount: true },
});
```

---

## 💳 Model: `Debt`

**Tabla:** `debts`

Deudas registradas del usuario.

### Campos

| Campo            | Tipo      | Atributos                            | Descripción                       |
| ---------------- | --------- | ------------------------------------ | --------------------------------- |
| `id`             | String    | @id, @default(cuid())                | ID único                          |
| `userId`         | String    | @map("user_id"), @index              | ID del propietario                |
| `name`           | String    |                                      | Nombre/descripción de la deuda    |
| `totalDebt`      | Float     | @map("total_debt")                   | Monto total adeudado inicialmente |
| `remaining`      | Float     |                                      | Monto faltante por pagar          |
| `minimumPayment` | Float     | @default(0), @map("minimum_payment") | Pago mínimo mensual               |
| `dueDate`        | DateTime? | Nullable, @db.Date, @map("due_date") | Fecha de vencimiento              |
| `priority`       | String    |                                      | "high" \| "medium" \| "low"       |
| `createdAt`      | DateTime  | @default(now()), @map("created_at")  | Fecha de creación                 |

### Relaciones

| Relación   | Tipo          | Descripción         |
| ---------- | ------------- | ------------------- |
| `user`     | User          | Usuario propietario |
| `payments` | DebtPayment[] | Historial de pagos  |

### Validaciones

- `remaining` nunca debe ser negativo
- `remaining` ≤ `totalDebt`
- `dueDate` es opcional

### Ejemplo Query

```typescript
// Obtener deudas pendientes ordenadas por prioridad
const pendingDebts = await prisma.debt.findMany({
  where: { userId },
  include: {
    payments: {
      orderBy: { date: "desc" },
    },
  },
  orderBy: {
    priority: "asc", // high, medium, low
  },
});

// Calcular deuda total del usuario
const totalDebt = await prisma.debt.aggregate({
  where: { userId },
  _sum: { remaining: true },
});
```

---

## 💰 Model: `DebtPayment`

**Tabla:** `debt_payments`

Pagos realizados contra una deuda.

### Campos

| Campo         | Tipo     | Atributos                           | Descripción       |
| ------------- | -------- | ----------------------------------- | ----------------- |
| `id`          | String   | @id, @default(cuid())               | ID único          |
| `debtId`      | String   | @map("debt_id"), @index             | ID de la deuda    |
| `userId`      | String   | @map("user_id"), @index             | ID del usuario    |
| `amount`      | Float    |                                     | Monto pagado      |
| `description` | String?  | Nullable                            | Nota del pago     |
| `date`        | DateTime | @default(now())                     | Fecha del pago    |
| `createdAt`   | DateTime | @default(now()), @map("created_at") | Fecha de registro |

### Relaciones

| Relación | Tipo | Descripción      |
| -------- | ---- | ---------------- |
| `debt`   | Debt | Deuda asociada   |
| `user`   | User | Usuario que pagó |

### Importante

Al registrar un pago, debes:

1. Crear el DebtPayment
2. Actualizar `Debt.remaining` restando el monto

```typescript
// Registrar pago + actualizar deuda
const payment = await prisma.debtPayment.create({
  data: {
    debtId,
    userId,
    amount,
    description,
  },
});

const updatedDebt = await prisma.debt.update({
  where: { id: debtId },
  data: {
    remaining: {
      decrement: amount,
    },
  },
});
```

---

## 🎯 Model: `Goal`

**Tabla:** `goals`

Metas de ahorro del usuario.

### Campos

| Campo       | Tipo      | Atributos                           | Descripción                |
| ----------- | --------- | ----------------------------------- | -------------------------- |
| `id`        | String    | @id, @default(cuid())               | ID único                   |
| `userId`    | String    | @map("user_id"), @index             | ID del propietario         |
| `name`      | String    |                                     | Nombre de la meta          |
| `target`    | Float     |                                     | Monto objetivo             |
| `current`   | Float     | @default(0)                         | Monto ahorrado hasta ahora |
| `deadline`  | DateTime? | Nullable, @db.Date                  | Fecha límite               |
| `createdAt` | DateTime  | @default(now()), @map("created_at") | Fecha de creación          |

### Relaciones

| Relación        | Tipo               | Descripción          |
| --------------- | ------------------ | -------------------- |
| `user`          | User               | Usuario propietario  |
| `contributions` | GoalContribution[] | Historial de aportes |

### Cálculos Útiles

```typescript
// Porcentaje avanzado
const progress = (goal.current / goal.target) * 100;

// Falta por ahorrar
const remaining = goal.target - goal.current;

// ¿Meta completada?
const isComplete = goal.current >= goal.target;
```

### Ejemplo Query

```typescript
// Obtener todas las metas de un usuario
const goals = await prisma.goal.findMany({
  where: { userId },
  include: {
    contributions: {
      orderBy: { date: "desc" },
    },
  },
});
```

---

## 🏦 Model: `GoalContribution`

**Tabla:** `goal_contributions`

Aportes realizados hacia una meta de ahorro.

### Campos

| Campo         | Tipo     | Atributos                           | Descripción       |
| ------------- | -------- | ----------------------------------- | ----------------- |
| `id`          | String   | @id, @default(cuid())               | ID único          |
| `goalId`      | String   | @map("goal_id"), @index             | ID de la meta     |
| `userId`      | String   | @map("user_id"), @index             | ID del usuario    |
| `amount`      | Float    |                                     | Monto aportado    |
| `description` | String?  | Nullable                            | Nota del aporte   |
| `date`        | DateTime | @default(now())                     | Fecha del aporte  |
| `createdAt`   | DateTime | @default(now()), @map("created_at") | Fecha de registro |

### Relaciones

| Relación | Tipo | Descripción        |
| -------- | ---- | ------------------ |
| `goal`   | Goal | Meta asociada      |
| `user`   | User | Usuario que aportó |

### Importante

Al registrar un aporte, debes:

1. Crear el GoalContribution
2. Actualizar `Goal.current` sumando el monto

```typescript
// Registrar aporte + actualizar meta
const contribution = await prisma.goalContribution.create({
  data: {
    goalId,
    userId,
    amount,
    description,
  },
});

const updatedGoal = await prisma.goal.update({
  where: { id: goalId },
  data: {
    current: {
      increment: amount,
    },
  },
});
```

---

## 💵 Model: `Income`

**Tabla:** `incomes`

Registros de ingresos del usuario.

### Campos

| Campo         | Tipo     | Atributos                           | Descripción                             |
| ------------- | -------- | ----------------------------------- | --------------------------------------- |
| `id`          | String   | @id, @default(cuid())               | ID único                                |
| `userId`      | String   | @map("user_id"), @index             | ID del propietario                      |
| `amount`      | Float    |                                     | Monto ingresado                         |
| `description` | String?  | Nullable                            | Origen del ingreso (salario, bono, etc) |
| `date`        | DateTime | @default(now())                     | Fecha del ingreso                       |
| `createdAt`   | DateTime | @default(now()), @map("created_at") | Fecha de registro                       |

### Relaciones

| Relación | Tipo | Descripción                 |
| -------- | ---- | --------------------------- |
| `user`   | User | Usuario que recibió ingreso |

### Ejemplo Query

```typescript
// Ingresos del mes actual
const thisMonth = new Date();
thisMonth.setDate(1);

const monthlyIncome = await prisma.income.findMany({
  where: {
    userId,
    date: {
      gte: thisMonth,
      lt: new Date(),
    },
  },
});

// Total ingresado
const totalIncome = await prisma.income.aggregate({
  where: { userId },
  _sum: { amount: true },
});
```

---

## 🔔 Model: `Alert`

**Tabla:** `alerts`

Notificaciones y alertas para el usuario.

### Campos

| Campo       | Tipo     | Atributos                           | Descripción                  |
| ----------- | -------- | ----------------------------------- | ---------------------------- |
| `id`        | String   | @id, @default(cuid())               | ID único                     |
| `userId`    | String   | @map("user_id"), @index             | ID del destino               |
| `type`      | String   |                                     | "debt" \| "budget" \| "goal" |
| `title`     | String   |                                     | Título de la alerta          |
| `message`   | String   |                                     | Contenido de la alerta       |
| `isRead`    | Boolean  | @default(false), @map("is_read")    | Estado de lectura            |
| `createdAt` | DateTime | @default(now()), @map("created_at") | Fecha de creación            |

### Relaciones

| Relación | Tipo | Descripción                  |
| -------- | ---- | ---------------------------- |
| `user`   | User | Usuario que recibe la alerta |

### Tipos de Alertas

| Tipo       | Ejemplo                     | Cuándo crear                  |
| ---------- | --------------------------- | ----------------------------- |
| `"debt"`   | "Deuda X vence en 5 días"   | Cuando deuda próxima a vencer |
| `"budget"` | "Presupuesto Y 80% gastado" | Cuando gasto supera threshold |
| `"goal"`   | "¡Meta Z completada!"       | Cuando current >= target      |

### Ejemplo Query

```typescript
// Alertas no leídas
const unreadAlerts = await prisma.alert.findMany({
  where: { userId, isRead: false },
  orderBy: { createdAt: "desc" },
});

// Marcar como leída
await prisma.alert.update({
  where: { id: alertId },
  data: { isRead: true },
});
```

---

## 🔐 Models de Auth (Session, Account, Verification)

Estos modelos son **auto-gestionados por Better Auth**. No los modifiques manualmente.

### Session

- Sesiones activas del usuario
- Se limpian automáticamente

### Account

- Conexiones OAuth (GitHub, Google, etc)
- Tokens y credenciales

### Verification

- Tokens de verificación de email
- Links de recuperación de contraseña

---

## 📋 Resumen de Relaciones

```
User (centro)
├── Budgets
│   └── BudgetTransactions
├── Debts
│   └── DebtPayments
├── Goals
│   └── GoalContributions
├── Incomes
├── Alerts
├── Sessions (auth)
├── Accounts (oauth)
└── Verification (auth)
```

---

## ⚡ Queries Comunes

### Dashboard Principal

```typescript
const dashboardData = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    totalMoney: true,
    unassignedMoney: true,
    budgets: {
      include: {
        transactions: {
          where: { type: "expense" },
        },
      },
    },
    debts: {
      select: { remaining: true },
    },
    goals: true,
    incomes: {
      orderBy: { date: "desc" },
      take: 5,
    },
    alerts: {
      where: { isRead: false },
      orderBy: { createdAt: "desc" },
    },
  },
});
```

### Gastos del Mes

```typescript
const startMonth = new Date();
startMonth.setDate(1);

const monthlyExpenses = await prisma.budgetTransaction.findMany({
  where: {
    userId,
    type: "expense",
    date: {
      gte: startMonth,
      lt: new Date(),
    },
  },
  orderBy: { date: "desc" },
});
```

### Deudas Próximas a Vencer

```typescript
const upcomingDebts = await prisma.debt.findMany({
  where: {
    userId,
    dueDate: {
      gte: new Date(),
      lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // próximos 7 días
    },
  },
  orderBy: { dueDate: "asc" },
});
```

---

**Actualización:** Febrero 2026 | **Versión:** 1.0
