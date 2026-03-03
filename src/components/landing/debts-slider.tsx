"use client";
import { CreditCard } from "lucide-react";
import { DebtCard } from "../../app/(site)/debts/_components/debt-card";
import { SectionHeader } from "../SectionHeader";
import { useLatestDebts } from "@/hooks/useDebt";
import { SkeletonCard } from "../skeletons/skeleton-card";
import { CreateDebtModal } from "@/app/(site)/debts/_components/modal/create-debt-modal";
import { PayDebtModal } from "@/app/(site)/debts/_components/modal/pay-debt-modal";
import { DebtHistoryModal } from "@/app/(site)/debts/_components/modal/debt-history-modal";

export const DebtSlider = () => {
  const { data, isLoading } = useLatestDebts(4);

  const debtList = data?.ok ? data.result : [];

  return (
    <>
      <SectionHeader title="Deudas" subtitle="Controla tus obligaciones" icon={CreditCard} action={{ label: "Ver todas", path: "/debts" }} />
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-65">
          <SkeletonCard count={4} />
        </div>
      ) : !debtList || debtList.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay deudas para mostrar</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {debtList.map((debt) => (
            <DebtCard key={debt.id} {...debt} />
          ))}
        </div>
      )}

      <CreateDebtModal />
      <PayDebtModal />
      <DebtHistoryModal />
    </>
  );
};
