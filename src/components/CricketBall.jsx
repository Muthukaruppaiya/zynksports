import './CricketBall.css'

export default function CricketBall({ size = 80, white = false, className = '' }) {
  return (
    <span
      className={`cball ${white ? 'white' : ''} ${className}`}
      style={{ '--s': `${size}px` }}
      aria-hidden="true"
    >
      <span className="cball-seam" />
      <span className="cball-shine" />
    </span>
  )
}
