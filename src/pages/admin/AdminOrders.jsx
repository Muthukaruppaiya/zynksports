import StatusBar from '../../components/StatusBar'
import { useApp } from '../../context/AppContext'
import { ORDER_STATUSES, formatINR } from '../../data/store'

export default function AdminOrders() {
  const { orders, updateOrderStatus, showToast } = useApp()

  function advance(order) {
    const next = Math.min(order.statusIndex + 1, ORDER_STATUSES.length - 1)
    updateOrderStatus(order.id, next, ORDER_STATUSES[next])
    showToast(`${order.id} → ${ORDER_STATUSES[next]}`)
  }

  function setStatus(order, index) {
    updateOrderStatus(order.id, index, ORDER_STATUSES[index])
    showToast(`${order.id} → ${ORDER_STATUSES[index]}`)
  }

  return (
    <div className="glass glass-panel admin-panel">
      <h2>Orders</h2>
      <p className="muted">Update fulfilment status — mirrors the customer status bar.</p>

      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status bar</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>
                  <strong>{o.id}</strong>
                  <div className="muted">{o.date}</div>
                </td>
                <td>
                  {o.customer}
                  <div className="muted">{o.phone}</div>
                </td>
                <td>{formatINR(o.total)}</td>
                <td style={{ minWidth: 280 }}>
                  <StatusBar statusIndex={o.statusIndex} compact />
                </td>
                <td>
                  <div className="inline-btns">
                    {ORDER_STATUSES.map((s, i) => (
                      <button
                        key={s}
                        type="button"
                        className={o.statusIndex === i ? 'chip-btn active' : 'chip-btn'}
                        onClick={() => setStatus(o, i)}
                      >
                        {s}
                      </button>
                    ))}
                    <button type="button" onClick={() => advance(o)}>
                      Advance →
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
