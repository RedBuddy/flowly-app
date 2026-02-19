"use client";
import { useState } from "react";
import { HeroBalanceCard } from "../HeroBalanceCard";
import { RegisterIncomeModal } from "../modal/register-income-modal";

export const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* <section className="mb-8"> */}
      <HeroBalanceCard totalMoney={127500} unassignedMoney={23400} assignedMoney={104100} onRegisterIncome={() => setIsModalOpen(true)} />
      {/* </section> */}

      <RegisterIncomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
