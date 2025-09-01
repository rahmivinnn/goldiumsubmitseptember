import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateAddress(address: string, startLength = 6, endLength = 4): string {
  if (!address) return ""
  if (address.length <= startLength + endLength) return address
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

export function formatBalance(balance: number | undefined, decimals = 2): string {
  if (balance === undefined) return "0"
  return balance.toFixed(decimals)
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

import { generateDeterministicStars, generateDeterministicParticles } from "@/utils/deterministic"

/**
 * Generate deterministic stars to avoid hydration mismatch
 * @deprecated Use generateDeterministicStars directly for better control
 */
export function generateStars(count: number) {
  return generateDeterministicStars(count, "default-stars")
}

/**
 * Generate deterministic particles to avoid hydration mismatch
 * @deprecated Use generateDeterministicParticles directly for better control
 */
export function generateParticles(count: number) {
  return generateDeterministicParticles(count, "default-particles")
}
