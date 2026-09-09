import { useConfirm } from './ConfirmProvider.jsx'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import useWow from '../../hooks/useWow.js'
import { adminApi } from '../../services'

const createCMSAdmin = ({ entityName, apiEndpoints, fields, listColumns }) => {
  return function CMSAdminPage() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    useWow()

    const initialFormData = fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || ''
      return acc
    }, {})

    useEffect(() => {
      fetchItems()
    }, [])

    const fetchItems = async () => {
      setLoading(true)
      try {
        const response = await adminApi[apiEndpoints.getAll]()
        setItems(response.data)
      } catch (error) {
        console.error(`Failed to fetch ${entityName}:`, error)
      } finally {
        setLoading(false)
      }
    }

    const openCreateModal = () => {
      setEditingItem(null)
      setFormData(initialFormData)
      setFormErrors({})
      setShowModal(true)
    }

    const openEditModal = (item) => {
      setEditingItem(item)
      setFormData(item)
      setFormErrors({})
      setShowModal(true)
    }

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }

    const validateForm = () => {
      const errors = {}
      fields.forEach(field => {
        if (field.required && (!formData[field.name] || (typeof formData[field.name] === 'string' && !formData[field.name].trim()))) {
          errors[field.name] = `${field.label} is required`
        }
      })
      setFormErrors(errors)
      return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      if (!validateForm()) return

      setSubmitting(true)
      try {
        if (editingItem) {
          await adminApi[apiEndpoints.update](editingItem.id, formData)
        } else {
          await adminApi[apiEndpoints.create](formData)
        }
        setShowModal(false)
        fetchItems()
      } catch (error) {
        setFormErrors({ submit: error.data?.message || `Failed to save ${entityName}` })
      } finally {
        setSubmitting(false)
      }
    }

    const handleDelete = async (id) => {
      if (!await confirm(`Are you sure you want to delete this ${entityName}?`)) return
      try {
        await adminApi[apiEndpoints.delete](id)
        fetchItems()
      } catch (error) {
        toast.error(error.data?.message || `Failed to delete ${entityName}`)
      }
    }

    const handleReorder = async (e) => {
      if (!apiEndpoints.reorder) return
      try {
        const ids = Array.from(e.target.querySelectorAll('[data-id]')).map(el => el.dataset.id)
        await adminApi[apiEndpoints.reorder](ids)
        fetchItems()
      } catch (error) {
        toast.error(error.data?.message || 'Failed to reorder')
      }
    }

    return (
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">{entityName}</h4>
          <button className="btn btn-primary" onClick={openCreateModal}>
            <i className="fas fa-plus me-2"></i> Add {entityName.slice(0, -1)}
          </button>
        </div>

        <div className="bg-white rounded shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  {listColumns.map(col => <th key={col.key}>{col.label}</th>)}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={listColumns.length + 1} className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></td></tr>
                ) : items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id} data-id={item.id}>
                      {listColumns.map(col => (
                        <td key={col.key}>
                          {col.render ? col.render(item) : item[col.key]}
                        </td>
                      ))}
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary" onClick={() => openEditModal(item)} title="Edit"><i className="fas fa-edit"></i></button>
                          <button className="btn btn-outline-danger" onClick={() => handleDelete(item.id)} title="Delete"><i className="fas fa-trash"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={listColumns.length + 1} className="text-center py-4 text-muted">No {entityName.toLowerCase()} found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal fade" id={`${entityName.toLowerCase()}Modal`} tabIndex="-1" show={showModal} onHide={() => setShowModal(false)}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{editingItem ? `Edit ${entityName.slice(0, -1)}` : `Add ${entityName.slice(0, -1)}`}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  {formErrors.submit && <div className="alert alert-danger mb-3">{formErrors.submit}</div>}
                  {fields.map(field => (
                    <div key={field.name} className="mb-3">
                      <label className="form-label">{field.label} {field.required && <span className="text-danger">*</span>}</label>
                      {field.type === 'textarea' ? (
                        <textarea className={`form-control ${formErrors[field.name] ? 'is-invalid' : ''}`} name={field.name} value={formData[field.name]} onChange={handleChange} rows={4}></textarea>
                      ) : field.type === 'select' ? (
                        <select className={`form-select ${formErrors[field.name] ? 'is-invalid' : ''}`} name={field.name} value={formData[field.name]} onChange={handleChange}>
                          {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                      ) : field.type === 'checkbox' ? (
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" name={field.name} checked={formData[field.name]} onChange={handleChange} id={field.name} />
                          <label className="form-check-label" htmlFor={field.name}>{field.label}</label>
                        </div>
                      ) : (
                        <input type={field.type || 'text'} className={`form-control ${formErrors[field.name] ? 'is-invalid' : ''}`} name={field.name} value={formData[field.name]} onChange={handleChange} placeholder={field.placeholder} />
                      )}
                      {formErrors[field.name] && <div className="invalid-feedback">{formErrors[field.name]}</div>}
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default createCMSAdmin
