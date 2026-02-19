'use server'

import { auth } from "@/lib/auth";
import { RegisterFormData } from "@/schemas/auth";
import { ActionResponse } from "@/types/action-response.type";



export const signUpAction = async (data: RegisterFormData): Promise<ActionResponse> => {
  try {
    await auth.api.signUpEmail({
      body: data
    })
    return { ok: true };

  } catch (error) {
    console.error('Sign up error:', error);

    // Manejar diferentes tipos de errores
    if (error instanceof Error) {
      // Errores de validación o email duplicado
      if (error.message.includes('already exists')) {
        return { ok: false, error: 'El correo ya está registrado' };
      }
      if (error.message.includes('invalid')) {
        return { ok: false, error: 'Datos inválidos' };
      }

      return { ok: false, error: error.message };
    }

    return { ok: false, error: 'Error al crear la cuenta. Intenta de nuevo.' };
  }
}