"use client";
import { useState } from "react";
import { HeroBalanceCard } from "../HeroBalanceCard";
import { RegisterIncomeModal } from "../RegisterIncomeModal";

export const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRegisterIncome = (amount: number, description: string) => {
    console.log("Income registered:", { amount, description });
    // In a real app, this would update the state/database
  };

  return (
    <>
      {/* <section className="mb-8"> */}
      <HeroBalanceCard totalMoney={127500} unassignedMoney={23400} assignedMoney={104100} onRegisterIncome={() => setIsModalOpen(true)} />
      {/* </section> */}

      <RegisterIncomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleRegisterIncome} />
    </>
  );
};
