import { useConfirm } from '../../components/admin/ConfirmProvider.jsx'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import useWow from '../../hooks/useWow.js'
import { adminApi } from '../../services'

export default function AdminFooter() {
  const confirm = useConfirm()
  const [footerContents, setFooterContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingContent, setEditingContent] = useState(null)
  const [formData, setFormData] = useState({ section: '', title: '', content: {}, active: true, ordering: 0 })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  useWow()

  useEffect(() => {
    fetchFooterContents()
  }, [])

  const fetchFooterContents = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getFooter()
      setFooterContents(response.data)
    } catch (error) {
      console.error('Failed to fetch footer contents:', error)
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingContent(null)
    setFormData({ section: '', title: '', content: {}, active: true, ordering: footerContents.length })
    setFormErrors({})
    setShowModal(true)
  }

  const openEditModal = (content) => {
    setEditingContent(content)
    setFormData({ ...content, content: JSON.stringify(content.content, null, 2) })
    setFormErrors({})
    setShowModal(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.section.trim()) errors.section = 'Section is required'
    if (!formData.title.trim()) errors.title = 'Title is required'
    try {
      JSON.parse(formData.content)
    } catch {
      errors.content = 'Content must be valid JSON'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    try {
      const submitData = {
        ...formData,
        content: JSON.parse(formData.content),
      }
      if (editingContent) {
        await adminApi.updateFooter(editingContent.id, submitData)
      } else {
        await adminApi.createFooter(submitData)
      }
      setShowModal(false)
      fetchFooterContents()
    } catch (error) {
      setFormErrors({ submit: error.data?.message || 'Failed to save footer content' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!await confirm('Are you sure you want to delete this footer content?')) return
    try {
      await adminApi.deleteFooter(id)
      fetchFooterContents()
    } catch (error) {
      toast.error(error.data?.message || 'Failed to delete footer content')
    }
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <span style={{ fontFamily: "Outfit", fontWeight: "800", fontSize: "24px" }}>Footer Content</span>
        </h4>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <i className="fas fa-plus me-2"></i> Add Footer Section
        </button>
      </div>

      <div className="bg-white rounded shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Section</th>
                <th>Title</th>
                <th>Content Preview</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></td></tr>
              ) : footerContents.length > 0 ? (
                footerContents.map((content) => (
                  <tr key={content.id}>
                    <td><code>{content.section}</code></td>
                    <td>{content.title}</td>
                    <td>
                      <pre className="mb-0 small" style={{ maxHeight: 100, overflow: 'auto' }}>{JSON.stringify(content.content, null, 2)}</pre>
                    </td>
                    <td><span className={`badge bg-${content.active ? 'success' : 'secondary'}`}>{content.active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => openEditModal(content)} title="Edit"><i className="fas fa-edit"></i></button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(content.id)} title="Delete"><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center py-4 text-muted">No footer content found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="modal fade" id="footerModal" tabIndex="-1" show={showModal} onHide={() => setShowModal(false)}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{editingContent ? 'Edit Footer Content' : 'Add Footer Content'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {formErrors.submit && <div className="alert alert-danger mb-3">{formErrors.submit}</div>}
                <div className="mb-3">
                  <label className="form-label">Section *</label>
                  <input type="text" className={`form-control ${formErrors.section ? 'is-invalid' : ''}`} name="section" value={formData.section} onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))} required />
                  {formErrors.section && <div className="invalid-feedback">{formErrors.section}</div>}
                  <div className="form-text">Unique identifier (e.g., contact, customer-service, information, extras)</div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Title *</label>
                  <input type="text" className={`form-control ${formErrors.title ? 'is-invalid' : ''}`} name="title" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} required />
                  {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Content (JSON) *</label>
                  <textarea className={`form-control ${formErrors.content ? 'is-invalid' : ''}`} name="content" value={formData.content} onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))} rows={10} required></textarea>
                  {formErrors.content && <div className="invalid-feedback">{formErrors.content}</div>}
                  <div className="form-text">
                    Enter valid JSON. Example: {`{"links":[{"label":"Contact Us","url":"/contact"}]}`}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Ordering</label>
                    <input type="number" className="form-control" name="ordering" value={formData.ordering} onChange={(e) => setFormData(prev => ({ ...prev, ordering: parseInt(e.target.value) || 0 }))} />
                  </div>
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" name="active" checked={formData.active} onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))} id="active" />
                    <label className="form-check-label" htmlFor="active">Active</label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Saving...' : (editingContent ? 'Update' : 'Create')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
