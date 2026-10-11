import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import Navbar from './Navbar'
import FloatingWhatsApp from './FloatingWhatsApp'
import FloatingVideo from './FloatingVideo'
import VideoPlayerModal from './VideoPlayerModal'
import ScrollBackground from './ScrollBackground'
import { useApp } from '../context/AppContext'
import { whatsappLink } from '../data/store'
import './Layout.css'

export default function Layout() {
  const { toast, store } = useApp()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className="app-shell">
      <ScrollBackground />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname.startsWith('/admin') ? '/admin' : pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <footer className="site-footer">
        <div className="container footer-card">
          <div className="footer-cta">
            <div>
              <h3>Ready to own the pitch?</h3>
              <p>DM us on WhatsApp for custom bats, stickers & bulk academy orders.</p>
            </div>
            <a className="btn btn-yellow" href={whatsappLink()} target="_blank" rel="noreferrer">
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          </div>

          <div className="footer-grid">
            <div className="footer-brand">
              <img src={store.logo} alt="ZYNK" />
              <div>
                <h4>ZYNK</h4>
                <p>The Premium Cricket Store · Good gear, bigger dreams.</p>
              </div>
            </div>
            <div className="footer-col">
              <h5>Shop</h5>
              <Link to="/shop">All gear</Link>
              <Link to="/catalogue">Video catalogue</Link>
              <Link to="/reviews">Reviews</Link>
            </div>
            <div className="footer-col">
              <h5>Account</h5>
              <Link to="/account">My account</Link>
              <Link to="/orders">Track orders</Link>
              <Link to="/admin">Admin portal</Link>
            </div>
            <div className="footer-col">
              <h5>Contact</h5>
              <a href={whatsappLink()} target="_blank" rel="noreferrer">
                <Phone size={14} /> {store.phone}
              </a>
              <a href={`mailto:${store.email}`}>
                <Mail size={14} /> {store.email}
              </a>
              <span>
                <MapPin size={14} /> {store.address}
              </span>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 {store.name}</span>
            <a href={store.instagram} target="_blank" rel="noreferrer">
              {store.handle}
            </a>
          </div>
        </div>
      </footer>

      <FloatingWhatsApp />
      <FloatingVideo />
      <VideoPlayerModal />

      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
