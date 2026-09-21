import { useRef } from 'react'
import { Flower, type FlowerVariant } from '../Flower'
import { useExperience } from '../../lib/experience'
import { gsap, useGsap } from '../../lib/gsap'

export type BouquetFlower = {
  angle: number
  scale: number
  variant: FlowerVariant
}

/**
 * Ramo pequeño y liviano: entrada escalonada simple (sin el scroll-scrub
 * de 500vh del ramo de Darolyn). Lo usan Karla (3-5 flores) y Skarlen
 * (5-7 flores), cada una con su propio arreglo y colores.
 */
export function MiniBouquet({
  flowers,
  unit = 74,
  className = '',
}: {
  flowers: BouquetFlower[]
  unit?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { reduced } = useExperience()

  useGsap(
    () => {
      if (reduced) return
      gsap.fromTo(
        '[data-mini-flower]',
        { scale: 0.1, opacity: 0, rotate: -16 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.85,
          ease: 'back.out(1.6)',
          stagger: 0.12,
          transformOrigin: 'bottom center',
          scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
        },
      )
    },
    [reduced],
    ref,
  )

  return (
    <div ref={ref} className={`relative ${className}`} style={{ ['--u' as string]: `${unit}px` }}>
      <div className="relative h-[calc(var(--u)*3.2)] w-full">
        <div className="absolute bottom-0 left-1/2 h-0 w-0">
          {flowers.map((f, i) => (
            <span
              key={i}
              className="absolute bottom-0 left-0 block origin-bottom will-change-transform"
              style={{
                transform: `rotate(${f.angle}deg) translateY(calc(var(--u) * ${f.scale * -0.1}))`,
                zIndex: i,
              }}
            >
              <span data-mini-flower className="block -translate-x-1/2 origin-bottom">
                <Flower
                  size={100}
                  variant={f.variant}
                  stem
                  sway={!reduced}
                  swayDuration={5.5 + (i % 4)}
                  style={{ width: `calc(var(--u) * ${f.scale})` }}
                />
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
