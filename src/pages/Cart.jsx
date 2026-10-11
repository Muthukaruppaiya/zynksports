import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { formatINR } from '../data/store'
import './Cart.css'

export default function Cart() {
  const { cart, updateCartQty, cartTotal, placeOrder } = useApp()
  const navigate = useNavigate()

  function checkout() {
    const order = placeOrder()
    if (order) navigate(`/orders/${order.id}`)
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Cart</span>
            <h2>Your kit bag</h2>
          </div>
        </div>

        {!cart.length ? (
          <div className="glass glass-panel empty-panel">
            <p>Cart is empty.</p>
            <Link to="/shop" className="btn btn-primary">
              Browse shop
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="glass glass-panel cart-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-row">
                  <img src={item.image} alt="" />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{formatINR(item.price)}</p>
                  </div>
                  <div className="qty">
                    <button type="button" onClick={() => updateCartQty(item.id, item.qty - 1)}>
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button type="button" onClick={() => updateCartQty(item.id, item.qty + 1)}>
                      +
                    </button>
                  </div>
                  <strong>{formatINR(item.price * item.qty)}</strong>
                </div>
              ))}
            </div>
            <aside className="glass glass-panel cart-summary">
              <h3>Order summary</h3>
              <div className="sum-row">
                <span>Subtotal</span>
                <strong>{formatINR(cartTotal)}</strong>
              </div>
              <div className="sum-row">
                <span>GST (est.)</span>
                <strong>{formatINR(Math.round(cartTotal * 0.18))}</strong>
              </div>
              <div className="sum-row total">
                <span>Total</span>
                <strong>{formatINR(cartTotal + Math.round(cartTotal * 0.18))}</strong>
              </div>
              <button type="button" className="btn btn-primary" onClick={checkout}>
                Place order
              </button>
              <p className="note">Wireframe checkout — payment gateway wires in full build.</p>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}
