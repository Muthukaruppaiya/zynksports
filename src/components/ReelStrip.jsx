import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import ReelVideo from './ReelVideo'
import { useApp } from '../context/AppContext'
import { useTilt } from '../hooks/useTilt'
import './ReelStrip.css'

function ReelCard({ video, index, onOpen }) {
  const tilt = useTilt(12)

  return (
    <motion.div
      className="reel-card-wrap"
      initial={{ opacity: 0, y: 50, rotateY: -25 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
    <motion.button
      type="button"
      className="reel-card tilt"
      onClick={onOpen}
      style={tilt.style}
      {...tilt.handlers}
    >
      <ReelVideo src={video.src} poster={video.poster} />
      <motion.span className="tilt-glare" style={{ background: tilt.glare }} />
      <span className="reel-card-tag">{video.tag}</span>
      <span className="reel-card-play">
        <Play size={18} fill="currentColor" />
      </span>
      <span className="reel-card-meta">
        <strong>{video.title}</strong>
        <small>Tap to watch with sound</small>
      </span>
    </motion.button>
    </motion.div>
  )
}

export default function ReelStrip({
  eyebrow = 'Watch & shop',
  title = 'Reels from the store',
  limit,
}) {
  const { videos, openPlayer } = useApp()
  const list = limit ? videos.slice(0, limit) : videos
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], [80, -80])

  return (
    <section ref={ref} className="section reel-strip-section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>
          <Link to="/catalogue" className="btn btn-ghost">
            Video catalogue <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <motion.div className="reel-strip" style={{ x }}>
        {list.map((v, i) => (
          <ReelCard key={v.id} video={v} index={i} onOpen={() => openPlayer(i)} />
        ))}
      </motion.div>
    </section>
  )
}
