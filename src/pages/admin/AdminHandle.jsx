import { Clapperboard, Link2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function AdminHandle() {
  const { store, setVideoOpen, showToast } = useApp()

  return (
    <div className="glass glass-panel admin-panel">
      <h2>Handle & reels</h2>
      <p className="muted">
        Official Instagram identity for {store.handle}. One floating promo video plays sitewide.
      </p>

      <div className="handle-grid">
        <div className="handle-card">
          <img
            src={store.logo}
            alt="ZYNK"
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              border: '2px solid var(--zynk-yellow)',
              marginBottom: 12,
            }}
          />
          <h3>
            <Clapperboard size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Store handle
          </h3>
          <p>
            <strong>{store.name}</strong>
          </p>
          <ul>
            <li>Handle: {store.handle}</li>
            <li>Profile: {store.instagram}</li>
            <li>Reels: {store.reels}</li>
            <li>WhatsApp: +{store.whatsapp}</li>
            <li>Tagline: {store.tagline}</li>
          </ul>
          <div className="admin-actions" style={{ marginTop: '1rem', marginBottom: 0 }}>
            <a className="btn btn-red" href={store.reels} target="_blank" rel="noreferrer">
              Open Instagram reels
            </a>
          </div>
        </div>

        <div className="handle-card">
          <h3>
            <Link2 size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Floating video
          </h3>
          <p>
            Compact phone-style player (Drag · Tap). Uses one autoplay loop from Zynk Instagram
            media. Tap opens Instagram reels.
          </p>
          <div className="admin-actions" style={{ marginTop: '1rem', marginBottom: 0 }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setVideoOpen(true)
                showToast('Floating video shown')
              }}
            >
              Show floating video
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
