import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminFormLayout from '../../components/admin/AdminFormLayout'
import AdminImageUpload from '../../components/admin/AdminImageUpload'
import { adminApi } from '../../services'

export default function AdminBannerForm() {
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
    ordering: 0
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (isEditing) {
      fetchBanner()
    }
  }, [id])

  const fetchBanner = async () => {
    try {
      const response = await adminApi.getBanners()
      // getBanners returns all, need to find the specific one since no getById
      const banner = response.data.find(b => b.id === id)
      if (banner) {
        setFormData({
          title: banner.title || '',
          description: banner.description || '',
          image: banner.image || '',
          discount: banner.discount ? String(banner.discount) : '',
          ctaText: banner.ctaText || '',
          ctaUrl: banner.ctaUrl || '',
          active: Boolean(banner.active),
          ordering: banner.ordering || 0
        })
      } else {
        setGlobalError('Banner not found.')
      }
    } catch (error) {
      console.error('Failed to fetch banner:', error)
      setGlobalError('Failed to load banner.')
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
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    setGlobalError('')
    if (!validateForm()) {
      setGlobalError('Please fix the errors in the form before saving.')
      if (formErrors.title) setActiveTab('content')
      else if (formErrors.image) setActiveTab('media')
      return
    }

    setSubmitting(true)
    try {
      const submitData = {
        ...formData,
        discount: formData.discount ? parseInt(formData.discount) : null,
        ordering: parseInt(formData.ordering) || 0
      }
      if (isEditing) {
        await adminApi.updateBanner(id, submitData)
      } else {
        await adminApi.createBanner(submitData)
      }
      navigate('/admin/banners')
    } catch (error) {
      setGlobalError(error.data?.message || 'Failed to save banner')
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
      title={isEditing ? 'Edit Banner' : 'Create Banner'}
      subtitle={isEditing ? 'Update the details for this promotional banner' : 'Add a new promotional banner'}
      onBack={() => navigate('/admin/banners')}
      onSave={handleSave}
      onCancel={() => navigate('/admin/banners')}
      isSaving={submitting}
      saveText="Save Banner"
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
              <label className="form-label fw-bold">Discount (%)</label>
              <div className="input-group">
                <input type="number" className="form-control" name="discount" value={formData.discount} onChange={handleChange} min="0" max="100" />
                <span className="input-group-text">%</span>
              </div>
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
                label="Banner Image"
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
          </div>
        </div>

        {/* Publishing Tab */}
        <div style={{ display: activeTab === 'publishing' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-12">
              <div className="form-check form-switch fs-5">
                <input type="checkbox" className="form-check-input" name="active" checked={formData.active} onChange={handleChange} id="active" />
                <label className="form-check-label text-success fw-bold ms-2" htmlFor="active">Banner is Active</label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminFormLayout>
  )
}
