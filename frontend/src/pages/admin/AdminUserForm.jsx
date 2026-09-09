import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminFormLayout from '../../components/admin/AdminFormLayout'
import { adminApi } from '../../services'

export default function AdminUserForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [activeTab, setActiveTab] = useState('account')
  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [globalError, setGlobalError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'CUSTOMER',
    password: ''
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (isEditing) {
      fetchUser()
    }
  }, [id])

  const fetchUser = async () => {
    try {
      // Find user. Might need to fetch all or use getById if exists.
      // AdminUsers uses pagination. For edit, ideally we need getById.
      // We will fetch list with high limit to find it if there's no getById.
      const response = await adminApi.getUsers({ page: 1, limit: 1000 })
      const user = response.data.find(u => u.id === id)
      if (user) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || 'CUSTOMER',
          password: '' // Keep password blank
        })
      } else {
        setGlobalError('User not found.')
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      setGlobalError('Failed to load user.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    if (!isEditing && !formData.password) errors.password = 'Password is required for new users'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    setGlobalError('')
    if (!validateForm()) {
      setGlobalError('Please fix the errors in the form before saving.')
      if (formErrors.name || formErrors.email) setActiveTab('account')
      else if (formErrors.password) setActiveTab('security')
      return
    }

    setSubmitting(true)
    try {
      const submitData = { ...formData }
      if (isEditing && !submitData.password) {
        delete submitData.password
      }
      
      if (isEditing) {
        await adminApi.updateUser(id, submitData)
      } else {
        await adminApi.createUser(submitData)
      }
      navigate('/admin/users')
    } catch (error) {
      setGlobalError(error.data?.message || 'Failed to save user')
    } finally {
      setSubmitting(false)
    }
  }

  const tabs = [
    { id: 'account', label: 'Account Profile' },
    { id: 'security', label: 'Security' },
    { id: 'role', label: 'Role & Permissions' }
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
      title={isEditing ? 'Edit User' : 'Create User'}
      subtitle={isEditing ? 'Update the details for this user account' : 'Create a new admin or customer account'}
      onBack={() => navigate('/admin/users')}
      onSave={handleSave}
      onCancel={() => navigate('/admin/users')}
      isSaving={submitting}
      saveText="Save User"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      error={globalError}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Account Tab */}
        <div style={{ display: activeTab === 'account' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">Full Name *</label>
              <input type="text" className={`form-control ${formErrors.name ? 'is-invalid' : ''}`} name="name" value={formData.name} onChange={handleChange} required />
              {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Email Address *</label>
              <input type="email" className={`form-control ${formErrors.email ? 'is-invalid' : ''}`} name="email" value={formData.email} onChange={handleChange} required />
              {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Phone Number</label>
              <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Security Tab */}
        <div style={{ display: activeTab === 'security' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">Password {isEditing ? '' : '*'}</label>
              <input type="password" className={`form-control ${formErrors.password ? 'is-invalid' : ''}`} name="password" value={formData.password} onChange={handleChange} />
              {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
              {isEditing && (
                <div className="form-text">Leave blank to keep the current password.</div>
              )}
            </div>
          </div>
        </div>

        {/* Role Tab */}
        <div style={{ display: activeTab === 'role' ? 'block' : 'none' }}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">User Role *</label>
              <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                <option value="CUSTOMER">Customer</option>
                <option value="ADMIN">Administrator</option>
              </select>
              <div className="form-text mt-2">
                <strong>Customer:</strong> Can browse, purchase, and manage their own orders.<br />
                <strong>Administrator:</strong> Full access to the Admin Panel and all store settings.
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminFormLayout>
  )
}
