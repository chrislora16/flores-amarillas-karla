import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

let lenisInstance: Lenis | null = null

export function scrollTo(target: string | number | HTMLElement) {
  if (lenisInstance) lenisInstance.scrollTo(target, { duration: 1.4 })
  else if (typeof target !== 'number' && typeof target !== 'string') {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}

export function lockScroll(locked: boolean) {
  document.body.classList.toggle('is-locked', locked)
  if (lenisInstance) locked ? lenisInstance.stop() : lenisInstance.start()
}

/**
 * Smooth scroll con Lenis, enganchado al ticker de GSAP para que
 * ScrollTrigger y el scroll compartan el mismo frame.
 * En táctil dejamos el scroll nativo: en iOS va más fino y gasta menos batería.
 */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.6,
    })
    lenisInstance = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisInstance = null
    }
  }, [enabled])
}
