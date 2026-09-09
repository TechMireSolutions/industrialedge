import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminFormLayout from '../../components/admin/AdminFormLayout'
import { adminApi } from '../../services'

export default function AdminCouponForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [activeTab, setActiveTab] = useState('details')
  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [globalError, setGlobalError] = useState('')
  
  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: '',
    minimumOrder: '',
    maximumDiscount: '',
    usageLimit: '',
    expiry: '',
    active: true
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (isEditing) {
      fetchCoupon()
    }
  }, [id])

  const fetchCoupon = async () => {
    try {
      // Need to find the specific coupon. If pagination is used in backend, might need to fetch all or have a getById.
      // Since there's no getCouponById in adminApi based on AdminCoupons.jsx, we fetch a large limit to find it.
      const response = await adminApi.getCoupons(1, 1000)
      const coupon = response.data.find(c => c.id === id)
      if (coupon) {
        setFormData({
          code: coupon.code || '',
          type: coupon.type || 'PERCENTAGE',
          value: coupon.value !== null ? String(coupon.value) : '',
          minimumOrder: coupon.minimumOrder !== null ? String(coupon.minimumOrder) : '',
          maximumDiscount: coupon.maximumDiscount !== null ? String(coupon.maximumDiscount) : '',
          usageLimit: coupon.usageLimit !== null ? String(coupon.usageLimit) : '',
          expiry: coupon.expiry ? coupon.expiry.split('T')[0] : '',
          active: Boolean(coupon.active)
        })
      } else {
        setGlobalError('Coupon not found.')
      }
    } catch (error) {
      console.error('Failed to fetch coupon:', error)
      setGlobalError('Failed to load coupon.')
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
    if (!formData.code.trim()) errors.code = 'Code is required'
    if (!formData.value || parseFloat(formData.value) <= 0) errors.value = 'Valid value is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    setGlobalError('')
    if (!validateForm()) {
      setGlobalError('Please fix the errors in the form before saving.')
      if (formErrors.code || formErrors.value) setActiveTab('details')
      return
    }

    setSubmitting(true)
    try {
      const submitData = {
        ...formData,
        code: formData.code.toUpperCase(),
        value: parseFloat(formData.value),
        minimumOrder: formData.minimumOrder ? parseFloat(formData.minimumOrder) : null,
        maximumDiscount: formData.maximumDiscount ? parseFloat(formData.maximumDiscount) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        expiry: formData.expiry ? new Date(formData.expiry).toISOString() : null,
      }
      if (isEditing) {
        await adminApi.updateCoupon(id, submitData)
      } else {
        await adminApi.createCoupon(submitData)
      }
      navigate('/admin/coupons')
    } catch (error) {
      setGlobalError(error.data?.message || 'Failed to save coupon')
    } finally {
      setSubmitting(false)
    }
  }

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'rules', label: 'Rules & Limits' },
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
      title={isEditing ? 'Edit Coupon' : 'Create Coupon'}
      subtitle={isEditing ? 'Update the details for this discount coupon' : 'Add a new discount coupon to your store'}
      onBack={() => navigate('/admin/coupons')}
      onSave={handleSave}
      onCancel={() => navigate('/admin/coupons')}
      isSaving={submitting}
      saveText="Save Coupon"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      error={globalError}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Details Tab */}
        <div style={{ display: activeTab === 'details' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">Coupon Code *</label>
              <input type="text" className={`form-control text-uppercase ${formErrors.code ? 'is-invalid' : ''}`} name="code" value={formData.code} onChange={handleChange} required />
              {formErrors.code && <div className="invalid-feedback">{formErrors.code}</div>}
              <div className="form-text">e.g. SUMMER2024</div>
            </div>
            <div className="col-12">
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Discount Type *</label>
                  <select className="form-select" name="type" value={formData.type} onChange={handleChange}>
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Discount Value *</label>
                  <div className="input-group">
                    <span className="input-group-text">{formData.type === 'PERCENTAGE' ? '%' : '$'}</span>
                    <input type="number" className={`form-control ${formErrors.value ? 'is-invalid' : ''}`} name="value" value={formData.value} onChange={handleChange} min="0" step="0.01" required />
                    {formErrors.value && <div className="invalid-feedback">{formErrors.value}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rules Tab */}
        <div style={{ display: activeTab === 'rules' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">Minimum Order Amount</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input type="number" className="form-control" name="minimumOrder" value={formData.minimumOrder} onChange={handleChange} min="0" step="0.01" />
              </div>
              <div className="form-text">Leave empty for no minimum.</div>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Maximum Discount Amount</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input type="number" className="form-control" name="maximumDiscount" value={formData.maximumDiscount} onChange={handleChange} min="0" step="0.01" />
              </div>
              <div className="form-text">Only applies to percentage discounts. Leave empty for no max.</div>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Usage Limit</label>
              <input type="number" className="form-control" name="usageLimit" value={formData.usageLimit} onChange={handleChange} min="1" />
              <div className="form-text">Total times this coupon can be used. Leave empty for unlimited.</div>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Expiry Date</label>
              <input type="date" className="form-control" name="expiry" value={formData.expiry} onChange={handleChange} />
              <div className="form-text">Leave empty if coupon never expires.</div>
            </div>
          </div>
        </div>

        {/* Publishing Tab */}
        <div style={{ display: activeTab === 'publishing' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-12">
              <div className="form-check form-switch fs-5">
                <input type="checkbox" className="form-check-input" name="active" checked={formData.active} onChange={handleChange} id="active" />
                <label className="form-check-label text-success fw-bold ms-2" htmlFor="active">Coupon is Active</label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminFormLayout>
  )
}
