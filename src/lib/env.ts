/** Detección ligera de capacidades: nos dice cuánto "lujo" puede permitirse el dispositivo. */

export type Tier = 'low' | 'mid' | 'high'

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isTouch(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: none), (pointer: coarse)').matches
}

export function detectTier(): Tier {
  if (typeof window === 'undefined') return 'mid'
  const nav = navigator as Navigator & { deviceMemory?: number }
  const cores = nav.hardwareConcurrency ?? 4
  const memory = nav.deviceMemory ?? 4
  const narrow = Math.min(window.innerWidth, window.innerHeight) < 500

  if (memory <= 2 || cores <= 2) return 'low'
  if (narrow && (cores <= 4 || memory <= 4)) return 'mid'
  if (cores >= 8 && memory >= 8 && !narrow) return 'high'
  return 'mid'
}

/** Cuántas partículas/pétalos puede dibujar este dispositivo sin despeinarse. */
export const PARTICLE_BUDGET: Record<Tier, { petals: number; sparks: number }> = {
  low: { petals: 10, sparks: 12 },
  mid: { petals: 18, sparks: 22 },
  high: { petals: 30, sparks: 38 },
}
