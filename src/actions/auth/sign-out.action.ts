'use server';

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type SignOutResponse =
  | { success: true }
  | { success: false; error: string };

export const signOutAction = async (): Promise<SignOutResponse> => {
  try {
    await auth.api.signOut({
      headers: await headers()
    })
    redirect('/')
  } catch (error) {
    console.error('Sign out error:', error);

    if (error instanceof Error) {
      // Sesión no encontrada (usuario ya deslogueado)
      if (error.message.includes('not found') || error.message.includes('invalid')) {
        console.warn('Session already cleared');
        redirect('/'); // Redirige igual
      }

      // Error de conexión
      if (error.message.includes('network') || error.message.includes('fetch')) {
        return { success: false, error: 'Error de conexión. Intenta de nuevo.' };
      }

      // Error genérico
      return { success: false, error: 'Error al cerrar sesión' };
    }

    return { success: false, error: 'Error inesperado' };
  }
}
