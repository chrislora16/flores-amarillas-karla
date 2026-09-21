import { memo, useId, type CSSProperties, type MouseEvent } from 'react'

export type FlowerVariant = 'sun' | 'gold' | 'pale' | 'ghost'

const PALETTE: Record<FlowerVariant, [string, string, string]> = {
  sun: ['#FFF0AE', '#FFD84D', '#F5B82E'],
  gold: ['#FFD84D', '#F5B82E', '#DD9A17'],
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
 * Flor amarilla vectorial. Todas las animaciones son CSS sobre transform/opacity,
 * así que se pueden pintar muchas sin que baje de 60 fps.
 */
function FlowerBase({
  size = 120,
  variant = 'sun',
  petals = 8,
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

  const petalNodes = Array.from({ length: petals }, (_, i) => (
    <path
      key={i}
      d="M60 58C47 47 42 26 60 5C78 26 73 47 60 58Z"
      fill={`url(#p-${uid})`}
      transform={`rotate(${(360 / petals) * i} 60 58)`}
    />
  ))

  const innerNodes = Array.from({ length: petals }, (_, i) => (
    <path
      key={i}
      d="M60 52C52 44 49 32 60 20C71 32 68 44 60 52Z"
      fill={`url(#i-${uid})`}
      opacity={0.75}
      transform={`rotate(${(360 / petals) * i + 360 / petals / 2} 60 58)`}
    />
  ))

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
          <radialGradient id={`p-${uid}`} cx="50%" cy="85%" r="75%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="55%" stopColor={c0} />
            <stop offset="100%" stopColor={c2} />
          </radialGradient>
          <radialGradient id={`i-${uid}`} cx="50%" cy="90%" r="70%">
            <stop offset="0%" stopColor={c2} />
            <stop offset="100%" stopColor={c0} />
          </radialGradient>
          <radialGradient id={`c-${uid}`} cx="38%" cy="32%" r="80%">
            <stop offset="0%" stopColor="#FFDF8C" />
            <stop offset="45%" stopColor="#E7A31C" />
            <stop offset="100%" stopColor="#B4720B" />
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
          <circle cx="60" cy="58" r="17" fill={`url(#c-${uid})`} />
          <circle cx="60" cy="58" r="17" fill="none" stroke="#FFF3C9" strokeOpacity="0.35" strokeWidth="1.5" />
          <g fill="#8A5A08" opacity="0.45">
            <circle cx="55" cy="54" r="1.6" />
            <circle cx="64" cy="55" r="1.4" />
            <circle cx="59" cy="62" r="1.5" />
            <circle cx="66" cy="62" r="1.2" />
            <circle cx="53" cy="61" r="1.1" />
          </g>
        </g>
      </svg>
    </span>
  )
}

export const Flower = memo(FlowerBase)
