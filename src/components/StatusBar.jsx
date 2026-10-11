import { ORDER_STATUSES } from '../data/store'
import './StatusBar.css'

export default function StatusBar({ statusIndex = 0, compact = false }) {
  return (
    <div className={`status-bar ${compact ? 'compact' : ''}`}>
      {ORDER_STATUSES.map((label, i) => {
        const done = i <= statusIndex
        const current = i === statusIndex
        return (
          <div key={label} className={`status-step ${done ? 'done' : ''} ${current ? 'current' : ''}`}>
            <div className="status-dot" />
            {!compact && <span>{label}</span>}
            {compact && current && <span className="status-compact-label">{label}</span>}
            {i < ORDER_STATUSES.length - 1 && <div className="status-line" />}
          </div>
        )
      })}
    </div>
  )
}
