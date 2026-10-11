import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  Receipt,
  Clapperboard,
  ArrowLeft,
} from 'lucide-react'
import './Admin.css'

const links = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/billing', label: 'Billing', icon: Receipt },
  { to: '/admin/handle', label: 'Handle & Reels', icon: Clapperboard },
]

export default function AdminLayout() {
  return (
    <section className="section admin-section">
      <div className="container admin-shell">
        <aside className="glass glass-panel admin-nav">
          <div className="admin-brand">
            <strong>ZYNK Admin</strong>
            <span>Management portal</span>
          </div>
          <nav>
            {links.map(({ to, end, label, icon: Icon }) => (
              <NavLink key={to} to={to} end={end}>
                <Icon size={16} /> {label}
              </NavLink>
            ))}
          </nav>
          <NavLink to="/" className="back-store">
            <ArrowLeft size={16} /> Back to store
          </NavLink>
        </aside>
        <div className="admin-main">
          <Outlet />
        </div>
      </div>
    </section>
  )
}
