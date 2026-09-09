import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminFormLayout from '../../components/admin/AdminFormLayout'
import AdminImageUpload from '../../components/admin/AdminImageUpload'
import { adminApi } from '../../services'

export default function AdminOfferForm() {
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
    image: '',
    discount: '',
    ctaText: '',
    ctaUrl: '',
    active: true,
    ordering: 0,
    startDate: '',
    endDate: ''
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (isEditing) {
      fetchOffer()
    }
  }, [id])

  const fetchOffer = async () => {
    try {
      const response = await adminApi.getOffers()
      const offer = response.data.find(o => o.id === id)
      if (offer) {
        setFormData({
          title: offer.title || '',
          description: offer.description || '',
          image: offer.image || '',
          discount: offer.discount ? String(offer.discount) : '',
          ctaText: offer.ctaText || '',
          ctaUrl: offer.ctaUrl || '',
          active: Boolean(offer.active),
          ordering: offer.ordering || 0,
          startDate: offer.startDate ? new Date(offer.startDate).toISOString().slice(0, 16) : '',
          endDate: offer.endDate ? new Date(offer.endDate).toISOString().slice(0, 16) : ''
        })
      } else {
        setGlobalError('Offer not found.')
      }
    } catch (error) {
      console.error('Failed to fetch offer:', error)
      setGlobalError('Failed to load offer.')
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
    if (!formData.image.trim()) errors.image = 'Image URL is required'
    if (!formData.discount || parseInt(formData.discount) < 1 || parseInt(formData.discount) > 100) errors.discount = 'Discount must be between 1 and 100'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    setGlobalError('')
    if (!validateForm()) {
      setGlobalError('Please fix the errors in the form before saving.')
      if (formErrors.title || formErrors.discount) setActiveTab('content')
      else if (formErrors.image) setActiveTab('media')
      return
    }

    setSubmitting(true)
    try {
      const submitData = {
        ...formData,
        discount: parseInt(formData.discount) || 0,
        ordering: parseInt(formData.ordering) || 0,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null
      }
      if (isEditing) {
        await adminApi.updateOffer(id, submitData)
      } else {
        await adminApi.createOffer(submitData)
      }
      navigate('/admin/offers')
    } catch (error) {
      setGlobalError(error.data?.message || 'Failed to save offer')
    } finally {
      setSubmitting(false)
    }
  }

  const tabs = [
    { id: 'content', label: 'Content' },
    { id: 'media', label: 'Media' },
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
      title={isEditing ? 'Edit Offer' : 'Create Offer'}
      subtitle={isEditing ? 'Update the details for this promotional offer' : 'Add a new promotional offer'}
      onBack={() => navigate('/admin/offers')}
      onSave={handleSave}
      onCancel={() => navigate('/admin/offers')}
      isSaving={submitting}
      saveText="Save Offer"
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
              <label className="form-label fw-bold">Description</label>
              <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows={3}></textarea>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Discount (%) *</label>
              <div className="input-group">
                <input type="number" className={`form-control ${formErrors.discount ? 'is-invalid' : ''}`} name="discount" value={formData.discount} onChange={handleChange} min="1" max="100" required />
                <span className="input-group-text">%</span>
              </div>
              {formErrors.discount && <div className="text-danger small mt-1">{formErrors.discount}</div>}
            </div>
            <div className="col-12 mt-4">
              <h6 className="fw-bold border-bottom pb-2">Call to Action</h6>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">CTA Text</label>
              <input type="text" className="form-control" name="ctaText" value={formData.ctaText} onChange={handleChange} placeholder="e.g. Shop Now" />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">CTA URL</label>
              <input type="text" className="form-control" name="ctaUrl" value={formData.ctaUrl} onChange={handleChange} placeholder="/shop" />
            </div>
          </div>
        </div>

        {/* Media Tab */}
        <div style={{ display: activeTab === 'media' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-12">
              <label className="form-label fw-bold">Image URL *</label>
              <AdminImageUpload
                value={formData.image}
                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                label="Offer Image"
              />
              {formErrors.image && <div className="invalid-feedback d-block">{formErrors.image}</div>}
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
            
            <div className="col-md-6">
              <div className="form-check form-switch fs-5 mt-4">
                <input type="checkbox" className="form-check-input" name="active" checked={formData.active} onChange={handleChange} id="active" />
                <label className="form-check-label text-success fw-bold ms-2" htmlFor="active">Active</label>
              </div>
              <div className="form-text ms-2 mt-1">If unchecked, the offer will not be displayed on the storefront.</div>
            </div>
            
            <div className="col-md-6">
              <label className="form-label fw-bold">Start Date (Optional)</label>
              <input type="datetime-local" className="form-control" name="startDate" value={formData.startDate} onChange={handleChange} />
              <div className="form-text">Offer will become active on this date (if status is Active).</div>
            </div>
            
            <div className="col-md-6">
              <label className="form-label fw-bold">End Date (Optional)</label>
              <input type="datetime-local" className="form-control" name="endDate" value={formData.endDate} onChange={handleChange} />
              <div className="form-text">Offer will expire on this date.</div>
            </div>
          </div>
        </div>

        {/* Publishing Tab */}
        <div style={{ display: activeTab === 'publishing' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-12">
              <div className="form-check form-switch fs-5">
                <input type="checkbox" className="form-check-input" name="active" checked={formData.active} onChange={handleChange} id="active" />
                <label className="form-check-label text-success fw-bold ms-2" htmlFor="active">Offer is Active</label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminFormLayout>
  )
}
