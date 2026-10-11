import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Paintbrush,
  Play,
  ShieldCheck,
  Star,
  Truck,
  Wallet,
} from 'lucide-react'
import ProductCard from '../components/ProductCard'
import ReelStrip from '../components/ReelStrip'
import ReelVideo from '../components/ReelVideo'
import CricketBall from '../components/CricketBall'
import ScrollMarquee from '../components/ScrollMarquee'
import { useApp } from '../context/AppContext'
import { useTilt } from '../hooks/useTilt'
import { CATEGORIES, IG_MEDIA, formatINR } from '../data/store'
import './Home.css'

const PERKS = [
  { icon: Truck, title: 'All India shipping', text: 'Fast & tracked delivery' },
  { icon: Paintbrush, title: 'Custom stickers', text: 'Personalise your bat' },
  { icon: ShieldCheck, title: 'Player-tested', text: 'Every bat knock-checked' },
  { icon: Wallet, title: 'UPI · Cards · COD', text: 'Pay the way you like' },
]

const TICKER = [
  '❤️ MOST LOVED CRICKET GEAR — ZYNK',
  '🚚 SHIPS ACROSS INDIA & WORLDWIDE',
  '🎨 CUSTOM BAT STICKERS & SERVICES',
  '💬 WHATSAPP ORDERS · 8838150242',
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
}

function CategoryTile({ category, index }) {
  const tilt = useTilt(12)
  return (
    <motion.div
      className="cat-tile-wrap"
      initial={{ opacity: 0, y: 40, rotateX: -20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div className="tilt cat-tilt" style={tilt.style} {...tilt.handlers}>
        <Link to="/shop" className="cat-tile">
          <img src={category.image} alt="" loading="lazy" />
          <motion.span className="tilt-glare" style={{ background: tilt.glare }} />
          <span className="cat-tile-body">
            <strong>{category.name}</strong>
            <small>
              {category.count} items <ArrowRight size={13} />
            </small>
          </span>
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default function Home() {
  const { products, reviews, store, videos, openPlayer } = useApp()
  const heroRef = useRef(null)
  const storeRef = useRef(null)
  const phoneTilt = useTilt(14)
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const hp = useSpring(heroP, { stiffness: 90, damping: 22 })
  const copyY = useTransform(hp, [0, 1], [0, -140])
  const copyOpacity = useTransform(hp, [0, 0.8], [1, 0])
  const phoneY = useTransform(hp, [0, 1], [0, 160])
  const phoneScale = useTransform(hp, [0, 1], [1, 0.82])
  const phoneRotZ = useTransform(hp, [0, 1], [2, -10])
  const floatY = useTransform(hp, [0, 1], [0, -220])
  const ballY = useTransform(hp, [0, 1], [0, 320])
  const ballRot = useTransform(hp, [0, 1], [0, 540])
  const { scrollYProgress: storeP } = useScroll({ target: storeRef, offset: ['start end', 'end start'] })
  const storeVideoY = useTransform(storeP, [0, 1], [70, -70])
  const storeRotY = useTransform(storeP, [0, 0.5, 1], [18, 0, -12])
  const featured = products.slice(0, 4)
  const approved = reviews.filter((r) => r.approved)
  const heroIndex = Math.max(0, videos.findIndex((v) => v.id === 'reel-7'))
  const storeIndex = Math.max(0, videos.findIndex((v) => v.id === 'reel-3'))
  const heroReel = videos[heroIndex]
  const storeReel = videos[storeIndex]

  return (
    <>
      <div className="announce" aria-hidden="true">
        <div className="announce-track">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      <section className="hero" ref={heroRef}>
        <div className="hero-glow" aria-hidden="true" />
        <div className="container hero-grid">
          <motion.div className="hero-copy" style={{ y: copyY, opacity: copyOpacity }}>
            <motion.span
              className="hero-kicker"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <BadgeCheck size={15} /> {store.handle} · Premium Cricket Store
            </motion.span>
            <motion.h1
              className="text-3d"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
            >
              Good gear.
              <br />
              <span className="hl">Bigger dreams.</span>
            </motion.h1>
            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
            >
              Exclusive ZYNK bats, kits & custom stickers — player-tested and shipped across India.
              Walk into the store or order straight from WhatsApp.
            </motion.p>
            <motion.div
              className="hero-cta"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
            >
              <Link to="/shop" className="btn btn-primary">
                Shop all gear <ArrowRight size={18} />
              </Link>
              <button type="button" className="btn btn-ghost" onClick={() => openPlayer(heroIndex)}>
                <Play size={16} fill="currentColor" /> Watch reels
              </button>
            </motion.div>
            <motion.div
              className="hero-stats"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
            >
              <div>
                <strong>4.9★</strong>
                <span>Average rating</span>
              </div>
              <div>
                <strong>{store.followers}+</strong>
                <span>Happy players</span>
              </div>
              <div>
                <strong>{store.posts}+</strong>
                <span>Reels & drops</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 120, damping: 18 }}
          >
            <motion.div
              className="hero-phone-wrap"
              style={{ y: phoneY, scale: phoneScale, rotateZ: phoneRotZ }}
            >
              <motion.button
                type="button"
                className="hero-phone tilt"
                style={phoneTilt.style}
                {...phoneTilt.handlers}
                onClick={() => openPlayer(heroIndex)}
                aria-label="Play reel with sound"
              >
                <ReelVideo src={heroReel.src} poster={heroReel.poster} threshold={0.1} />
                <motion.span className="tilt-glare" style={{ background: phoneTilt.glare }} />
                <span className="hero-phone-badge">
                  <i /> Now playing
                </span>
                <span className="hero-phone-play">
                  <Play size={20} fill="currentColor" />
                </span>
              </motion.button>
            </motion.div>

            <motion.div className="hero-ball" style={{ y: ballY, rotate: ballRot }}>
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <CricketBall size={86} />
              </motion.div>
            </motion.div>

            <motion.div className="hero-floats" style={{ y: floatY }}>
            <motion.div
              className="hero-float hero-float-product glass"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img src={products[0].image} alt="" />
              <div>
                <small>Bestseller</small>
                <strong>{products[0].name}</strong>
                <span>{formatINR(products[0].price)}</span>
              </div>
            </motion.div>

            <motion.div
              className="hero-float hero-float-rating glass"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="stars-row">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={13} fill="currentColor" />
                ))}
              </div>
              <strong>“Pickup feels unreal”</strong>
              <small>Vikram · verified buyer</small>
            </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="perks container">
        {PERKS.map(({ icon: Icon, title, text }, i) => (
          <motion.div
            key={title}
            className="perk"
            {...fadeUp}
            transition={{ delay: i * 0.06 }}
          >
            <span className="perk-icon">
              <Icon size={20} />
            </span>
            <div>
              <strong>{title}</strong>
              <small>{text}</small>
            </div>
          </motion.div>
        ))}
      </section>

      <ScrollMarquee
        top={['English willow', 'Kashmir willow', 'Custom stickers', 'Knocking service']}
        bottom={['Good gear', 'Bigger dreams', '@zynkcricketstore', 'Ships India-wide']}
      />

      <section className="section section-tight">
        <div className="container">
          <div className="section-head center">
            <div>
              <span className="eyebrow">Our collections</span>
              <h2>Shop by category</h2>
            </div>
            <p>Bats · Gloves · Pads · Balls · Kits & custom stickers</p>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map((c, i) => (
              <CategoryTile key={c.id} category={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Top selling</span>
              <h2>Players' favourites</h2>
            </div>
            <Link to="/shop" className="btn btn-ghost">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid-products">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <ReelStrip eyebrow="Watch & shop" title="Straight from the store" />

      <section className="section section-tight" ref={storeRef}>
        <motion.div className="container store-band" {...fadeUp}>
          <motion.div
            className="store-band-stage"
            style={{ y: storeVideoY, rotateY: storeRotY, transformPerspective: 1000 }}
          >
            <button
              type="button"
              className="store-band-video"
              onClick={() => openPlayer(storeIndex)}
              aria-label="Play store tour"
            >
              <ReelVideo src={storeReel.src} poster={storeReel.poster} />
              <span className="hero-phone-play">
                <Play size={20} fill="currentColor" />
              </span>
            </button>
            <span className="store-band-chip">
              <Star size={14} fill="currentColor" /> 4.9 in-store rating
            </span>
          </motion.div>
          <div className="store-band-copy">
            <span className="eyebrow">The Zynk experience</span>
            <h2>Walk in. Pick up. Feel the willow.</h2>
            <p>
              A full bat wall, a players' lounge and a team that knocks every bat before it leaves.
              Visit the store or get a personal video walkthrough on WhatsApp.
            </p>
            <ul className="store-band-list">
              <li>
                <BadgeCheck size={18} /> Hand-picked English & Kashmir willow
              </li>
              <li>
                <BadgeCheck size={18} /> Custom stickers & knocking service
              </li>
              <li>
                <BadgeCheck size={18} /> Video call shopping for outstation players
              </li>
            </ul>
            <div className="hero-cta">
              <Link to="/catalogue" className="btn btn-primary">
                Watch all videos <ArrowRight size={16} />
              </Link>
              <a className="btn btn-red" href={store.reels} target="_blank" rel="noreferrer">
                Instagram reels
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div>
              <span className="eyebrow">Happy customers</span>
              <h2>Why players choose Zynk</h2>
            </div>
            <p>4.9★ average from verified buyers across India.</p>
          </div>
        </div>
        <div className="review-marquee">
          <div className="review-track">
            {[...approved, ...approved].map((r, i) => (
              <blockquote key={`${r.id}-${i}`} className="review-card">
                <div className="stars-row">
                  {Array.from({ length: r.rating }).map((_, s) => (
                    <Star key={s} size={14} fill="currentColor" />
                  ))}
                </div>
                <p>“{r.text}”</p>
                <footer>
                  <span className="avatar">{r.name[0]}</span>
                  <span>
                    <strong>{r.name}</strong>
                    <small>{r.product}</small>
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <ScrollMarquee
        top={['Bats', 'Gloves', 'Pads', 'Balls', 'Kits', 'Bags']}
        bottom={['Order on WhatsApp', '8838150242', 'UPI · Cards · COD']}
      />

      <section className="section section-tight">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">From Instagram</span>
              <h2>Follow {store.handle}</h2>
            </div>
            <a className="btn btn-ghost" href={store.instagram} target="_blank" rel="noreferrer">
              Open Instagram <ArrowRight size={16} />
            </a>
          </div>
          <div className="ig-mosaic">
            {IG_MEDIA.gallery.map((src, i) => (
              <motion.a
                key={src}
                href={store.instagram}
                target="_blank"
                rel="noreferrer"
                className="ig-tile"
                {...fadeUp}
                transition={{ delay: i * 0.04 }}
              >
                <span className="ig-inner">
                  <img src={src} alt={`Zynk Instagram ${i + 1}`} loading="lazy" />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
