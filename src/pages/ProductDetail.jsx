import { Link, useParams } from 'react-router-dom'
import {
  ChevronRight,
  MessageCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react'
import ProductCard from '../components/ProductCard'
import ReelStrip from '../components/ReelStrip'
import ReelVideo from '../components/ReelVideo'
import { useApp } from '../context/AppContext'
import { formatINR, whatsappLink } from '../data/store'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const { products, addToCart, videos, openPlayer } = useApp()
  const product = products.find((p) => p.id === id)

  if (!product) {
    return (
      <section className="section container">
        <p>Product not found.</p>
        <Link to="/shop" className="btn btn-ghost">
          Back to shop
        </Link>
      </section>
    )
  }

  const waMsg = `Hi Zynk! I want to order: ${product.name} (${formatINR(product.price)})`
  const off = Math.round((1 - product.price / product.mrp) * 100)
  const reelIndex = product.category === 'bats' ? 1 : 0
  const reel = videos[reelIndex]
  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.category !== product.category))
    .slice(0, 4)

  return (
    <>
      <section className="section pd-section">
        <div className="container">
          <nav className="pd-crumbs">
            <Link to="/">Home</Link> <ChevronRight size={14} />
            <Link to="/shop">Shop</Link> <ChevronRight size={14} />
            <span>{product.name}</span>
          </nav>

          <div className="product-detail">
            <div className="product-detail-media">
              <img src={product.image} alt={product.name} />
              {product.badge && <span className="badge pd-badge">{product.badge}</span>}
              <button
                type="button"
                className="pd-reel"
                onClick={() => openPlayer(reelIndex)}
                aria-label="Watch reel"
              >
                <ReelVideo src={reel.src} poster={reel.poster} />
                <span>
                  <Play size={12} fill="currentColor" /> Watch reel
                </span>
              </button>
            </div>

            <div className="product-detail-body">
              <span className="eyebrow">{product.category}</span>
              <h1 className="text-3d">{product.name}</h1>
              <div className="pd-rating">
                <span className="stars">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </span>
                {product.rating} · {product.reviews} reviews
                <span className={`status-pill ${product.stock > 10 ? 'ok' : 'warn'}`}>
                  {product.stock} in stock
                </span>
              </div>
              <div className="product-detail-price">
                <strong>{formatINR(product.price)}</strong>
                <s>{formatINR(product.mrp)}</s>
                <em>{off}% off</em>
              </div>
              <p className="pd-desc">{product.description}</p>

              <div className="product-detail-actions">
                <button type="button" className="btn btn-primary" onClick={() => addToCart(product)}>
                  <ShoppingBag size={18} /> Add to cart
                </button>
                <a className="btn btn-wa" href={whatsappLink(waMsg)} target="_blank" rel="noreferrer">
                  <MessageCircle size={18} /> Order on WhatsApp
                </a>
              </div>

              <ul className="pd-perks">
                <li>
                  <Truck size={18} /> Free shipping across India
                </li>
                <li>
                  <ShieldCheck size={18} /> Player-tested & knock-checked
                </li>
                <li>
                  <RotateCcw size={18} /> Easy 7-day replacement
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ReelStrip eyebrow="See it at Zynk" title="Watch before you buy" limit={5} />

      <section className="section pd-section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">You may also like</span>
              <h2>More from Zynk</h2>
            </div>
          </div>
          <div className="grid-products">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
