'use server'

import { auth } from "@/lib/auth";
import { RegisterFormData } from "@/schemas/auth";

type SignUpResponse =
  | { success: true }
  | { success: false; error: string };

export const signUpAction = async (data: RegisterFormData): Promise<SignUpResponse> => {
  try {
    await auth.api.signUpEmail({
      body: data
    })
    return { success: true };
  } catch (error) {
    console.error('Sign up error:', error);

    // Manejar diferentes tipos de errores
    if (error instanceof Error) {
      // Errores de validación o email duplicado
      if (error.message.includes('already exists')) {
        return { success: false, error: 'El correo ya está registrado' };
      }
      if (error.message.includes('invalid')) {
        return { success: false, error: 'Datos inválidos' };
      }

      return { success: false, error: error.message };
    }

    return { success: false, error: 'Error al crear la cuenta. Intenta de nuevo.' };
  }
}