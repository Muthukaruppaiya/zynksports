import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import './ScrollMarquee.css'

/** Two crossing ribbons whose text slides as the page scrolls. */
export default function ScrollMarquee({ top, bottom }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x1 = useTransform(scrollYProgress, [0, 1], ['0%', '-35%'])
  const x2 = useTransform(scrollYProgress, [0, 1], ['-35%', '0%'])

  const row = (items) =>
    [...items, ...items, ...items, ...items].map((t, i) => (
      <span key={i}>
        {t}
        <i>✦</i>
      </span>
    ))

  return (
    <div ref={ref} className="smq" aria-hidden="true">
      <div className="smq-band navy">
        <motion.div className="smq-track" style={{ x: x1 }}>
          {row(top)}
        </motion.div>
      </div>
      <div className="smq-band yellow">
        <motion.div className="smq-track" style={{ x: x2 }}>
          {row(bottom)}
        </motion.div>
      </div>
    </div>
  )
}
