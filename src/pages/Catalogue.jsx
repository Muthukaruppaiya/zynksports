import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clapperboard, MessageCircle, Play, Volume2 } from 'lucide-react'
import ReelVideo from '../components/ReelVideo'
import { useApp } from '../context/AppContext'
import { whatsappLink } from '../data/store'
import { useTilt } from '../hooks/useTilt'
import './Catalogue.css'

function VideoCard({ video, index, onOpen }) {
  const tilt = useTilt(12)
  return (
    <motion.button
      layout
      type="button"
      className="cat-card"
      onClick={onOpen}
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.span className="cat-card-3d tilt" style={tilt.style} {...tilt.handlers}>
        <ReelVideo src={video.src} poster={video.poster} />
        <motion.span className="tilt-glare" style={{ background: tilt.glare }} />
        <span className="cat-card-tag">{video.tag}</span>
        <span className="cat-card-play">
          <Play size={18} fill="currentColor" />
        </span>
        <span className="cat-card-meta">
          <strong>{video.title}</strong>
          <small>Tap to watch with sound</small>
        </span>
      </motion.span>
    </motion.button>
  )
}

export default function Catalogue() {
  const featuredTilt = useTilt(10)
  const { videos, openPlayer, store } = useApp()
  const [tag, setTag] = useState('All')
  const tags = useMemo(() => ['All', ...new Set(videos.map((v) => v.tag))], [videos])
  const list = tag === 'All' ? videos : videos.filter((v) => v.tag === tag)
  const featured = videos[0]
  const indexOf = (id) => videos.findIndex((v) => v.id === id)

  return (
    <div className="catalogue">
      <section className="container cat-hero">
        <div className="cat-hero-copy">
          <span className="eyebrow">Video catalogue</span>
          <h1 className="text-3d">Watch. Pick. Order.</h1>
          <p>
            Real reels from {store.handle} — the bat wall, fresh drops and happy customers. Tap any
            video to watch full screen with sound, then order straight on WhatsApp.
          </p>
          <div className="cat-hero-actions">
            <button type="button" className="btn btn-primary" onClick={() => openPlayer(0)}>
              <Play size={16} fill="currentColor" /> Play all ({videos.length})
            </button>
            <a className="btn btn-ghost" href={store.reels} target="_blank" rel="noreferrer">
              <Clapperboard size={16} /> Instagram reels
            </a>
          </div>
        </div>

        <motion.button
          type="button"
          className="cat-featured tilt"
          onClick={() => openPlayer(0)}
          style={featuredTilt.style}
          {...featuredTilt.handlers}
        >
          <ReelVideo src={featured.src} poster={featured.poster} threshold={0.1} />
          <motion.span className="tilt-glare" style={{ background: featuredTilt.glare }} />
          <span className="cat-featured-badge">
            <Volume2 size={13} /> Featured · tap for sound
          </span>
          <span className="cat-card-play big">
            <Play size={24} fill="currentColor" />
          </span>
          <span className="cat-card-meta">
            <small>{featured.tag}</small>
            <strong>{featured.title}</strong>
          </span>
        </motion.button>
      </section>

      <section className="container cat-body">
        <div className="cat-filters">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              className={t === tag ? 'active' : ''}
              onClick={() => setTag(t)}
            >
              {t}
              <em>{t === 'All' ? videos.length : videos.filter((v) => v.tag === t).length}</em>
            </button>
          ))}
        </div>

        <motion.div layout className="cat-grid-videos">
          <AnimatePresence mode="popLayout">
            {list.map((v, i) => (
              <VideoCard key={v.id} video={v} index={i} onOpen={() => openPlayer(indexOf(v.id))} />
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="cat-cta">
          <div>
            <h3>Saw something you like?</h3>
            <p className="muted">Send us the reel name — we'll share price, weight & a live video call.</p>
          </div>
          <a
            className="btn btn-yellow"
            href={whatsappLink('Hi Zynk! I saw a reel in your video catalogue and want details.')}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} /> Order on WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}
