import { useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import ReelStrip from '../components/ReelStrip'
import { useApp } from '../context/AppContext'
import { CATEGORIES } from '../data/store'
import './Shop.css'

export default function Shop() {
  const { products } = useApp()
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const byCat = cat === 'all' || p.category === cat
      const byQ =
        !q ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase())
      return byCat && byQ
    })
  }, [products, cat, q])

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Catalogue</span>
            <h2>All cricket gear</h2>
          </div>
          <p>Wireframe catalogue — pricing & stock editable from Admin after go-live.</p>
        </div>

        <div className="shop-toolbar glass glass-panel">
          <input
            type="search"
            placeholder="Search bats, gloves, kits…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="shop-filters">
            <button
              type="button"
              className={cat === 'all' ? 'active' : ''}
              onClick={() => setCat('all')}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={cat === c.id ? 'active' : ''}
                onClick={() => setCat(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid-products">
          {filtered.slice(0, 4).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
        {!filtered.length && <p className="empty">No products match your filters.</p>}
      </div>

      {filtered.length > 0 && <ReelStrip eyebrow="See it in action" title="Gear on reel" limit={5} />}

      {filtered.length > 4 && (
        <div className="container">
          <div className="grid-products">
            {filtered.slice(4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
