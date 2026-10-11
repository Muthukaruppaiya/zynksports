import { useEffect, useRef } from 'react'
import { Maximize2, Volume2, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { FLOAT_VIDEO } from '../data/store'
import './Floaters.css'

export default function FloatingVideo() {
  const { videoOpen, setVideoOpen, openPlayer, playerIndex, videos } = useApp()
  const ref = useRef(null)
  const hidden = !videoOpen || playerIndex != null

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (hidden) {
      el.pause()
      return
    }
    el.muted = true
    el.play().catch(() => {})
  }, [hidden])

  if (!videoOpen) return null

  const index = Math.max(
    0,
    videos.findIndex((v) => v.id === FLOAT_VIDEO.id),
  )

  return (
    <motion.div
      className="float-video"
      style={{ visibility: hidden ? 'hidden' : 'visible' }}
      drag
      dragMomentum={false}
      dragElastic={0.12}
      dragConstraints={{ left: -window.innerWidth + 160, right: 0, top: -window.innerHeight + 320, bottom: 0 }}
      initial={{ opacity: 0, y: 28, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.04 }}
      onTap={() => openPlayer(index)}
    >
      <button
        type="button"
        className="float-video-close"
        onPointerDownCapture={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          setVideoOpen(false)
        }}
        aria-label="Close video"
      >
        <X size={13} strokeWidth={2.6} />
      </button>

      <div className="float-video-frame">
        <video
          ref={ref}
          src={FLOAT_VIDEO.src}
          poster={FLOAT_VIDEO.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <span className="float-video-live">
          <i /> REELS
        </span>
        <span className="float-video-expand">
          <Maximize2 size={12} />
        </span>
      </div>

      <div className="float-video-caption">
        <Volume2 size={11} /> Drag · Tap
      </div>
    </motion.div>
  )
}
