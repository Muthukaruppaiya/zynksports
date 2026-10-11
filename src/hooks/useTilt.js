import {
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'

const SPRING = { stiffness: 220, damping: 20, mass: 0.6 }

/** Mouse-driven 3D tilt with a moving light glare. */
export function useTilt(max = 10) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(y, [0, 1], [max, -max]), SPRING)
  const rotateY = useSpring(useTransform(x, [0, 1], [-max, max]), SPRING)
  const gx = useTransform(x, (v) => `${v * 100}%`)
  const gy = useTransform(y, (v) => `${v * 100}%`)
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.45), rgba(255,255,255,0) 55%)`

  if (reduce) return { style: {}, handlers: {}, glare: 'none' }

  return {
    style: { rotateX, rotateY, transformPerspective: 900 },
    handlers: {
      onMouseMove(e) {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left) / r.width)
        y.set((e.clientY - r.top) / r.height)
      },
      onMouseLeave() {
        x.set(0.5)
        y.set(0.5)
      },
    },
    glare,
  }
}
