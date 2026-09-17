import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind classes without style conflicts, following MedusaJS storefront architecture.
 */
export function clx(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export const cn = clx
