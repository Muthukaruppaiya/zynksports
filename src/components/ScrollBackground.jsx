import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import CricketBall from './CricketBall'
import './ScrollBackground.css'

export default function ScrollBackground() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 50, damping: 18 })

  const up = useTransform(p, [0, 1], ['0vh', '-70vh'])
  const down = useTransform(p, [0, 1], ['0vh', '50vh'])
  const spin = useTransform(p, [0, 1], [0, 900])
  const spinBack = useTransform(p, [0, 1], [0, -600])
  const floor = useTransform(p, [0, 1], ['0px', '-2400px'])
  const wordX = useTransform(p, [0, 1], ['4%', '-48%'])
  const wordX2 = useTransform(p, [0, 1], ['-40%', '6%'])
  const ringRot = useTransform(p, [0, 1], [20, 200])
  const ringScale = useTransform(p, [0, 0.5, 1], [0.9, 1.15, 0.95])

  if (reduce) {
    return (
      <div className="sbg" aria-hidden="true">
        <div className="sbg-blob a" />
        <div className="sbg-blob b" />
        <div className="sbg-grain" />
      </div>
    )
  }

  return (
    <div className="sbg" aria-hidden="true">
      <motion.div className="sbg-blob a" style={{ y: down }} />
      <motion.div className="sbg-blob b" style={{ y: up }} />
      <motion.div className="sbg-blob c" style={{ y: down }} />

      <motion.div className="sbg-word top" style={{ x: wordX }}>
        ZYNK · PREMIUM CRICKET · ZYNK
      </motion.div>
      <motion.div className="sbg-word bottom" style={{ x: wordX2 }}>
        GOOD GEAR · BIGGER DREAMS
      </motion.div>

      <motion.div className="sbg-ring" style={{ rotateX: 68, rotateZ: ringRot, scale: ringScale }} />

      <div className="sbg-floor">
        <motion.div className="sbg-floor-grid" style={{ backgroundPositionY: floor }} />
      </div>

      <motion.div className="sbg-ball one" style={{ y: up, rotate: spin }}>
        <CricketBall size={64} />
      </motion.div>
      <motion.div className="sbg-ball two" style={{ y: down, rotate: spinBack }}>
        <CricketBall size={38} white />
      </motion.div>
      <motion.div className="sbg-ball three" style={{ y: up, rotate: spinBack }}>
        <CricketBall size={26} />
      </motion.div>

      <div className="sbg-grain" />
    </div>
  )
}
