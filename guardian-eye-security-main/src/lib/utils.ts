// Centralisation du logging d'erreur
export function logError(...args: unknown[]) {
  if (import.meta.env.MODE === "development") {
    // eslint-disable-next-line no-console
    console.error(...args);
  }
}
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
