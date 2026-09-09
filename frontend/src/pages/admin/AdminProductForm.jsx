import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminFormLayout from '../../components/admin/AdminFormLayout'
import AdminImageUpload from '../../components/admin/AdminImageUpload'
import { adminApi, categoryApi, productApi } from '../../services'

export default function AdminProductForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [availableTags, setAvailableTags] = useState([])

  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', shortDescription: '',
    categoryId: '', price: '', oldPrice: '', shippingPrice: '0', sku: '', stock: '0',
    badge: '', images: [''], isFeatured: false, isNew: false,
    isTopSelling: false, isBestseller: false, active: true,
    tags: []
  })
  const [formErrors, setFormErrors] = useState({})
  const [globalError, setGlobalError] = useState('')

  useEffect(() => {
    fetchCategories()
    fetchTags()
    if (isEditing) {
      fetchProduct()
    }
  }, [id])

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll(true)
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchTags = async () => {
    try {
      const response = await adminApi.getTags()
      setAvailableTags(response.data)
    } catch (error) {
      console.error('Failed to fetch tags:', error)
    }
  }

  const fetchProduct = async () => {
    try {
      const response = await productApi.getById(id)
      const product = response.data || response // depending on interceptor
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        categoryId: product.categoryId || '',
        price: String(product.price || ''),
        oldPrice: product.oldPrice ? String(product.oldPrice) : '',
        shippingPrice: String(product.shippingPrice || '0'),
        sku: product.sku || '',
        stock: String(product.stock || 0),
        badge: product.badge || '',
        images: product.images?.length > 0 ? [...product.images] : [''],
        isFeatured: Boolean(product.isFeatured),
        isNew: Boolean(product.isNew),
        isTopSelling: Boolean(product.isTopSelling),
        isBestseller: Boolean(product.isBestseller),
        active: Boolean(product.active),
        tags: product.tags ? product.tags.map(t => t.id) : [],
      })
    } catch (error) {
      console.error('Failed to fetch product:', error)
      setGlobalError('Failed to load product. It may have been deleted.')
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

  const handleTagToggle = (tagId) => {
    setFormData(prev => {
      const tags = prev.tags.includes(tagId) 
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
      return { ...prev, tags }
    })
  }

  const handleImageChange = (index, value) => {
    setFormData(prev => {
      const newImages = [...prev.images]
      newImages[index] = value
      return { ...prev, images: newImages }
    })
  }

  const addImage = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }))
  }

  const removeImage = (index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.description.trim()) errors.description = 'Description is required'
    if (!formData.categoryId) errors.categoryId = 'Category is required'
    if (!formData.price || parseFloat(formData.price) <= 0) errors.price = 'Valid price is required'
    if (!formData.stock || parseInt(formData.stock) < 0) errors.stock = 'Valid stock is required'
    if (formData.images.filter(img => img.trim()).length === 0) errors.images = 'At least one image is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    setGlobalError('')
    if (!validateForm()) {
      setGlobalError('Please fix the errors in the form before saving.')
      if (formErrors.name || formErrors.description || formErrors.categoryId) setActiveTab('general')
      else if (formErrors.images) setActiveTab('media')
      else if (formErrors.price) setActiveTab('pricing')
      else if (formErrors.stock) setActiveTab('inventory')
      return
    }

    setSubmitting(true)
    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
        shippingPrice: parseFloat(formData.shippingPrice) || 0,
        stock: parseInt(formData.stock),
        images: formData.images.filter(img => img.trim()),
      }

      if (isEditing) {
        await adminApi.updateProduct(id, submitData)
      } else {
        await adminApi.createProduct(submitData)
      }
      navigate('/admin/products')
    } catch (error) {
      setGlobalError(error.data?.message || 'Failed to save product')
    } finally {
      setSubmitting(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'media', label: 'Media' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'inventory', label: 'Inventory' },
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
      title={isEditing ? 'Edit Product' : ''}
      subtitle={isEditing ? 'Update the details for this product' : 'Add a new product to your catalog'}
      onBack={() => navigate('/admin/products')}
      onSave={handleSave}
      onCancel={() => navigate('/admin/products')}
      isSaving={submitting}
      saveText="Save Product"
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
              <label className="form-label fw-bold">Slug (Optional)</label>
              <input type="text" className={`form-control ${formErrors.slug ? 'is-invalid' : ''}`} name="slug" value={formData.slug} onChange={handleChange} placeholder="Auto-generated if left blank" />
              {formErrors.slug && <div className="invalid-feedback">{formErrors.slug}</div>}
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Description *</label>
              <textarea className={`form-control ${formErrors.description ? 'is-invalid' : ''}`} name="description" value={formData.description} onChange={handleChange} rows={5} required></textarea>
              {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Short Description</label>
              <input type="text" className="form-control" name="shortDescription" value={formData.shortDescription} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Category *</label>
              <select className={`form-select ${formErrors.categoryId ? 'is-invalid' : ''}`} name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              {formErrors.categoryId && <div className="invalid-feedback">{formErrors.categoryId}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Badge</label>
              <select className="form-select" name="badge" value={formData.badge} onChange={handleChange}>
                <option value="">None</option>
                <option value="new">New</option>
                <option value="sale">Sale</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Product Tags</label>
              <div className="d-flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <div key={tag.id} className="form-check border rounded px-3 py-2 bg-light d-flex align-items-center me-2">
                    <input
                      className="form-check-input mt-0 me-2"
                      type="checkbox"
                      id={`tag-${tag.id}`}
                      checked={formData.tags.includes(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
                    />
                    <label className="form-check-label mb-0" htmlFor={`tag-${tag.id}`}>
                      {tag.name}
                    </label>
                  </div>
                ))}
                {availableTags.length === 0 && <small className="text-muted">No tags available. Add some in the Tags menu.</small>}
              </div>
            </div>
          </div>
        </div>

        {/* Media Tab */}
        <div style={{ display: activeTab === 'media' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-12">
              <label className="form-label fw-bold">Product Images *</label>
              <div className="mb-3">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="mb-4 p-3 border rounded position-relative bg-white shadow-sm">
                    <button
                      type="button"
                      className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                      onClick={() => removeImage(idx)}
                      style={{ zIndex: 10 }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                    <AdminImageUpload
                      value={img}
                      onChange={(url) => handleImageChange(idx, url)}
                      label={`Product Image ${idx + 1}`}
                    />
                  </div>
                ))}
                <button type="button" className="btn btn-outline-primary mt-2" onClick={addImage}>
                  <i className="fas fa-plus me-2"></i> Add Another Image
                </button>
              </div>
              {formErrors.images && <div className="text-danger small">{formErrors.images}</div>}
            </div>
          </div>
        </div>

        {/* Pricing Tab */}
        <div style={{ display: activeTab === 'pricing' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">Price *</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input type="number" step="0.01" className={`form-control ${formErrors.price ? 'is-invalid' : ''}`} name="price" value={formData.price} onChange={handleChange} required />
              </div>
              {formErrors.price && <div className="text-danger small mt-1">{formErrors.price}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Old Price</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input type="number" step="0.01" className="form-control" name="oldPrice" value={formData.oldPrice} onChange={handleChange} />
              </div>
              <div className="form-text">Used to show a discount (strikethrough price).</div>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Shipping Price</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input type="number" step="0.01" className="form-control" name="shippingPrice" value={formData.shippingPrice} onChange={handleChange} />
              </div>
              <div className="form-text">0 or leave empty for free shipping.</div>
            </div>
          </div>
        </div>

        {/* Inventory Tab */}
        <div style={{ display: activeTab === 'inventory' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">SKU (Optional)</label>
              <input type="text" className={`form-control ${formErrors.sku ? 'is-invalid' : ''}`} name="sku" value={formData.sku} onChange={handleChange} placeholder="Auto-generated if left blank" />
              {formErrors.sku && <div className="invalid-feedback">{formErrors.sku}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Stock Quantity *</label>
              <input type="number" className={`form-control ${formErrors.stock ? 'is-invalid' : ''}`} name="stock" value={formData.stock} onChange={handleChange} required />
              {formErrors.stock && <div className="invalid-feedback">{formErrors.stock}</div>}
            </div>
          </div>
        </div>

        {/* Publishing Tab */}
        <div style={{ display: activeTab === 'publishing' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-12 border-bottom pb-4 mb-2">
              <div className="form-check form-switch fs-5">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  id="active"
                />
                <label className="form-check-label text-success fw-bold ms-2" htmlFor="active">
                  Product is Active
                </label>
              </div>
              <div className="form-text ms-2 mt-1">
                If unchecked, the product will be completely hidden from the storefront.
              </div>
            </div>

            <div className="col-md-12">
              <div className="card border-0 bg-light p-3 rounded">
                <label
                  className="shadcn-field"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    margin: 0,
                    padding: 0
                  }}
                >
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                  />
                  <span
                    className="shadcn-text"
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#09090b',
                      lineHeight: 1,
                      margin: 0,
                      padding: 0
                    }}
                  >
                    Featured Product
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminFormLayout>
  )
}
