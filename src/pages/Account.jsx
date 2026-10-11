import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './Account.css'

export default function Account() {
  const { user, login, logout, orders } = useApp()
  const [name, setName] = useState('Arjun Mehta')
  const [email, setEmail] = useState('arjun@email.com')

  return (
    <section className="section">
      <div className="container account-grid">
        <div className="glass glass-panel account-card">
          <span className="eyebrow">Account</span>
          <h2>{user.loggedIn ? `Hey, ${user.name}` : 'Player login'}</h2>
          <p className="muted">
            Wireframe auth — full build will use secure sessions (JWT / OAuth).
          </p>

          {!user.loggedIn ? (
            <form
              className="account-form"
              onSubmit={(e) => {
                e.preventDefault()
                login(name, email)
              }}
            >
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Sign in
              </button>
            </form>
          ) : (
            <div className="profile-block">
              <div>
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>
              <div>
                <span>Phone</span>
                <strong>{user.phone}</strong>
              </div>
              <div>
                <span>Orders</span>
                <strong>{orders.length}</strong>
              </div>
              <button type="button" className="btn btn-ghost" onClick={logout}>
                Sign out
              </button>
            </div>
          )}
        </div>

        <div className="glass glass-panel account-card">
          <span className="eyebrow">Quick links</span>
          <h2>Manage your game</h2>
          <div className="quick-links">
            <Link to="/orders">Order history & status</Link>
            <Link to="/cart">Open cart</Link>
            <Link to="/reviews">Write a review</Link>
            <Link to="/admin">Admin / Billing portal</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
