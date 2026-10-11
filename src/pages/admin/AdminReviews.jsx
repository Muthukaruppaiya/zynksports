import { useApp } from '../../context/AppContext'

export default function AdminReviews() {
  const { reviews, toggleReview } = useApp()

  return (
    <div className="glass glass-panel admin-panel">
      <h2>Reviews moderation</h2>
      <p className="muted">Approve reviews before they appear on the public website.</p>

      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.product}</td>
                <td>{r.rating}★</td>
                <td style={{ maxWidth: 280 }}>{r.text}</td>
                <td>
                  <span className={`status-pill ${r.approved ? 'ok' : 'warn'}`}>
                    {r.approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td>
                  <button type="button" className="chip-btn" onClick={() => toggleReview(r.id)}>
                    {r.approved ? 'Hide' : 'Approve'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
