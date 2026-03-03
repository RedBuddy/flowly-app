"use client";
import { signOutAction } from "@/actions/auth/sign-out.action";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { useTransition } from "react";

export const SignOutButton = () => {
  const [isPending, startTransition] = useTransition();

  const SignOut = () => {
    startTransition(async () => {
      try {
        await signOutAction();
      } catch (error) {
        console.error("Error saliendo:", error);
      }
    });
  };

  return (
    <Button variant="outline" size="icon" onClick={SignOut} className="flex items-center gap-2 rounded-md" disabled={isPending}>
      <LogOut className="w-4 h-4" />
    </Button>
  );
};
