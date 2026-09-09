import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { adminApi } from '../../services'
import AdminFormLayout from '../../components/admin/AdminFormLayout'
import AdminImageUpload from '../../components/admin/AdminImageUpload'

export default function AdminHeroSlideForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const initialFormState = {
    imageId: null,
    image: '',
    backgroundImageId: null,
    backgroundImage: '',
    imageAlt: '',
    titleLine1: '',
    titleLine2: '',
    titleLine3: '',
    eyebrowText: '',
    showEyebrow: true,
    description: '',
    primaryButtonText: '',
    primaryButtonUrl: '',
    showPrimaryCTA: true,
    secondaryButtonText: '',
    secondaryButtonUrl: '',
    showSecondaryCTA: true,
    active: true,
    ordering: 0
  }

  const [formData, setFormData] = useState(initialFormState)
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(isEditing)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('content')
  const [globalError, setGlobalError] = useState('')

  useEffect(() => {
    if (isEditing) {
      fetchSlide()
    }
  }, [id])

  const fetchSlide = async () => {
    try {
      const response = await adminApi.getHeroSlide(id)
      const slide = response.data || response
      setFormData({
        imageId: slide.imageId || null,
        image: slide.image || '',
        backgroundImageId: slide.backgroundImageId || null,
        backgroundImage: slide.backgroundImage || '',
        imageAlt: slide.imageAlt || '',
        titleLine1: slide.titleLine1 || '',
        titleLine2: slide.titleLine2 || '',
        titleLine3: slide.titleLine3 || '',
        eyebrowText: slide.eyebrowText || '',
        showEyebrow: slide.showEyebrow !== false,
        description: slide.description || '',
        primaryButtonText: slide.primaryButtonText || '',
        primaryButtonUrl: slide.primaryButtonUrl || '',
        showPrimaryCTA: slide.showPrimaryCTA !== false,
        secondaryButtonText: slide.secondaryButtonText || '',
        secondaryButtonUrl: slide.secondaryButtonUrl || '',
        showSecondaryCTA: slide.showSecondaryCTA !== false,
        active: slide.active !== false,
        ordering: slide.ordering || 0
      })
    } catch (error) {
      console.error('Failed to fetch hero slide:', error)
      setGlobalError('Failed to load slide. It may have been deleted.')
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
    if (!formData.titleLine1?.trim() && !formData.titleLine2?.trim() && !formData.titleLine3?.trim()) {
      errors.titleLine1 = 'At least one title line is required'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    setGlobalError('')
    if (!validateForm()) {
      setGlobalError('Please fix the errors in the form before saving.')
      if (formErrors.titleLine1) setActiveTab('content')
      return
    }

    setSubmitting(true)
    try {
      if (isEditing) {
        await adminApi.updateHeroSlide(id, formData)
      } else {
        await adminApi.createHeroSlide(formData)
      }
      navigate('/admin/hero-slides')
    } catch (error) {
      setGlobalError(error.data?.message || 'Failed to save hero slide')
    } finally {
      setSubmitting(false)
    }
  }

  const tabs = [
    { id: 'content', label: 'Content' },
    { id: 'media', label: 'Media' },
    { id: 'ctas', label: 'CTAs' },
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
      title={isEditing ? 'Edit Hero Slide' : 'Create Hero Slide'}
      subtitle={isEditing ? 'Update the details for this slide' : 'Add a new hero slide to the homepage'}
      onBack={() => navigate('/admin/hero-slides')}
      onSave={handleSave}
      onCancel={() => navigate('/admin/hero-slides')}
      isSaving={submitting}
      saveText="Save Hero Slide"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      error={globalError}
    >
      <form onSubmit={(e) => e.preventDefault()}>

        {/* Content Tab */}
        <div style={{ display: activeTab === 'content' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">Eyebrow Text</label>
              <input type="text" className="form-control" name="eyebrowText" value={formData.eyebrowText} onChange={handleChange} />
            </div>
            <div className="col-md-6 d-flex align-items-end pb-2">
              <div className="form-check form-switch fs-5">
                <input type="checkbox" className="form-check-input" name="showEyebrow" checked={formData.showEyebrow} onChange={handleChange} id="showEyebrow" />
                <label className="form-check-label fw-bold ms-2" htmlFor="showEyebrow">Show Eyebrow</label>
              </div>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold">Title Line 1 <span className="badge bg-secondary ms-1">White</span></label>
              <input type="text" className={`form-control ${formErrors.titleLine1 ? 'is-invalid' : ''}`} name="titleLine1" value={formData.titleLine1} onChange={handleChange} />
              {formErrors.titleLine1 && <div className="invalid-feedback">{formErrors.titleLine1}</div>}
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Title Line 2 <span className="badge bg-secondary ms-1">White</span></label>
              <input type="text" className="form-control" name="titleLine2" value={formData.titleLine2} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Title Line 3 <span className="badge" style={{ background: 'linear-gradient(90deg, #6b46c1, #a78bfa)' }}>Purple</span></label>
              <input type="text" className="form-control" name="titleLine3" value={formData.titleLine3} onChange={handleChange} />
            </div>

            <div className="col-12">
              <label className="form-label fw-bold">Description</label>
              <textarea className="form-control" name="description" rows="3" value={formData.description} onChange={handleChange}></textarea>
            </div>
          </div>
        </div>

        {/* Media Tab */}
        <div style={{ display: activeTab === 'media' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-12">
              <label className="form-label fw-bold">Hero Image</label>
              <AdminImageUpload
                value={formData.image}
                onChange={(url, id) => setFormData(prev => ({ ...prev, image: url, imageId: id }))}
                label="Hero Image"
                helperText="PNG, JPG, WEBP, SVG up to 5MB"
              />
            </div>
            <div className="col-md-12">
              <label className="form-label fw-bold">Background Image</label>
              <AdminImageUpload
                value={formData.backgroundImage}
                onChange={(url, id) => setFormData(prev => ({ ...prev, backgroundImage: url, backgroundImageId: id }))}
                label="Background Image"
                helperText="Wide background image (e.g., 1920x1080)"
              />
            </div>
            <div className="col-md-12">
              <label className="form-label fw-bold">Image Alt Text</label>
              <input type="text" className="form-control" name="imageAlt" value={formData.imageAlt} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* CTAs Tab */}
        <div style={{ display: activeTab === 'ctas' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-12">
              <h5 className="mb-0 fw-bold text-primary">Primary CTA <span className="badge fs-6 align-middle ms-2" style={{ background: 'linear-gradient(90deg, #6b46c1, #a78bfa)' }}>Purple Button</span></h5>
              <hr />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Button Text</label>
              <input type="text" className="form-control" name="primaryButtonText" value={formData.primaryButtonText} onChange={handleChange} />
            </div>
            <div className="col-md-5">
              <label className="form-label fw-bold">Button URL</label>
              <input type="text" className="form-control" name="primaryButtonUrl" value={formData.primaryButtonUrl} onChange={handleChange} />
            </div>
            <div className="col-md-3 d-flex align-items-end pb-2">
              <div className="form-check form-switch fs-5">
                <input type="checkbox" className="form-check-input" name="showPrimaryCTA" checked={formData.showPrimaryCTA} onChange={handleChange} id="showPrimaryCTA" />
                <label className="form-check-label fw-bold ms-2" htmlFor="showPrimaryCTA">Show</label>
              </div>
            </div>

            <div className="col-12 mt-5">
              <h5 className="mb-0 fw-bold text-primary">Secondary CTA <span className="badge bg-secondary fs-6 align-middle ms-2">Outline Button</span></h5>
              <hr />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Button Text</label>
              <input type="text" className="form-control" name="secondaryButtonText" value={formData.secondaryButtonText} onChange={handleChange} />
            </div>
            <div className="col-md-5">
              <label className="form-label fw-bold">Button URL</label>
              <input type="text" className="form-control" name="secondaryButtonUrl" value={formData.secondaryButtonUrl} onChange={handleChange} />
            </div>
            <div className="col-md-3 d-flex align-items-end pb-2">
              <div className="form-check form-switch fs-5">
                <input type="checkbox" className="form-check-input" name="showSecondaryCTA" checked={formData.showSecondaryCTA} onChange={handleChange} id="showSecondaryCTA" />
                <label className="form-check-label fw-bold ms-2" htmlFor="showSecondaryCTA">Show</label>
              </div>
            </div>
          </div>
        </div>

        {/* Display Tab */}
        <div style={{ display: activeTab === 'display' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">Ordering Position</label>
              <input type="number" className="form-control" name="ordering" value={formData.ordering} onChange={handleChange} />
              <div className="form-text">Lower numbers appear first in the sequence (e.g. 0, 1, 2).</div>
            </div>
          </div>
        </div>

        {/* Publishing Tab */}
        <div style={{ display: activeTab === 'publishing' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-12">
              <div className="form-check form-switch fs-5">
                <input type="checkbox" className="form-check-input" name="active" checked={formData.active} onChange={handleChange} id="active" />
                <label className="form-check-label text-success fw-bold ms-2" htmlFor="active">Slide is Active</label>
              </div>
              <div className="form-text ms-2 mt-1">If unchecked, this slide will not appear in the storefront hero carousel.</div>
            </div>
          </div>
        </div>

      </form>
    </AdminFormLayout>
  )
}
