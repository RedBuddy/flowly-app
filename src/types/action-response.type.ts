
//Respuesta genérica para acciones, con un tipo de dato opcional
export type ActionResponse<T = void> =
  | { ok: true; result?: T }
  | { ok: false; error: string };



