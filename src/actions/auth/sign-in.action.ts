'use server'

import { auth } from "@/lib/auth";
import { LoginFormData } from "@/schemas/auth";
import { ActionResponse } from "@/types/action-response.type";
import { redirect } from "next/navigation";


export const signInAction = async (data: LoginFormData): Promise<ActionResponse> => {

  try {
    await auth.api.signInEmail({
      body: data
    })

    return { ok: true };
  } catch (error) {
    console.log('Error signing in:', error);

    // Manejar diferentes tipos de errores
    if (error instanceof Error) {

      if (error.message.includes('Invalid credentials')) {
        return { ok: false, error: 'Credenciales inválidas' };
      }

      return { ok: false, error: error.message };
    }

    return { ok: false, error: 'Error al iniciar sesión. Intenta de nuevo.' };
  }
}
