"use client";
import { useState } from "react";
import { HeroBalanceCard } from "../HeroBalanceCard";
import { RegisterIncomeModal } from "../modal/register-income-modal";
import { IncomeModals } from "./income-modals";
import { AlertsModals } from "./alerts-modals";

export const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const

  return (
    <>
      {/* <section className="mb-8"> */}
      <HeroBalanceCard onRegisterIncome={() => setIsModalOpen(true)} />
      {/* </section> */}

      <RegisterIncomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <IncomeModals />
      <AlertsModals />
    </>
  );
};
