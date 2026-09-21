import { useEffect, useRef, useState } from 'react'
import { Flower } from './components/Flower'
import { MaskReveal, Typewriter, WordsReveal } from './components/Reveal'
import { FloatingPetals } from './components/shared/FloatingPetals'
import { MessageCard } from './components/shared/MessageCard'
import { MiniBouquet, type BouquetFlower } from './components/shared/MiniBouquet'
import { ExperienceProvider, useExperience } from './lib/experience'
import { gsap, useGsap } from './lib/gsap'
import { makeShuffler } from './lib/random'

/* ------------------------------------------------------------------ *
 *  Paleta propia de Karla: crema, amarillo cálido, blanco y un toque
 *  de rosado pastel. No comparte tokens con Darolyn ni con Skarlen.
 * ------------------------------------------------------------------ */
const K = {
  cream: '#FFFBF4',
  warm: '#FFFFFF',
  yellow: '#FFD866',
  gold: '#F3B94A',
  pink: '#FBD9E3',
  pinkDeep: '#F2A9C2',
  ink: '#3A332B',
  inkSoft: '#8A7F72',
}

const MESSAGES = [
  'Que nunca te falten motivos para reírte.',
  'Una flor amarilla para una gran amiga.',
  'Gracias por los buenos momentos.',
  'Que tengas un bonito 21 de septiembre.',
  'Esta flor no se marchita, así que técnicamente te durará bastante 😂🌻',
]

const BOUQUET: BouquetFlower[] = [
  { angle: -22, scale: 0.85, variant: 'pale' },
  { angle: -8, scale: 1, variant: 'sun' },
  { angle: 8, scale: 1, variant: 'gold' },
  { angle: 22, scale: 0.85, variant: 'sun' },
]

function KarlaIntro() {
  const { openGift, reduced } = useExperience()
  const [step, setStep] = useState(0) // 0 nombre, 1 fecha, 2 frase, 3 botón
  const [leaving, setLeaving] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const advance = (next: number, delay: number) =>
    window.setTimeout(() => setStep(next), reduced ? Math.min(delay, 220) : delay)

  const handleOpen = () => {
    if (leaving) return
    setLeaving(true)
    if (reduced) {
      openGift()
      return
    }
    gsap
      .timeline()
      .to('[data-k-intro]', { y: -18, opacity: 0, duration: 0.5, ease: 'power2.in', stagger: 0.05 }, 0)
      .to(buttonRef.current, { scale: 0.9, opacity: 0, duration: 0.4, ease: 'power2.in' }, 0.05)
      .add(() => openGift(), 0.45)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6"
      style={{ height: '100dvh', background: K.cream }}
    >
      <FloatingPetals count={7} hues={[K.yellow, K.gold, K.pink]} />
      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <h1
          data-k-intro
          className="font-display text-[clamp(2.6rem,13vw,4rem)] font-semibold"
          style={{ color: K.ink }}
        >
          <Typewriter text="Karla 🌻" speed={150} startDelay={400} onDone={() => advance(1, 650)} />
        </h1>

        <div className="mt-6 flex min-h-[6.5rem] flex-col items-center gap-2">
          {step >= 1 && (
            <p
              data-k-intro
              className="font-serif text-[clamp(1.05rem,4.4vw,1.35rem)] font-light"
              style={{ color: K.inkSoft, opacity: step > 1 ? 0.6 : 1, transition: 'opacity .7s ease' }}
            >
              <Typewriter text="Hoy es 21 de septiembre…" speed={40} onDone={() => advance(2, 500)} />
            </p>
          )}
          {step >= 2 && (
            <p
              data-k-intro
              className="font-serif text-[clamp(1.05rem,4.4vw,1.35rem)] font-light"
              style={{ color: K.inkSoft }}
            >
              <Typewriter text="Así que aquí tienes tus flores amarillas." speed={38} onDone={() => advance(3, 350)} />
            </p>
          )}
        </div>

        {step >= 3 && (
          <button
            ref={buttonRef}
            type="button"
            onClick={handleOpen}
            data-k-intro
            className="anim-breathe mt-8 inline-flex min-h-[54px] items-center gap-2 rounded-full px-7 py-3.5 text-[0.92rem] font-medium shadow-lg transition-transform active:scale-[0.97]"
            style={{ background: `linear-gradient(180deg, ${K.yellow}, ${K.gold})`, color: '#4A3512' }}
          >
            <span className="text-lg leading-none">🌻</span>
            Recibir mis flores
          </button>
        )}
      </div>
    </div>
  )
}

function KarlaContent() {
  const ref = useRef<HTMLDivElement>(null)
  const flowerRef = useRef<HTMLButtonElement>(null)
  const { reduced } = useExperience()
  const [message, setMessage] = useState<string | null>(null)
  const nextMessage = useRef(makeShuffler(MESSAGES)).current

  useGsap(
    () => {
      if (reduced) return

      gsap.fromTo(
        '[data-k-hero-flower]',
        { y: 70, opacity: 0, scale: 0.75 },
        { y: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'back.out(1.4)', stagger: 0.12 },
      )
      gsap.fromTo(
        '[data-k-section]',
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-k-section]', start: 'top 85%', once: true },
        },
      )
      gsap.utils.toArray<HTMLElement>('[data-k-fade]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } },
        )
      })
    },
    [reduced],
    ref,
  )

  const handleTap = () => {
    setMessage(nextMessage())
    if (!reduced && flowerRef.current) {
      gsap.killTweensOf(flowerRef.current)
      gsap
        .timeline()
        .to(flowerRef.current, { scale: 0.92, rotate: -4, duration: 0.14 })
        .to(flowerRef.current, { scale: 1.08, rotate: 4, duration: 0.32, ease: 'back.out(3)' })
        .to(flowerRef.current, { scale: 1, rotate: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' })
    }
  }

  return (
    <div ref={ref} className="relative w-full" style={{ background: K.cream }}>
      {/* Hero: flores entrando desde abajo */}
      <section className="relative flex min-h-[86dvh] w-full flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-24">
        <FloatingPetals count={10} hues={[K.yellow, K.gold, K.pink]} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[38%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: `radial-gradient(circle, ${K.yellow}33 0%, ${K.pink}22 46%, transparent 72%)` }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          <MaskReveal>
            <p className="font-sans text-[0.72rem] font-medium uppercase tracking-[0.34em]" style={{ color: K.pinkDeep }}>
              21 de septiembre
            </p>
          </MaskReveal>
          <MaskReveal delay={0.08} start="top 90%">
            <h2
              className="mt-3 text-balance font-display text-[clamp(2rem,8vw,3.1rem)] font-semibold leading-tight"
              style={{ color: K.ink }}
            >
              Un pequeño detalle para ti
            </h2>
          </MaskReveal>
        </div>

        <div aria-hidden="true" className="relative z-10 mt-10 flex items-end justify-center gap-1">
          {[
            { size: 96, variant: 'gold' as const, rotate: -8 },
            { size: 128, variant: 'sun' as const, rotate: 0 },
            { size: 100, variant: 'pale' as const, rotate: 8 },
          ].map((f, i) => (
            <span key={i} data-k-hero-flower className="block" style={{ width: f.size }}>
              <Flower size={f.size} variant={f.variant} stem rotate={f.rotate} sway swayDuration={6.5 + i} />
            </span>
          ))}
        </div>
      </section>

      {/* Por qué */}
      <section data-k-section className="relative w-full px-6 py-[9vh]">
        <div className="mx-auto max-w-md rounded-[28px] px-7 py-9 text-center" style={{ background: K.warm, boxShadow: '0 24px 50px -30px rgba(58,51,43,0.18)' }}>
          <WordsReveal
            as="p"
            text="Porque las flores amarillas no tienen que ser solamente para parejas. También pueden ser para esas personas que hacen los días más entretenidos, las clases más llevaderas y los buenos momentos todavía mejores."
            className="font-serif text-[clamp(1.05rem,4.3vw,1.25rem)] font-light leading-[1.7]"
            wordClassName=""
            stagger={0.03}
          />
          <p className="mt-6 font-serif text-[0.7rem]" style={{ color: K.pinkDeep }}>
            🌻
          </p>
        </div>
      </section>

      {/* Frase grande */}
      <section data-k-fade className="relative w-full px-6 py-[8vh] text-center">
        <MaskReveal>
          <p
            className="text-balance mx-auto max-w-md font-display text-[clamp(1.7rem,7.4vw,2.6rem)] font-semibold leading-[1.15]"
            style={{ color: K.ink }}
          >
            Feliz día de las flores amarillas, Karla. 🌻
          </p>
        </MaskReveal>
      </section>

      {/* Flor interactiva */}
      <section data-k-fade className="relative w-full px-6 py-[9vh]">
        <div className="mx-auto flex max-w-sm flex-col items-center text-center">
          <h3 className="font-display text-[clamp(1.3rem,5.4vw,1.7rem)] font-medium" style={{ color: K.ink }}>
            Toca la flor
          </h3>

          <div className="relative mt-8 flex h-[76px] w-full items-end justify-center">
            <MessageCard message={message} accent={K.pinkDeep} />
          </div>

          <button
            ref={flowerRef}
            type="button"
            onClick={handleTap}
            data-cursor="grow"
            aria-label="Tocar la flor"
            className="relative mt-4 grid place-items-center rounded-full will-change-transform"
            style={{ width: 'min(48vw, 190px)' }}
          >
            <Flower size={190} variant="sun" petals={9} />
          </button>
        </div>
      </section>

      {/* Ramo final */}
      <section data-k-fade className="relative w-full px-6 pb-[12vh] pt-[6vh] text-center">
        <MiniBouquet flowers={BOUQUET} unit={72} className="mx-auto max-w-xs" />
        <p className="mt-4 font-display text-[clamp(1.4rem,5.6vw,1.9rem)] font-semibold" style={{ color: K.ink }}>
          Para Karla 🌻
        </p>
        <p className="mt-2 font-serif text-[1rem] font-light italic" style={{ color: K.inkSoft }}>
          De parte de Cristopher.
        </p>
      </section>
    </div>
  )
}

function KarlaExperience() {
  const { opened } = useExperience()

  useEffect(() => {
    document.title = 'Flores amarillas para Karla 🌻'
  }, [])

  return (
    <>
      {opened && <KarlaContent />}
      {!opened && <KarlaIntro />}
    </>
  )
}

export default function App() {
  return (
    <ExperienceProvider>
      <KarlaExperience />
    </ExperienceProvider>
  )
}
