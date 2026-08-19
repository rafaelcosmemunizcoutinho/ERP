import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn (...entradas: ClassValue[]): string {
  return twMerge(clsx(entradas))
}
