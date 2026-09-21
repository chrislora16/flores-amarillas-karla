import { useEffect, useMemo, useRef, useState, type ElementType, type ReactNode } from 'react'
import { gsap, useGsap } from '../lib/gsap'
import { useExperience } from '../lib/experience'

/* ------------------------------------------------------------------ *
 *  Revelado palabra por palabra (con máscara) al entrar en pantalla
 * ------------------------------------------------------------------ */
type WordsRevealProps = {
  text: string
  as?: ElementType
  className?: string
  wordClassName?: string
  stagger?: number
  delay?: number
  start?: string
  duration?: number
}

export function WordsReveal({
  text,
  as: Tag = 'p',
  className = '',
  wordClassName = '',
  stagger = 0.055,
  delay = 0,
  start = 'top 82%',
  duration = 0.9,
}: WordsRevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const { reduced } = useExperience()

  useGsap(
    () => {
      if (reduced || !ref.current) return
      const words = ref.current.querySelectorAll<HTMLElement>('[data-word] > span')
      gsap.set(words, { yPercent: 115, opacity: 0 })
      gsap.to(words, {
        yPercent: 0,
        opacity: 1,
        duration,
        delay,
        ease: 'silk',
        stagger,
        scrollTrigger: { trigger: ref.current, start, once: true },
      })
    },
    [reduced, text],
    ref,
  )

  return (
    <Tag ref={ref as never} className={className}>
      {text.split(' ').map((word, i) => (
        <span
          key={`${word}-${i}`}
          data-word
          className={`inline-block overflow-hidden align-bottom ${wordClassName}`}
          style={{ paddingBottom: '0.14em', marginBottom: '-0.14em' }}
        >
          <span className="inline-block will-change-transform">{word}</span>
          {i < text.split(' ').length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </Tag>
  )
}

/* ------------------------------------------------------------------ *
 *  Revelado de una línea completa tras una máscara
 * ------------------------------------------------------------------ */
export function MaskReveal({
  children,
  className = '',
  delay = 0,
  start = 'top 85%',
  y = 110,
}: {
  children: ReactNode
  className?: string
  delay?: number
  start?: string
  y?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { reduced } = useExperience()

  useGsap(
    () => {
      if (reduced || !ref.current) return
      const inner = ref.current.firstElementChild
      gsap.fromTo(
        inner,
        { yPercent: y, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.15,
          delay,
          ease: 'silk',
          scrollTrigger: { trigger: ref.current, start, once: true },
        },
      )
    },
    [reduced],
    ref,
  )

  return (
    <div ref={ref} className={`mask-line ${className}`}>
      <div className="will-change-transform">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 *  Aparición sencilla (fade + escala) para tarjetas y grupos
 * ------------------------------------------------------------------ */
export function FadeUp({
  children,
  className = '',
  delay = 0,
  start = 'top 85%',
  from = { y: 46, opacity: 0, scale: 0.97 },
}: {
  children: ReactNode
  className?: string
  delay?: number
  start?: string
  from?: gsap.TweenVars
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { reduced } = useExperience()

  useGsap(
    () => {
      if (reduced || !ref.current) return
      gsap.fromTo(ref.current, from, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.1,
        delay,
        ease: 'silk',
        scrollTrigger: { trigger: ref.current, start, once: true },
      })
    },
    [reduced],
    ref,
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 *  Máquina de escribir
 * ------------------------------------------------------------------ */
export function Typewriter({
  text,
  speed = 62,
  startDelay = 0,
  className = '',
  caret = true,
  onDone,
}: {
  text: string
  speed?: number
  startDelay?: number
  className?: string
  caret?: boolean
  onDone?: () => void
}) {
  // Array.from (no text.length/text.slice) respeta los pares suplentes:
  // un emoji como 🌼 ocupa 2 unidades UTF-16, y cortar a la mitad se ve
  // como un glifo roto. Con esto se revela un carácter Unicode completo
  // a la vez, aunque sea un emoji.
  const chars = useMemo(() => Array.from(text), [text])
  const [count, setCount] = useState(0)
  const { reduced } = useExperience()
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    if (reduced) {
      setCount(chars.length)
      const t = window.setTimeout(() => doneRef.current?.(), 260 + startDelay)
      return () => window.clearTimeout(t)
    }

    let frame = 0
    let start = 0
    let finished = false

    const tick = (now: number) => {
      if (!start) start = now
      const elapsed = now - start - startDelay
      if (elapsed > 0) {
        const n = Math.min(chars.length, Math.floor(elapsed / speed))
        setCount(n)
        if (n >= chars.length && !finished) {
          finished = true
          doneRef.current?.()
          return
        }
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [chars, speed, startDelay, reduced])

  const showCaret = caret && count < chars.length

  return (
    <span className={`${className} ${showCaret ? 'caret' : ''}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{chars.slice(0, count).join('')}</span>
    </span>
  )
}
