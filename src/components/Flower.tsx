import { memo, useId, type CSSProperties, type MouseEvent } from 'react'

export type FlowerVariant = 'sun' | 'gold' | 'pale' | 'ghost'

const PALETTE: Record<FlowerVariant, [string, string, string]> = {
  sun: ['#FFE38A', '#FFCA28', '#F2A90E'],
  gold: ['#FFCF52', '#F5A90F', '#C4780A'],
  pale: ['#FFFBEA', '#FFEFB8', '#FFD84D'],
  ghost: ['#FFFDF8', '#FFF3CE', '#FFE6A0'],
}

export type FlowerProps = {
  size?: number
  variant?: FlowerVariant
  petals?: number
  /** Dibuja tallo y hojas debajo de la flor. */
  stem?: boolean
  /** Anima el florecer al montarse. */
  bloom?: boolean
  /** Retardo (s) del florecer. */
  delay?: number
  /** Balanceo continuo, como si hubiera viento. */
  sway?: boolean
  swayDuration?: number
  blur?: number
  opacity?: number
  rotate?: number
  className?: string
  style?: CSSProperties
  title?: string
  onClick?: (e: MouseEvent<HTMLElement>) => void
}

/**
 * Girasol amarillo vectorial: muchos pétalos angostos y un centro grande y
 * oscuro con textura de semillas, para que se lea claramente como girasol
 * (no como una margarita genérica). Todas las animaciones son CSS sobre
 * transform/opacity, así que se pueden pintar muchos sin bajar de 60 fps.
 */
function FlowerBase({
  size = 120,
  variant = 'sun',
  petals = 13,
  stem = false,
  bloom = false,
  delay = 0,
  sway = false,
  swayDuration = 6,
  blur = 0,
  opacity = 1,
  rotate = 0,
  className = '',
  style,
  title,
}: FlowerProps) {
  const uid = useId().replace(/:/g, '')
  const [c0, c1, c2] = PALETTE[variant]

  const H = stem ? 250 : 120
  const stemLength = 150
  const cx = 60
  const cy = 58

  // Pétalos angostos y puntiagudos, típicos de girasol (no la forma ancha
  // de una margarita).
  const petalNodes = Array.from({ length: petals }, (_, i) => (
    <path
      key={i}
      d="M60 60C52 52 49 30 60 4C71 30 68 52 60 60Z"
      fill={`url(#p-${uid})`}
      transform={`rotate(${(360 / petals) * i} ${cx} ${cy})`}
    />
  ))

  const innerNodes = Array.from({ length: petals }, (_, i) => (
    <path
      key={i}
      d="M60 55C54 48 52 36 60 22C68 36 66 48 60 55Z"
      fill={`url(#i-${uid})`}
      opacity={0.7}
      transform={`rotate(${(360 / petals) * i + 360 / petals / 2} ${cx} ${cy})`}
    />
  ))

  // Textura de semillas: dos anillos concéntricos de puntos, como el
  // capítulo central de un girasol de verdad.
  const seedRing = (count: number, r: number, offset: number) =>
    Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + offset
      return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r }
    })
  const seeds = [...seedRing(12, 16, 0), ...seedRing(7, 9.5, Math.PI / 7), ...seedRing(1, 0, 0)]

  return (
    <span
      className={`inline-block will-change-transform ${sway ? 'anim-sway' : ''} ${className}`}
      style={{
        width: size,
        opacity,
        filter: blur ? `blur(${blur}px)` : undefined,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        ['--sway-dur' as string]: `${swayDuration}s`,
        ['--sway-from' as string]: `${-2 - (size % 3)}deg`,
        ['--sway-to' as string]: `${2 + (size % 3)}deg`,
        ...style,
      }}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      aria-label={title}
    >
      <svg
        viewBox={`0 0 120 ${H}`}
        style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}
      >
        <defs>
          <radialGradient id={`p-${uid}`} cx="50%" cy="88%" r="80%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="55%" stopColor={c0} />
            <stop offset="100%" stopColor={c2} />
          </radialGradient>
          <radialGradient id={`i-${uid}`} cx="50%" cy="92%" r="75%">
            <stop offset="0%" stopColor={c2} />
            <stop offset="100%" stopColor={c0} />
          </radialGradient>
          <radialGradient id={`c-${uid}`} cx="36%" cy="30%" r="78%">
            <stop offset="0%" stopColor="#D9932A" />
            <stop offset="32%" stopColor="#9C6216" />
            <stop offset="70%" stopColor="#5B3810" />
            <stop offset="100%" stopColor="#2E1E08" />
          </radialGradient>
          <linearGradient id={`s-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7FA86B" />
            <stop offset="100%" stopColor="#4F7B48" />
          </linearGradient>
        </defs>

        {stem && (
          <g>
            <path
              d={`M60 100 C 54 ${100 + stemLength * 0.35}, 66 ${100 + stemLength * 0.7}, 60 ${100 + stemLength}`}
              stroke={`url(#s-${uid})`}
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              className={bloom ? 'flower-stem' : undefined}
              style={
                bloom
                  ? ({ ['--stem-len' as string]: stemLength * 1.15, animationDelay: `${delay}s` } as CSSProperties)
                  : undefined
              }
            />
            <path
              d="M59 175 C 34 168, 22 150, 24 134 C 44 137, 56 152, 59 175Z"
              fill={`url(#s-${uid})`}
              opacity="0.9"
              className={bloom ? 'flower-leaf flower-leaf--l' : undefined}
              style={bloom ? { animationDelay: `${delay + 0.45}s` } : undefined}
            />
            <path
              d="M61 198 C 86 191, 98 173, 96 157 C 76 160, 64 175, 61 198Z"
              fill={`url(#s-${uid})`}
              opacity="0.78"
              className={bloom ? 'flower-leaf flower-leaf--r' : undefined}
              style={bloom ? { animationDelay: `${delay + 0.62}s` } : undefined}
            />
          </g>
        )}

        <g
          className={bloom ? 'flower-head' : undefined}
          style={bloom ? { animationDelay: `${delay + (stem ? 0.3 : 0)}s` } : undefined}
        >
          {petalNodes}
          {innerNodes}
          <circle cx={cx} cy={cy} r="22" fill={`url(#c-${uid})`} />
          <circle cx={cx} cy={cy} r="22" fill="none" stroke="#201405" strokeOpacity="0.4" strokeWidth="1.2" />
          <g fill="#201405" opacity="0.5">
            {seeds.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={i % 3 === 0 ? 1.15 : 0.9} />
            ))}
          </g>
        </g>
      </svg>
    </span>
  )
}

export const Flower = memo(FlowerBase)
