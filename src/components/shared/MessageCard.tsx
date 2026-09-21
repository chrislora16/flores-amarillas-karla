import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * Tarjeta flotante que revela un mensaje al tocar una flor.
 * La usan tanto Karla ("Toca la flor") como Skarlen ("Escoge una flor"),
 * cada una con su propio acento de color.
 */
export function MessageCard({
  message,
  accent = '#F5B82E',
  className = '',
}: {
  message: ReactNode
  accent?: string
  className?: string
}) {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          key={typeof message === 'string' ? message : Math.random()}
          initial={{ opacity: 0, y: 22, scale: 0.94, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -14, scale: 0.97, filter: 'blur(3px)' }}
          transition={{ duration: 0.5, ease: [0.22, 0.9, 0.25, 1] }}
          className={`glass rounded-2xl px-6 py-4 ${className}`}
          style={{ borderColor: `${accent}55` }}
        >
          <p className="font-serif text-[clamp(1rem,4vw,1.2rem)] font-light italic leading-snug text-ink">
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
