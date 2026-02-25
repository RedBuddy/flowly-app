/**
 * Formatea una fecha al formato DD/MM/YYYY
 */
export function formatDateShort(date: Date | string): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formatea una fecha al formato largo: "15 de febrero de 2026"
 */
export function formatDateLong(date: Date | string): string {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return d.toLocaleDateString("es-ES", options);
}

/**
 * Formatea una fecha con hora: "15/02/2026 14:30"
 */
export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  const dateStr = formatDateShort(d);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${dateStr} ${hours}:${minutes}`;
}

/**
 * Formatea solo la hora: "14:30 h"
 */
export function formatTime(date: Date | string): string {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes} h`;
}

/**
 * Formatea el mes y año: "febrero 2026"
 */
export function formatMonthYear(date: Date | string): string {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
  };
  return d.toLocaleDateString("es-ES", options);
}

/**
 * Formatea solo el año: "2026"
 */
export function formatYear(date: Date | string): string {
  const d = new Date(date);
  return d.getFullYear().toString();
}

/**
 * Formatea una fecha de forma relativa: "Hoy", "Ayer", "Hace 2 días", etc.
 */
export function formatRelativeDate(date: Date | string): string {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const normalize = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const dNorm = normalize(d);
  const todayNorm = normalize(today);
  const yesterdayNorm = normalize(yesterday);

  if (dNorm.getTime() === todayNorm.getTime()) {
    return "Hoy";
  }

  if (dNorm.getTime() === yesterdayNorm.getTime()) {
    return "Ayer";
  }

  const diffTime = todayNorm.getTime() - dNorm.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0 && diffDays < 7) {
    return `Hace ${diffDays} ${diffDays === 1 ? "día" : "días"}`;
  }

  return formatDateShort(d);
}

/**
 * Obtiene el rango de fechas en formato legible: "15 - 28 de febrero de 2026"
 */
export function formatDateRange(startDate: Date | string, endDate: Date | string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = start.getMonth();
  const endMonth = end.getMonth();
  const year = end.getFullYear();

  const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} de ${monthNames[endMonth]} de ${year}`;
  }

  return `${startDay} de ${monthNames[startMonth]} - ${endDay} de ${monthNames[endMonth]} de ${year}`;
}

/**
 * Obtiene la diferencia en días entre dos fechas
 */
export function getDaysDifference(startDate: Date | string, endDate: Date | string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Obtiene el primer día del mes: "01/02/2026"
 */
export function getFirstDayOfMonth(date: Date | string = new Date()): string {
  const d = new Date(date);
  d.setDate(1);
  return formatDateShort(d);
}

/**
 * Obtiene el último día del mes: "28/02/2026"
 */
export function getLastDayOfMonth(date: Date | string = new Date()): string {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  return formatDateShort(d);
}
