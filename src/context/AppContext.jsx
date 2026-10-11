import { createContext, useContext, useMemo, useState } from 'react'
import {
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INVOICES,
  PRODUCTS,
  REEL_VIDEOS,
  STORE,
} from '../data/store'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [cart, setCart] = useState([])
  const [user, setUser] = useState({
    name: 'Guest Player',
    email: 'player@zynk.store',
    phone: '+91 90000 00000',
    loggedIn: false,
  })
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [reviews, setReviews] = useState(INITIAL_REVIEWS)
  const [products, setProducts] = useState(PRODUCTS)
  const [invoices, setInvoices] = useState(INVOICES)
  const [videos, setVideos] = useState(REEL_VIDEOS)
  const [activeVideo, setActiveVideo] = useState(REEL_VIDEOS[0])
  const [videoOpen, setVideoOpen] = useState(true)
  const [playerIndex, setPlayerIndex] = useState(null)
  const [toast, setToast] = useState(null)

  function openPlayer(index = 0) {
    setPlayerIndex(index)
  }

  function closePlayer() {
    setPlayerIndex(null)
  }

  function showToast(message) {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  function addToCart(product, qty = 1) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i,
        )
      }
      return [...prev, { ...product, qty }]
    })
    showToast(`${product.name} added to cart`)
  }

  function updateCartQty(id, qty) {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty } : i))
        .filter((i) => i.qty > 0),
    )
  }

  function clearCart() {
    setCart([])
  }

  function placeOrder() {
    if (!cart.length) return null
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0)
    const order = {
      id: `ZYN-${1046 + orders.length}`,
      date: new Date().toISOString().slice(0, 10),
      total,
      status: 'Placed',
      statusIndex: 0,
      items: cart.map((i) => ({
        productId: i.id,
        name: i.name,
        qty: i.qty,
        price: i.price,
      })),
      customer: user.name,
      phone: user.phone,
      address: 'Saved address — update in account',
    }
    setOrders((prev) => [order, ...prev])
    setInvoices((prev) => [
      {
        id: `INV-${2205 + prev.length}`,
        orderId: order.id,
        customer: order.customer,
        amount: total,
        tax: Math.round(total * 0.18),
        date: order.date,
        status: 'Pending',
        method: 'Online',
      },
      ...prev,
    ])
    clearCart()
    showToast(`Order ${order.id} placed`)
    return order
  }

  function updateOrderStatus(orderId, statusIndex, status) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, statusIndex, status } : o,
      ),
    )
  }

  function addReview(review) {
    const item = {
      id: `r${Date.now()}`,
      approved: false,
      date: new Date().toISOString().slice(0, 10),
      ...review,
    }
    setReviews((prev) => [item, ...prev])
    showToast('Review submitted for approval')
  }

  function toggleReview(id) {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved: !r.approved } : r)),
    )
  }

  function upsertProduct(product) {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id)
      if (exists) return prev.map((p) => (p.id === product.id ? product : p))
      return [product, ...prev]
    })
  }

  function removeProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  function login(name, email) {
    setUser({
      name: name || 'Zynk Player',
      email: email || 'player@zynk.store',
      phone: '+91 90000 00000',
      loggedIn: true,
    })
    showToast('Welcome back')
  }

  function logout() {
    setUser((u) => ({ ...u, loggedIn: false, name: 'Guest Player' }))
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  const value = useMemo(
    () => ({
      store: STORE,
      cart,
      cartCount,
      cartTotal,
      user,
      orders,
      reviews,
      products,
      invoices,
      videos,
      activeVideo,
      videoOpen,
      playerIndex,
      openPlayer,
      closePlayer,
      setPlayerIndex,
      toast,
      addToCart,
      updateCartQty,
      clearCart,
      placeOrder,
      updateOrderStatus,
      addReview,
      toggleReview,
      upsertProduct,
      removeProduct,
      login,
      logout,
      setActiveVideo,
      setVideoOpen,
      setVideos,
      showToast,
    }),
    [
      cart,
      cartCount,
      cartTotal,
      user,
      orders,
      reviews,
      products,
      invoices,
      videos,
      activeVideo,
      videoOpen,
      playerIndex,
      toast,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
