import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatINR } from '../../data/store'

export default function Dashboard() {
  const { products, orders, reviews, invoices, store } = useApp()
  const revenue = invoices.filter((i) => i.status === 'Paid').reduce((s, i) => s + i.amount, 0)
  const pendingReviews = reviews.filter((r) => !r.approved).length

  return (
    <div className="glass glass-panel admin-panel">
      <h2>Dashboard</h2>
      <p className="muted">
        {store.name} · wireframe metrics for client walkthrough
      </p>

      <div className="stat-grid">
        <div className="stat-card">
          <strong>{products.length}</strong>
          <span>Products</span>
        </div>
        <div className="stat-card">
          <strong>{orders.length}</strong>
          <span>Orders</span>
        </div>
        <div className="stat-card">
          <strong>{formatINR(revenue)}</strong>
          <span>Paid revenue</span>
        </div>
        <div className="stat-card">
          <strong>{pendingReviews}</strong>
          <span>Reviews to approve</span>
        </div>
      </div>

      <div className="admin-actions">
        <Link className="btn btn-primary" to="/admin/products">
          Manage products
        </Link>
        <Link className="btn btn-ghost" to="/admin/orders">
          Update order status
        </Link>
        <Link className="btn btn-ghost" to="/admin/billing">
          Open billing
        </Link>
        <Link className="btn btn-willow" to="/admin/handle">
          Handle & reels
        </Link>
      </div>

      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.customer}</td>
                <td>
                  <span className="status-pill">{o.status}</span>
                </td>
                <td>{formatINR(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
