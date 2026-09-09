import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminFormLayout from '../../components/admin/AdminFormLayout'
import AdminImageUpload from '../../components/admin/AdminImageUpload'
import { adminApi, collectionApi, productApi } from '../../services'

export default function AdminCollectionForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [globalError, setGlobalError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    active: true,
    productIds: []
  })
  const [formErrors, setFormErrors] = useState({})
  const [availableProducts, setAvailableProducts] = useState([])

  useEffect(() => {
    fetchProducts()
    if (isEditing) {
      fetchCollection()
    }
  }, [id])

  const fetchProducts = async () => {
    try {
      const response = await productApi.getAll({ limit: 1000 })
      setAvailableProducts(response.data?.data || response.data || [])
    } catch (err) {
      console.error('Failed to fetch products', err)
    }
  }

  const fetchCollection = async () => {
    try {
      const response = await adminApi.getCollection(id)
      const collection = response.data?.data || response.data
      setFormData({
        name: collection.name || '',
        slug: collection.slug || '',
        description: collection.description || '',
        image: collection.image || '',
        active: Boolean(collection.active),
        productIds: collection.products?.map(p => p.productId) || []
      })
    } catch (error) {
      console.error('Failed to fetch Collection:', error)
      setGlobalError('Failed to load Collection. It may have been deleted.')
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

  const handleProductToggle = (productId) => {
    setFormData(prev => {
      const isSelected = prev.productIds.includes(productId)
      return {
        ...prev,
        productIds: isSelected 
          ? prev.productIds.filter(id => id !== productId)
          : [...prev.productIds, productId]
      }
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
      delete submitData.productIds // handled separately
      
      let collectionId = id
      if (isEditing) {
        await adminApi.updateCollection(id, submitData)
      } else {
        const response = await adminApi.createCollection(submitData)
        collectionId = response.data?.data?.id || response.data?.id
      }

      // Assign products
      if (collectionId) {
        await adminApi.assignCollectionProducts(collectionId, formData.productIds)
      }

      navigate('/admin/collections')
    } catch (error) {
      setGlobalError(error.data?.message || 'Failed to save Collection')
    } finally {
      setSubmitting(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'products', label: 'Products' },
    { id: 'media', label: 'Media' },
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
      title={isEditing ? 'Edit Collection' : 'Create Collection'}
      subtitle={isEditing ? 'Update the details for this Collection' : 'Add a new Collection to your catalog'}
      onBack={() => navigate('/admin/collections')}
      onSave={handleSave}
      onCancel={() => navigate('/admin/collections')}
      isSaving={submitting}
      saveText="Save Collection"
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

        {/* Products Tab */}
        <div style={{ display: activeTab === 'products' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-12">
              <label className="form-label fw-bold">Assign Products</label>
              <div className="text-muted small mb-3">Select the products that should appear in this collection.</div>
              <div className="border rounded p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {availableProducts.length === 0 ? (
                  <div className="text-muted text-center py-4">No products available</div>
                ) : (
                  availableProducts.map(product => (
                    <div key={product.id} className="form-check border-bottom py-2">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id={`product-${product.id}`}
                        checked={formData.productIds.includes(product.id)}
                        onChange={() => handleProductToggle(product.id)}
                      />
                      <label className="form-check-label w-100" htmlFor={`product-${product.id}`}>
                        <div className="d-flex align-items-center">
                          {product.images && product.images.length > 0 && (
                            <img src={getImageUrl(product.images[0])} alt={product.name} className="me-2 rounded" style={{ width: 40, height: 40, objectFit: 'cover' }} />
                          )}
                          <div>
                            <div className="fw-bold">{product.name}</div>
                            <div className="text-muted small">SKU: {product.sku} | Price: ${product.price}</div>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Media Tab */}
        <div style={{ display: activeTab === 'media' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-12">
              <label className="form-label fw-bold">Collection Image</label>
              <AdminImageUpload
                value={formData.image}
                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                label="Collection Image"
              />
              {formErrors.image && <div className="text-danger small">{formErrors.image}</div>}
            </div>
          </div>
        </div>

        {/* Publishing Tab */}
        <div style={{ display: activeTab === 'publishing' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-12">
              <div className="form-check form-switch fs-5">
                <input type="checkbox" className="form-check-input" name="active" checked={formData.active} onChange={handleChange} id="active" />
                <label className="form-check-label text-success fw-bold ms-2" htmlFor="active">Collection is Active</label>
              </div>
              <div className="form-text ms-2 mt-1">If unchecked, the Collection and its products may be hidden from storefront navigation.</div>
            </div>
          </div>
        </div>
      </form>
    </AdminFormLayout>
  )
}
