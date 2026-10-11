import { motion } from 'framer-motion'
import { whatsappLink } from '../data/store'
import { useApp } from '../context/AppContext'
import './Floaters.css'

export default function FloatingWhatsApp() {
  const { store } = useApp()

  return (
    <motion.a
      className="float-wa"
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Enquire on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.55, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="float-pulse" />
      <span className="float-pulse delay" />
      <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
        <path
          fill="#fff"
          d="M16.01 3C9.39 3 4 8.3 4 14.8c0 2.08.56 4.1 1.62 5.88L4 29l8.55-1.57A12.2 12.2 0 0 0 16 26.6c6.62 0 12-5.3 12-11.8C28 8.3 22.63 3 16.01 3zm6.9 16.7c-.29.8-1.68 1.47-2.35 1.56-.6.08-1.36.12-2.2-.14-.5-.15-1.15-.38-1.98-.74-3.48-1.5-5.74-5-5.91-5.23-.17-.23-1.38-1.84-1.38-3.5 0-1.67.88-2.49 1.19-2.83.31-.34.68-.43.9-.43h.65c.2 0 .48-.05.75.57.29.66.98 2.28 1.06 2.45.09.17.14.37.03.6-.1.23-.16.37-.31.57-.15.2-.32.44-.46.59-.15.17-.31.35-.13.68.17.34.77 1.27 1.65 2.06 1.14 1.02 2.1 1.34 2.44 1.5.34.14.54.12.74-.07.2-.2.85-.99 1.08-1.33.23-.34.46-.28.77-.17.31.11 1.97.93 2.31 1.1.34.17.57.25.65.39.09.14.09.8-.2 1.6z"
        />
      </svg>
      <span className="float-wa-text">Enquire</span>
      <span className="sr-only">WhatsApp {store.handle}</span>
    </motion.a>
  )
}
