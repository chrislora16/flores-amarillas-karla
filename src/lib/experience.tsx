import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { detectTier, isTouch, PARTICLE_BUDGET, prefersReducedMotion, type Tier } from './env'
import { lockScroll } from './useSmoothScroll'

type ExperienceValue = {
  /** true en cuanto Darolyn abre el regalo: a partir de aquí vive el resto de la página. */
  opened: boolean
  openGift: () => void
  tier: Tier
  reduced: boolean
  touch: boolean
  budget: { petals: number; sparks: number }
  /** El easter egg ya fue encontrado. */
  secretFound: boolean
  findSecret: () => void
}

const ExperienceContext = createContext<ExperienceValue | null>(null)

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState(false)
  const [secretFound, setSecretFound] = useState(false)
  const [reduced, setReduced] = useState(prefersReducedMotion)
  const [tier] = useState<Tier>(detectTier)
  const [touch] = useState(isTouch)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // La intro se ve sin scroll; el resto de la historia se desbloquea al abrir.
  useEffect(() => {
    lockScroll(!opened)
    return () => lockScroll(false)
  }, [opened])

  const openGift = useCallback(() => setOpened(true), [])
  const findSecret = useCallback(() => setSecretFound(true), [])

  const value = useMemo<ExperienceValue>(
    () => ({
      opened,
      openGift,
      tier,
      reduced,
      touch,
      budget: reduced ? { petals: 0, sparks: 0 } : PARTICLE_BUDGET[tier],
      secretFound,
      findSecret,
    }),
    [opened, openGift, tier, reduced, touch, secretFound, findSecret],
  )

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>
}

export function useExperience() {
  const ctx = useContext(ExperienceContext)
  if (!ctx) throw new Error('useExperience debe usarse dentro de <ExperienceProvider>')
  return ctx
}
