import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import PageHeader from '../../components/PageHeader.jsx'
import useWow from '../../hooks/useWow.js'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../services'

export default function Account() {
  const { user, updateProfile, refreshUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  useWow()

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || '', phone: user.phone || '' })
      fetchAddresses()
    }
  }, [user])

  const fetchAddresses = async () => {
    try {
      const response = await authApi.getAddresses()
      setAddresses(response.data)
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await updateProfile(profileForm)
      setSuccess('Profile updated successfully')
      refreshUser()
    } catch (err) {
      setError(err.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (passwordForm.newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      await authApi.changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword })
      setSuccess('Password changed successfully')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return
    try {
      await authApi.deleteAddress(id)
      setAddresses(prev => prev.filter(a => a.id !== id))
    } catch (error) {
      console.error('Failed to delete address:', error)
    }
  }

  return (
    <>
      <PageHeader title="My Account" crumb="Account" />

      <div className="container-fluid bg-light py-5">
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-3 wow fadeInUp" data-wow-delay="0.1s">
              <div className="bg-white rounded p-4 mb-4">
                <div className="text-center mb-4">
                  <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 80, height: 80 }}>
                    <i className="fas fa-user fa-2x text-white"></i>
                  </div>
                  <h5 className="mb-1">{user?.name}</h5>
                  <p className="text-muted mb-0">{user?.email}</p>
                  <span className="badge bg-primary mt-2">{user?.role}</span>
                </div>
                <nav className="nav nav-pills flex-column">
                  <NavLink to="/account" className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                    <i className="fas fa-user me-2"></i> Profile
                  </NavLink>
                  <NavLink to="/account" className={`nav-link ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>
                    <i className="fas fa-lock me-2"></i> Change Password
                  </NavLink>
                  <NavLink to="/account" className={`nav-link ${activeTab === 'addresses' ? 'active' : ''}`} onClick={() => setActiveTab('addresses')}>
                    <i className="fas fa-map-marker-alt me-2"></i> Addresses
                  </NavLink>
                  <Link to="/account/orders" className="nav-link">
                    <i className="fas fa-shopping-bag me-2"></i> Order History
                  </Link>
                  <Link to="/wishlist" className="nav-link">
                    <i className="fas fa-heart me-2"></i> Wishlist
                  </Link>
                </nav>
              </div>
            </div>
            <div className="col-lg-9 wow fadeInUp" data-wow-delay="0.1s">
              <div className="bg-white rounded p-5">
                {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">{error}<button type="button" className="btn-close" data-bs-dismiss="alert"></button></div>}
                {success && <div className="alert alert-success alert-dismissible fade show" role="alert">{success}<button type="button" className="btn-close" data-bs-dismiss="alert"></button></div>}

                {activeTab === 'profile' && (
                  <form onSubmit={handleProfileSubmit}>
                    <h4 className="mb-4">Profile Information</h4>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input type="text" className="form-control" id="name" value={profileForm.name} onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))} required />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input type="tel" className="form-control" id="phone" value={profileForm.phone} onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))} />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" value={user?.email} readOnly />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="role" className="form-label">Role</label>
                        <input type="text" className="form-control" id="role" value={user?.role} readOnly />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                )}

                {activeTab === 'password' && (
                  <form onSubmit={handlePasswordSubmit}>
                    <h4 className="mb-4">Change Password</h4>
                    <div className="row g-3">
                      <div className="col-12">
                        <label htmlFor="currentPassword" className="form-label">Current Password</label>
                        <input type="password" className="form-control" id="currentPassword" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))} required />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input type="password" className="form-control" id="newPassword" value={passwordForm.newPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))} minLength={8} required />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                        <input type="password" className="form-control" id="confirmPassword" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))} required />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                      {loading ? 'Changing...' : 'Change Password'}
                    </button>
                  </form>
                )}

                {activeTab === 'addresses' && (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4>Saved Addresses</h4>
                      <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addressModal">
                        <i className="fas fa-plus me-2"></i> Add Address
                      </button>
                    </div>
                    {addresses.length > 0 ? (
                      <div className="row g-3">
                        {addresses.map((address) => (
                          <div key={address.id} className="col-md-6">
                            <div className="border rounded p-3 h-100">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="mb-0">{address.firstName} {address.lastName}</h6>
                                {address.isDefault && <span className="badge bg-primary">Default</span>}
                              </div>
                              <p className="mb-1">{address.address}</p>
                              <p className="mb-1">{address.city}, {address.country} {address.postalCode}</p>
                              <p className="mb-2">Phone: {address.phone}</p>
                              <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-primary" onClick={() => handleDeleteAddress(address.id)}>
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <i className="fas fa-map-marker-alt fa-3x text-muted mb-3"></i>
                        <h5>No addresses saved</h5>
                        <p className="text-muted">Add an address for faster checkout</p>
                        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addressModal">
                          <i className="fas fa-plus me-2"></i> Add Address
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <div className="modal fade" id="addressModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Address</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <AddressForm onSuccess={fetchAddresses} />
          </div>
        </div>
      </div>
    </>
  )
}

function AddressForm({ onSuccess }) {
  const [formData, setFormData] = useState({ type: 'shipping', firstName: '', lastName: '', company: '', address: '', city: '', country: '', postalCode: '', phone: '', isDefault: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.createAddress(formData)
      onSuccess()
      setFormData({ type: 'shipping', firstName: '', lastName: '', company: '', address: '', city: '', country: '', postalCode: '', phone: '', isDefault: false })
      const modal = bootstrap.Modal.getInstance(document.getElementById('addressModal'))
      modal?.hide()
    } catch (err) {
      setError(err.data?.message || 'Failed to add address')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-body">
        {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">{error}<button type="button" className="btn-close" data-bs-dismiss="alert"></button></div>}
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="type" className="form-label">Type</label>
            <select className="form-select" id="type" name="type" value={formData.type} onChange={handleChange}>
              <option value="shipping">Shipping</option>
              <option value="billing">Billing</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="firstName" className="form-label">First Name *</label>
            <input type="text" className="form-control" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label htmlFor="lastName" className="form-label">Last Name *</label>
            <input type="text" className="form-control" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label htmlFor="company" className="form-label">Company</label>
            <input type="text" className="form-control" id="company" name="company" value={formData.company} onChange={handleChange} />
          </div>
          <div className="col-12">
            <label htmlFor="address" className="form-label">Address *</label>
            <input type="text" className="form-control" id="address" name="address" value={formData.address} onChange={handleChange} required placeholder="House number, street name" />
          </div>
          <div className="col-md-6">
            <label htmlFor="city" className="form-label">City *</label>
            <input type="text" className="form-control" id="city" name="city" value={formData.city} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label htmlFor="country" className="form-label">Country *</label>
            <input type="text" className="form-control" id="country" name="country" value={formData.country} onChange={handleChange} required />
          </div>

          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">Phone *</label>
            <input type="tel" className="form-control" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="col-12">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="isDefault" name="isDefault" checked={formData.isDefault} onChange={handleChange} />
              <label className="form-check-label" htmlFor="isDefault">Set as default address</label>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Address'}
        </button>
      </div>
    </form>
  )
}
