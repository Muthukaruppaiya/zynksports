import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import './Reviews.css'

export default function Reviews() {
  const { reviews, products, addReview } = useApp()
  const approved = reviews.filter((r) => r.approved)
  const [form, setForm] = useState({
    name: '',
    product: products[0]?.name || '',
    rating: 5,
    text: '',
  })

  function submit(e) {
    e.preventDefault()
    if (!form.name || !form.text) return
    addReview(form)
    setForm((f) => ({ ...f, name: '', text: '' }))
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Reviews</span>
            <h2>Player feedback</h2>
          </div>
          <p>Public reviews show after admin approval in the handle / moderation panel.</p>
        </div>

        <div className="reviews-layout">
          <div className="review-list">
            {approved.map((r, i) => (
              <motion.article
                key={r.id}
                className="glass glass-panel review-block"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="stars">{'★'.repeat(r.rating)}</div>
                <p>“{r.text}”</p>
                <footer>
                  <strong>{r.name}</strong>
                  <span>
                    {r.product} · {r.date}
                  </span>
                </footer>
              </motion.article>
            ))}
          </div>

          <form className="glass glass-panel review-form" onSubmit={submit}>
            <h3>Leave a review</h3>
            <div className="field">
              <label htmlFor="rname">Your name</label>
              <input
                id="rname"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="rproduct">Product</label>
              <select
                id="rproduct"
                value={form.product}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="rrating">Rating</label>
              <select
                id="rrating"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} stars
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="rtext">Review</label>
              <textarea
                id="rtext"
                rows={4}
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit review
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
