import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageCircle,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { whatsappLink } from '../data/store'
import './VideoPlayerModal.css'

export default function VideoPlayerModal() {
  const { playerIndex, closePlayer, setPlayerIndex, videos } = useApp()
  const ref = useRef(null)
  const [muted, setMuted] = useState(false)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const item = playerIndex != null ? videos[playerIndex] : null

  const go = (dir) => {
    if (playerIndex == null) return
    setPlayerIndex((playerIndex + dir + videos.length) % videos.length)
  }

  useEffect(() => {
    const el = ref.current
    if (!item || !el) return
    setProgress(0)
    setPaused(false)
    el.currentTime = 0
    el.muted = muted
    el.play().catch(() => {
      // Browser blocked sound without a gesture: fall back to muted playback.
      el.muted = true
      setMuted(true)
      el.play().catch(() => {})
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id])

  useEffect(() => {
    if (ref.current) ref.current.muted = muted
  }, [muted])

  useEffect(() => {
    if (!item) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') closePlayer()
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') go(-1)
      if (e.key === ' ') {
        e.preventDefault()
        togglePlay()
      }
      if (e.key.toLowerCase() === 'm') setMuted((m) => !m)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  })

  function togglePlay() {
    const el = ref.current
    if (!el) return
    if (el.paused) {
      el.play().catch(() => {})
      setPaused(false)
    } else {
      el.pause()
      setPaused(true)
    }
  }

  function seek(e) {
    const el = ref.current
    if (!el?.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    el.currentTime = ((e.clientX - rect.left) / rect.width) * el.duration
  }

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="vp-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePlayer}
        >
          <div className="vp-layout" onClick={(e) => e.stopPropagation()}>
            <motion.div
              key={item.id}
              className="vp-phone"
              initial={{ scale: 0.92, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 24 }}
            >
              <video
                ref={ref}
                src={item.src}
                poster={item.poster}
                playsInline
                onClick={togglePlay}
                onTimeUpdate={(e) => {
                  const v = e.currentTarget
                  if (v.duration) setProgress(v.currentTime / v.duration)
                }}
                onEnded={() => go(1)}
              />

              <div className="vp-progress" onClick={seek}>
                <span style={{ transform: `scaleX(${progress})` }} />
              </div>

              <div className="vp-top">
                <div className="vp-title">
                  <img src="/brand/logo.png" alt="" />
                  <div>
                    <strong>{item.title}</strong>
                    <small>@zynkcricketstore · {item.tag}</small>
                  </div>
                </div>
                <div className="vp-actions">
                  <button type="button" onClick={() => setMuted((m) => !m)} aria-label="Toggle sound">
                    {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <button type="button" onClick={closePlayer} aria-label="Close player">
                    <X size={18} />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {paused && (
                  <motion.button
                    type="button"
                    className="vp-center"
                    onClick={togglePlay}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    aria-label="Play"
                  >
                    <Play size={30} fill="currentColor" />
                  </motion.button>
                )}
              </AnimatePresence>

              {muted && (
                <button type="button" className="vp-unmute" onClick={() => setMuted(false)}>
                  <VolumeX size={14} /> Tap for sound
                </button>
              )}

              <div className="vp-bottom">
                <a
                  className="vp-cta"
                  href={whatsappLink(`Hi Zynk! I saw "${item.title}" and want to order.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={16} /> Order on WhatsApp
                </a>
                <a className="vp-ig" href={item.permalink} target="_blank" rel="noreferrer">
                  <ExternalLink size={15} />
                </a>
                <button type="button" className="vp-ig" onClick={togglePlay} aria-label="Play or pause">
                  {paused ? <Play size={15} /> : <Pause size={15} />}
                </button>
              </div>
            </motion.div>

            <div className="vp-nav">
              <button type="button" onClick={() => go(-1)} aria-label="Previous reel">
                <ChevronUp size={22} />
              </button>
              <span>
                {playerIndex + 1}/{videos.length}
              </span>
              <button type="button" onClick={() => go(1)} aria-label="Next reel">
                <ChevronDown size={22} />
              </button>
            </div>

            <div className="vp-queue">
              <p>Up next</p>
              {videos.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  className={i === playerIndex ? 'active' : ''}
                  onClick={() => setPlayerIndex(i)}
                >
                  <img src={v.poster} alt="" />
                  <span>
                    <strong>{v.title}</strong>
                    <small>{v.tag}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
