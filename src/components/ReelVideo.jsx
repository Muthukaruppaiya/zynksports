import { useEffect, useRef } from 'react'

/** Muted looping reel that only plays while visible on screen. */
export default function ReelVideo({ src, poster, className = '', threshold = 0.35 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.muted = true
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [src, threshold])

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
    />
  )
}
