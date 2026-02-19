'use server';

import { auth } from "@/lib/auth";
import { ActionResponse } from "@/types/action-response.type";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export const signOutAction = async (): Promise<ActionResponse> => {
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
        return { ok: false, error: 'Error de conexión. Intenta de nuevo.' };
      }

      // Error genérico
      return { ok: false, error: 'Error al cerrar sesión' };
    }

    return { ok: false, error: 'Error inesperado' };
  }
}
