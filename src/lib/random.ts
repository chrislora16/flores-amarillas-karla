export const rand = (min: number, max: number) => min + Math.random() * (max - min)
export const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1))
export const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]

/** Devuelve elementos al azar sin repetir el último (para las frases de la flor). */
export function makeShuffler<T>(items: readonly T[]) {
  let pool: T[] = []
  let last: T | undefined
  return (): T => {
    if (pool.length === 0) {
      pool = [...items].sort(() => Math.random() - 0.5)
      if (pool.length > 1 && pool[0] === last) pool.push(pool.shift() as T)
    }
    last = pool.shift() as T
    return last
  }
}
