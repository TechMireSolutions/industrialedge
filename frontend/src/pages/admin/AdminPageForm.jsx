import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminFormLayout from '../../components/admin/AdminFormLayout'
import { adminApi } from '../../services'

export default function AdminPageForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [activeTab, setActiveTab] = useState('content')
  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [globalError, setGlobalError] = useState('')
  
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    active: true
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (isEditing) {
      fetchPage()
    }
  }, [id])

  const fetchPage = async () => {
    try {
      const response = await adminApi.getPages()
      const page = response.data.find(p => p.id === id)
      if (page) {
        setFormData({
          slug: page.slug || '',
          title: page.title || '',
          content: page.content || '',
          active: Boolean(page.active)
        })
      } else {
        setGlobalError('Page not found.')
      }
    } catch (error) {
      console.error('Failed to fetch page:', error)
      setGlobalError('Failed to load page.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: type === 'checkbox' ? checked : value }
      if (name === 'title') {
        newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      } else if (name === 'slug') {
        newData.slug = value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      }
      return newData
    })
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.title.trim()) errors.title = 'Title is required'
    if (!formData.slug.trim()) errors.slug = 'Slug is required'
    if (!formData.content.trim()) errors.content = 'Content is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    setGlobalError('')
    if (!validateForm()) {
      setGlobalError('Please fix the errors in the form before saving.')
      if (formErrors.title || formErrors.content) setActiveTab('content')
      else if (formErrors.slug) setActiveTab('settings')
      return
    }

    setSubmitting(true)
    try {
      if (isEditing) {
        await adminApi.updatePage(id, formData)
      } else {
        await adminApi.createPage(formData)
      }
      navigate('/admin/pages')
    } catch (error) {
      setGlobalError(error.data?.message || 'Failed to save page')
    } finally {
      setSubmitting(false)
    }
  }

  const tabs = [
    { id: 'content', label: 'Content' },
    { id: 'settings', label: 'Settings' },
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
      title={isEditing ? 'Edit Page' : 'Create Page'}
      subtitle={isEditing ? 'Update the content for this custom page' : 'Create a new custom content page'}
      onBack={() => navigate('/admin/pages')}
      onSave={handleSave}
      onCancel={() => navigate('/admin/pages')}
      isSaving={submitting}
      saveText="Save Page"
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
              <label className="form-label fw-bold">Content (HTML) *</label>
              <textarea className={`form-control ${formErrors.content ? 'is-invalid' : ''}`} name="content" value={formData.content} onChange={handleChange} rows={15} required></textarea>
              {formErrors.content && <div className="invalid-feedback">{formErrors.content}</div>}
            </div>
          </div>
        </div>

        {/* Settings Tab */}
        <div style={{ display: activeTab === 'settings' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">Slug URL *</label>
              <div className="input-group">
                <span className="input-group-text">/page/</span>
                <input type="text" className={`form-control ${formErrors.slug ? 'is-invalid' : ''}`} name="slug" value={formData.slug} onChange={handleChange} placeholder="e.g. about-us" required />
                {formErrors.slug && <div className="invalid-feedback">{formErrors.slug}</div>}
              </div>
              <div className="form-text mt-1">Lowercase, alphanumeric with hyphens only (e.g., 'about-us').</div>
            </div>
          </div>
        </div>

        {/* Publishing Tab */}
        <div style={{ display: activeTab === 'publishing' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-12">
              <div className="form-check form-switch fs-5">
                <input type="checkbox" className="form-check-input" name="active" checked={formData.active} onChange={handleChange} id="active" />
                <label className="form-check-label text-success fw-bold ms-2" htmlFor="active">Page is Active (Visible to users)</label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminFormLayout>
  )
}
