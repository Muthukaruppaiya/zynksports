import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { formatINR } from '../../data/store'

export default function AdminBilling() {
  const { invoices, showToast } = useApp()
  const [draft, setDraft] = useState({
    customer: '',
    amount: '',
    method: 'UPI',
  })

  const paid = invoices.filter((i) => i.status === 'Paid').reduce((s, i) => s + i.amount, 0)
  const pending = invoices.filter((i) => i.status === 'Pending').reduce((s, i) => s + i.amount, 0)

  function createInvoice(e) {
    e.preventDefault()
    showToast('Invoice draft created (wireframe)')
    setDraft({ customer: '', amount: '', method: 'UPI' })
  }

  return (
    <div className="glass glass-panel admin-panel">
      <h2>Billing software</h2>
      <p className="muted">
        Shop billing wireframe — invoices, GST estimate, payment status. Full build connects to
        printer / UPI / GST reports.
      </p>

      <div className="stat-grid">
        <div className="stat-card">
          <strong>{formatINR(paid)}</strong>
          <span>Collected</span>
        </div>
        <div className="stat-card">
          <strong>{formatINR(pending)}</strong>
          <span>Pending</span>
        </div>
        <div className="stat-card">
          <strong>{invoices.length}</strong>
          <span>Invoices</span>
        </div>
        <div className="stat-card">
          <strong>18%</strong>
          <span>GST model</span>
        </div>
      </div>

      <form className="admin-form-grid" onSubmit={createInvoice}>
        <div className="field">
          <label>Customer</label>
          <input
            value={draft.customer}
            onChange={(e) => setDraft({ ...draft, customer: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label>Amount (₹)</label>
          <input
            type="number"
            value={draft.amount}
            onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label>Method</label>
          <select
            value={draft.method}
            onChange={(e) => setDraft({ ...draft, method: e.target.value })}
          >
            <option>UPI</option>
            <option>Card</option>
            <option>Cash</option>
            <option>COD</option>
          </select>
        </div>
        <div className="field" style={{ justifyContent: 'end' }}>
          <label>&nbsp;</label>
          <button type="submit" className="btn btn-primary">
            Create invoice
          </button>
        </div>
      </form>

      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Order</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Tax</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.id}</td>
                <td>{inv.orderId}</td>
                <td>{inv.customer}</td>
                <td>{formatINR(inv.amount)}</td>
                <td>{formatINR(inv.tax)}</td>
                <td>{inv.method}</td>
                <td>
                  <span className={`status-pill ${inv.status === 'Paid' ? 'ok' : 'warn'}`}>
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
