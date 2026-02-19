import { z } from "zod";

export const idSchema = z.string().min(1);
export const dateSchema = z.coerce.date();

// Money schema - para formularios con validaciones
export const moneySchema = z
  .number({ message: "Debe ser un número" })
  .positive("Debe ser mayor a 0")
  .max(999999999.99, "Monto muy grande");
