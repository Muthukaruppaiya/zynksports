import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { CATEGORIES, formatINR } from '../../data/store'

const blank = {
  id: '',
  name: '',
  category: 'bats',
  price: 999,
  mrp: 1299,
  rating: 4.5,
  reviews: 0,
  stock: 10,
  badge: '',
  image:
    '/media/ig-1.jpg',
  description: '',
}

export default function AdminProducts() {
  const { products, upsertProduct, removeProduct, showToast } = useApp()
  const [form, setForm] = useState(blank)

  function edit(p) {
    setForm({ ...p, badge: p.badge || '' })
  }

  function save(e) {
    e.preventDefault()
    const product = {
      ...form,
      id: form.id || `p${Date.now()}`,
      price: Number(form.price),
      mrp: Number(form.mrp),
      stock: Number(form.stock),
      badge: form.badge || null,
    }
    upsertProduct(product)
    showToast('Product saved')
    setForm(blank)
  }

  return (
    <div className="glass glass-panel admin-panel">
      <h2>Products</h2>
      <p className="muted">Add, edit or remove catalogue items for the storefront.</p>

      <form className="admin-form-grid" onSubmit={save}>
        <div className="field">
          <label>Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label>Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Price</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>
        <div className="field">
          <label>MRP</label>
          <input
            type="number"
            value={form.mrp}
            onChange={(e) => setForm({ ...form, mrp: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Stock</label>
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Badge</label>
          <input
            value={form.badge}
            onChange={(e) => setForm({ ...form, badge: e.target.value })}
            placeholder="Bestseller / New"
          />
        </div>
        <div className="field full">
          <label>Description</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="full">
          <button type="submit" className="btn btn-primary">
            {form.id ? 'Update product' : 'Add product'}
          </button>
        </div>
      </form>

      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{formatINR(p.price)}</td>
                <td>{p.stock}</td>
                <td>
                  <div className="inline-btns">
                    <button type="button" onClick={() => edit(p)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => removeProduct(p.id)}>
                      Delete
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
