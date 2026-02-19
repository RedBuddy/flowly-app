/*
  Warnings:

  - You are about to alter the column `amount` on the `budget_transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `DoublePrecision`.
  - You are about to alter the column `total_assigned` on the `budgets` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `DoublePrecision`.
  - You are about to alter the column `spent` on the `budgets` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `DoublePrecision`.
  - You are about to alter the column `amount` on the `debt_payments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `DoublePrecision`.
  - You are about to alter the column `total_debt` on the `debts` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `DoublePrecision`.
  - You are about to alter the column `remaining` on the `debts` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `DoublePrecision`.
  - You are about to alter the column `minimum_payment` on the `debts` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `DoublePrecision`.
  - You are about to alter the column `amount` on the `goal_contributions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `DoublePrecision`.
  - You are about to alter the column `target` on the `goals` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `DoublePrecision`.
  - You are about to alter the column `current` on the `goals` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `DoublePrecision`.
  - You are about to alter the column `amount` on the `incomes` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `DoublePrecision`.
  - You are about to alter the column `total_money` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `DoublePrecision`.
  - You are about to alter the column `unassigned_money` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "budget_transactions" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "budgets" ALTER COLUMN "total_assigned" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "spent" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "debt_payments" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "debts" ALTER COLUMN "total_debt" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "remaining" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "minimum_payment" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "goal_contributions" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "goals" ALTER COLUMN "target" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "current" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "incomes" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "total_money" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "unassigned_money" SET DATA TYPE DOUBLE PRECISION;
