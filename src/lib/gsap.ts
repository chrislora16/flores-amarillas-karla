import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useLayoutEffect, useRef, type DependencyList, type RefObject } from 'react'

gsap.registerPlugin(ScrollTrigger)

// Curvas propias: todo el sitio respira con la misma cadencia.
gsap.registerEase('silk', (p) => 1 - Math.pow(1 - p, 3.2))
gsap.registerEase('bloom', (p) => 1 - Math.pow(1 - p, 4))

export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * gsap.context() con limpieza automática y scope opcional.
 * Todo lo que se cree dentro de `fn` se revierte al desmontar.
 */
export function useGsap(
  fn: (ctx: gsap.Context) => void,
  deps: DependencyList = [],
  scope?: RefObject<Element | null>,
) {
  const saved = useRef(fn)
  saved.current = fn

  useIsoLayoutEffect(() => {
    const ctx = gsap.context((self) => saved.current(self), scope?.current ?? undefined)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export { gsap, ScrollTrigger }
