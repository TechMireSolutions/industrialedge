import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminFormLayout from '../../components/admin/AdminFormLayout'
import AdminImageUpload from '../../components/admin/AdminImageUpload'
import { adminApi, categoryApi } from '../../services'

export default function AdminCategoryForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [globalError, setGlobalError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    active: true
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (isEditing) {
      fetchCategory()
    }
  }, [id])

  const fetchCategory = async () => {
    try {
      const response = await categoryApi.getById(id)
      const category = response.data || response
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        image: category.image || '',
        active: Boolean(category.active)
      })
    } catch (error) {
      console.error('Failed to fetch category:', error)
      setGlobalError('Failed to load category. It may have been deleted.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: type === 'checkbox' ? checked : value }
      if (name === 'name') {
        newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      } else if (name === 'slug') {
        newData.slug = value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      }
      return newData
    })
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.slug.trim()) errors.slug = 'Slug is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    setGlobalError('')
    if (!validateForm()) {
      setGlobalError('Please fix the errors in the form before saving.')
      setActiveTab('general')
      return
    }

    setSubmitting(true)
    try {
      const submitData = { ...formData }
      if (isEditing) {
        await adminApi.updateCategory(id, submitData)
      } else {
        await adminApi.createCategory(submitData)
      }
      navigate('/admin/categories')
    } catch (error) {
      setGlobalError(error.data?.message || 'Failed to save category')
    } finally {
      setSubmitting(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'media', label: 'Media' },
    { id: 'seo', label: 'SEO' },
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
      title={isEditing ? 'Edit Category' : 'Create Category'}
      subtitle={isEditing ? 'Update the details for this category' : 'Add a new category to your catalog'}
      onBack={() => navigate('/admin/categories')}
      onSave={handleSave}
      onCancel={() => navigate('/admin/categories')}
      isSaving={submitting}
      saveText="Save Category"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      error={globalError}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        {/* General Tab */}
        <div style={{ display: activeTab === 'general' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">Name *</label>
              <input type="text" className={`form-control ${formErrors.name ? 'is-invalid' : ''}`} name="name" value={formData.name} onChange={handleChange} required />
              {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Slug *</label>
              <input type="text" className={`form-control ${formErrors.slug ? 'is-invalid' : ''}`} name="slug" value={formData.slug} onChange={handleChange} required />
              {formErrors.slug && <div className="invalid-feedback">{formErrors.slug}</div>}
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Description</label>
              <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows={5}></textarea>
            </div>
          </div>
        </div>

        {/* Media Tab */}
        <div style={{ display: activeTab === 'media' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-12">
              <label className="form-label fw-bold">Category Image</label>
              <AdminImageUpload
                value={formData.image}
                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                label="Category Image"
              />
              {formErrors.image && <div className="text-danger small">{formErrors.image}</div>}
            </div>
          </div>
        </div>

        {/* SEO Tab */}
        <div style={{ display: activeTab === 'seo' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-12">
              <div className="alert alert-info border-0 shadow-sm rounded">
                <i className="fas fa-info-circle me-2"></i> Dedicated SEO fields (Meta Title, Meta Description) are not currently available in the database schema. The category name and description will be used automatically for SEO purposes.
              </div>
            </div>
            <div className="col-md-12">
              <label className="form-label fw-bold text-muted">URL Slug (Auto-generated from name)</label>
              <input type="text" className="form-control" value={formData.slug} disabled />
            </div>
          </div>
        </div>

        {/* Publishing Tab */}
        <div style={{ display: activeTab === 'publishing' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-12">
              <div className="form-check form-switch fs-5">
                <input type="checkbox" className="form-check-input" name="active" checked={formData.active} onChange={handleChange} id="active" />
                <label className="form-check-label text-success fw-bold ms-2" htmlFor="active">Category is Active</label>
              </div>
              <div className="form-text ms-2 mt-1">If unchecked, the category and its products may be hidden from storefront navigation.</div>
            </div>
          </div>
        </div>
      </form>
    </AdminFormLayout>
  )
}
