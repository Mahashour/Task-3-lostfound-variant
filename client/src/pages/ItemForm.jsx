import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

// TODO: build the Report Item page — see README.md "Your task".
// This page is already routed at /items/new (report) and /items/:id (edit),
// and both routes are wrapped in <ProtectedRoute>.

const defaults = { title: '', description: '', category: 'other', status: 'lost', location: '' }

export default function ItemForm() {
  const nav = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  // TODO (edit mode): when there is an `id`, load the item and fill the form.
  useEffect(() => {
    if (!id) return
    async function loadItem() {
      try {
        const res = await api.get(`/items/${id}`)
        const item = res.data.item || res.data
        setForm({
          title: item.title || '',
          status: item.status || 'lost',
          category: item.category || 'other',
          location: item.location || '',
          description: item.description || ''
        })
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load item')
      }
    }
    loadItem()
  }, [id])

  // TODO: update `form` when an input changes.
  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // TODO: POST a new item, or PATCH the existing one when editing,
  // then go back to /items. Show the server's error message on failure.
  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (id) {
        await api.patch(`/items/${id}`, form)
      } else {
        await api.post('/items', form)
      }
      nav('/items')
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred')
    }
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">{id ? 'Edit' : 'Report'} Item</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        {/* TODO: title input, status select, category select, location input and description textarea */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={onChange}
            className="input"
            placeholder="e.g. Black backpack"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Status</label>
          <select name="status" value={form.status} onChange={onChange} className="input">
            <option value="lost">Lost</option>
            <option value="found">Found</option>
            <option value="claimed">Claimed</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Category</label>
          <select name="category" value={form.category} onChange={onChange} className="input">
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="documents">Documents</option>
            <option value="accessories">Accessories</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Location (optional)</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={onChange}
            className="input"
            placeholder="e.g. Library 2nd floor"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Description (optional)</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            className="input h-24"
            placeholder="Provide more details..."
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="btn" type="submit">Save</button>
      </form>
    </div>
  )
}
