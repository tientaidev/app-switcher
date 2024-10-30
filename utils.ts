import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
