import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Star } from 'lucide-react'
import { formatINR } from '../data/store'
import { useApp } from '../context/AppContext'
import { useTilt } from '../hooks/useTilt'
import './ProductCard.css'

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useApp()
  const tilt = useTilt(8)
  const off = Math.round((1 - product.price / product.mrp) * 100)

  return (
    <motion.div
      className="product-card-wrap"
      initial={{ opacity: 0, y: 40, rotateX: 18 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
    <motion.article
      className="product-card glass glass-panel tilt"
      style={tilt.style}
      {...tilt.handlers}
    >
      <motion.span className="tilt-glare" style={{ background: tilt.glare }} />
      <Link to={`/product/${product.id}`} className="product-media">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.badge && <span className="badge product-badge">{product.badge}</span>}
        {off > 0 && <span className="product-off">-{off}%</span>}
      </Link>
      <div className="product-body">
        <div className="product-meta">
          <span>{product.category}</span>
          <span className="rating">
            <Star size={13} fill="currentColor" /> {product.rating}
          </span>
        </div>
        <h3>
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="product-price">
          <strong>{formatINR(product.price)}</strong>
          <s>{formatINR(product.mrp)}</s>
        </div>
        <button type="button" className="btn btn-primary product-cta" onClick={() => addToCart(product)}>
          <ShoppingBag size={16} /> Add to cart
        </button>
      </div>
    </motion.article>
    </motion.div>
  )
}
