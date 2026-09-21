import { useMemo } from 'react'
import { useExperience } from '../../lib/experience'
import { rand } from '../../lib/random'

type Petal = {
  left: number
  top: number
  size: number
  hue: string
  duration: number
  delay: number
  rotate: number
}

const HUES = ['#FFD84D', '#F5B82E', '#FFE9A8']

/**
 * Decoración ambiental ligera: unos pocos pétalos flotando en CSS puro,
 * sin canvas ni rAF. Pensada para páginas cortas (Karla / Skarlen) donde
 * no hace falta el sistema de partículas completo de Darolyn.
 */
export function FloatingPetals({
  count = 9,
  hues = HUES,
  className = '',
}: {
  count?: number
  hues?: string[]
  className?: string
}) {
  const { reduced, tier } = useExperience()
  const amount = tier === 'low' ? Math.max(4, Math.round(count * 0.6)) : count

  const petals = useMemo<Petal[]>(() => {
    if (reduced) return []
    return Array.from({ length: amount }, () => ({
      left: rand(2, 96),
      top: rand(-6, 100),
      size: rand(8, 15),
      hue: hues[Math.floor(rand(0, hues.length))],
      duration: rand(6, 11),
      delay: rand(-6, 2),
      rotate: rand(-30, 30),
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, reduced])

  if (reduced || petals.length === 0) return null

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {petals.map((p, i) => (
        <span
          key={i}
          className="anim-float absolute block"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size * 0.72,
            borderRadius: '60% 0 60% 0',
            background: `linear-gradient(160deg, ${p.hue}, ${p.hue}cc)`,
            opacity: 0.55,
            transform: `rotate(${p.rotate}deg)`,
            ['--float-dur' as string]: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
