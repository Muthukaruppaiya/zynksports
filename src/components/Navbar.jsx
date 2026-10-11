import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { Menu, PlayCircle, ShoppingBag, UserRound, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import './Navbar.css'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/catalogue', label: 'Catalogue' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/orders', label: 'Orders' },
  { to: '/admin', label: 'Admin' },
]

export default function Navbar() {
  const { store, cartCount, openPlayer } = useApp()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26 })
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav-wrap ${scrolled ? 'scrolled' : ''}`}>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <div className="container nav glass">
        <Link to="/" className="brand">
          <img className="brand-logo" src={store.logo} alt="ZYNK" />
          <span className="brand-text">
            <strong>ZYNK</strong>
            <small>Premium Cricket Store</small>
          </span>
        </Link>

        <nav className="nav-links">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => openPlayer(0)}
            title="Watch reels"
          >
            <PlayCircle size={18} />
          </button>
          <Link to="/account" className="icon-btn" title="Account">
            <UserRound size={18} />
          </Link>
          <Link to="/cart" className="icon-btn cart-btn" title="Cart">
            <ShoppingBag size={18} />
            {cartCount > 0 && <em>{cartCount}</em>}
          </Link>
          <button
            type="button"
            className="icon-btn menu-btn"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="container mobile-menu glass"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={() => setOpen(false)}
          >
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end}>
                {l.label}
              </NavLink>
            ))}
            <NavLink to="/account">Account</NavLink>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
