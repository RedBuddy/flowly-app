'use server'

import { auth } from "@/lib/auth";
import { LoginFormData } from "@/schemas/auth";
import { redirect } from "next/navigation";

type SignUpResponse =
  | { success: true }
  | { success: false; error: string };

export const signInAction = async (data: LoginFormData): Promise<SignUpResponse> => {

  try {
    await auth.api.signInEmail({
      body: data
    })

    return { success: true };
  } catch (error) {
    console.log('Error signing in:', error);

    // Manejar diferentes tipos de errores
    if (error instanceof Error) {

      if (error.message.includes('Invalid credentials')) {
        return { success: false, error: 'Credenciales inválidas' };
      }

      return { success: false, error: error.message };
    }

    return { success: false, error: 'Error al iniciar sesión. Intenta de nuevo.' };
  }
}
