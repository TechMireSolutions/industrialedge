import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminFormLayout from '../../components/admin/AdminFormLayout'
import { adminApi } from '../../services'

export default function AdminServiceForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [activeTab, setActiveTab] = useState('content')
  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [globalError, setGlobalError] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    active: true,
    ordering: 0
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (isEditing) {
      fetchService()
    }
  }, [id])

  const fetchService = async () => {
    try {
      const response = await adminApi.getServices()
      const service = response.data.find(s => s.id === id)
      if (service) {
        setFormData({
          title: service.title || '',
          description: service.description || '',
          icon: service.icon || '',
          active: Boolean(service.active),
          ordering: service.ordering || 0
        })
      } else {
        setGlobalError('Service not found.')
      }
    } catch (error) {
      console.error('Failed to fetch service:', error)
      setGlobalError('Failed to load service.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.title.trim()) errors.title = 'Title is required'
    if (!formData.description.trim()) errors.description = 'Description is required'
    if (!formData.icon.trim()) errors.icon = 'Icon class is required (e.g., fa fa-sync-alt)'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    setGlobalError('')
    if (!validateForm()) {
      setGlobalError('Please fix the errors in the form before saving.')
      if (formErrors.title || formErrors.description) setActiveTab('content')
      else if (formErrors.icon) setActiveTab('media')
      return
    }

    setSubmitting(true)
    try {
      const submitData = {
        ...formData,
        ordering: parseInt(formData.ordering) || 0
      }
      if (isEditing) {
        await adminApi.updateService(id, submitData)
      } else {
        await adminApi.createService(submitData)
      }
      navigate('/admin/services')
    } catch (error) {
      setGlobalError(error.data?.message || 'Failed to save service')
    } finally {
      setSubmitting(false)
    }
  }

  const tabs = [
    { id: 'content', label: 'Content' },
    { id: 'media', label: 'Icon' },
    { id: 'display', label: 'Display' },
    { id: 'publishing', label: 'Publishing' }
  ]

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    )
  }

  return (
    <AdminFormLayout
      title={isEditing ? 'Edit Service' : 'Create Service'}
      subtitle={isEditing ? 'Update the details for this service highlight' : 'Add a new service highlight (e.g., Free Shipping)'}
      onBack={() => navigate('/admin/services')}
      onSave={handleSave}
      onCancel={() => navigate('/admin/services')}
      isSaving={submitting}
      saveText="Save Service"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      error={globalError}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Content Tab */}
        <div style={{ display: activeTab === 'content' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-12">
              <label className="form-label fw-bold">Title *</label>
              <input type="text" className={`form-control ${formErrors.title ? 'is-invalid' : ''}`} name="title" value={formData.title} onChange={handleChange} required />
              {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Description *</label>
              <textarea className={`form-control ${formErrors.description ? 'is-invalid' : ''}`} name="description" value={formData.description} onChange={handleChange} rows={3} required></textarea>
              {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
            </div>
          </div>
        </div>

        {/* Media (Icon) Tab */}
        <div style={{ display: activeTab === 'media' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">FontAwesome Icon Class *</label>
              <div className="input-group">
                <span className="input-group-text"><i className={formData.icon || 'fas fa-question'}></i></span>
                <input type="text" className={`form-control ${formErrors.icon ? 'is-invalid' : ''}`} name="icon" value={formData.icon} onChange={handleChange} placeholder="e.g. fas fa-shipping-fast" required />
              </div>
              <div className="form-text">Enter the full class name for the icon (e.g. 'fas fa-shipping-fast', 'fas fa-undo-alt').</div>
              {formErrors.icon && <div className="text-danger small mt-1">{formErrors.icon}</div>}
            </div>
          </div>
        </div>

        {/* Display Tab */}
        <div style={{ display: activeTab === 'display' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">Ordering</label>
              <input type="number" className="form-control" name="ordering" value={formData.ordering} onChange={handleChange} />
              <div className="form-text">Lower numbers appear first.</div>
            </div>
          </div>
        </div>

        {/* Publishing Tab */}
        <div style={{ display: activeTab === 'publishing' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-12">
              <div className="form-check form-switch fs-5">
                <input type="checkbox" className="form-check-input" name="active" checked={formData.active} onChange={handleChange} id="active" />
                <label className="form-check-label text-success fw-bold ms-2" htmlFor="active">Service is Active</label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminFormLayout>
  )
}
