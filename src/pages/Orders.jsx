import { Link, useParams } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import { useApp } from '../context/AppContext'
import { formatINR } from '../data/store'
import './Orders.css'

export default function Orders() {
  const { orderId } = useParams()
  const { orders } = useApp()
  const selected = orderId ? orders.find((o) => o.id === orderId) : orders[0]

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Orders</span>
            <h2>Track every delivery</h2>
          </div>
          <p>Live status bar from Placed → Delivered. Admin can update stages.</p>
        </div>

        <div className="orders-layout">
          <div className="glass glass-panel orders-list">
            {orders.map((o) => (
              <Link
                key={o.id}
                to={`/orders/${o.id}`}
                className={`order-item ${selected?.id === o.id ? 'active' : ''}`}
              >
                <div>
                  <strong>{o.id}</strong>
                  <span>{o.date}</span>
                </div>
                <div className="order-item-right">
                  <span className="status-pill">{o.status}</span>
                  <strong>{formatINR(o.total)}</strong>
                </div>
              </Link>
            ))}
          </div>

          {selected && (
            <div className="glass glass-panel order-detail">
              <div className="order-detail-head">
                <div>
                  <h3>{selected.id}</h3>
                  <p>
                    {selected.customer} · {selected.date}
                  </p>
                </div>
                <span className="status-pill ok">{selected.status}</span>
              </div>

              <h4>Status</h4>
              <StatusBar statusIndex={selected.statusIndex} />

              <h4>Items</h4>
              <ul className="order-items">
                {selected.items.map((item) => (
                  <li key={`${selected.id}-${item.productId}`}>
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <strong>{formatINR(item.price * item.qty)}</strong>
                  </li>
                ))}
              </ul>

              <div className="order-ship">
                <h4>Ship to</h4>
                <p>{selected.address}</p>
                <p>{selected.phone}</p>
              </div>

              <div className="order-total">
                <span>Order total</span>
                <strong>{formatINR(selected.total)}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
