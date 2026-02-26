// Budget enums
export const BUDGET_TYPES = {
  RECURRENT: "recurrent",
  OCCASIONAL: "occasional",
} as const;

export type BudgetType = typeof BUDGET_TYPES[keyof typeof BUDGET_TYPES];

export const BUDGET_TYPE_LABELS = {
  [BUDGET_TYPES.RECURRENT]: "Recurrente",
  [BUDGET_TYPES.OCCASIONAL]: "Ocasional",
} as const;

// Debt enums
export const DEBT_PRIORITIES = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const;

export type DebtPriority = typeof DEBT_PRIORITIES[keyof typeof DEBT_PRIORITIES];

export const DEBT_PRIORITY_LABELS = {
  [DEBT_PRIORITIES.HIGH]: "Alta",
  [DEBT_PRIORITIES.MEDIUM]: "Media",
  [DEBT_PRIORITIES.LOW]: "Baja",
} as const;

// Alert enums
export const ALERT_TYPES = {
  DEBT: "debt",
  BUDGET: "budget",
  GOAL: "goal",
} as const;

export type AlertType = typeof ALERT_TYPES[keyof typeof ALERT_TYPES];

export const ALERT_TYPE_LABELS = {
  [ALERT_TYPES.DEBT]: "Deuda",
  [ALERT_TYPES.BUDGET]: "Presupuesto",
  [ALERT_TYPES.GOAL]: "Meta",
} as const;

// Transaction enums
export const TRANSACTION_TYPES = {
  EXPENSE: "expense",
  ASSIGNMENT: "assignment",
} as const;

export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];

export const TRANSACTION_TYPE_LABELS = {
  [TRANSACTION_TYPES.EXPENSE]: "Gasto",
  [TRANSACTION_TYPES.ASSIGNMENT]: "Asignación",
} as const;
