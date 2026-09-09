import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader.jsx'
import useWow from '../../hooks/useWow.js'
import { useAuth } from '../../context/AuthContext'
import { useSettings } from '../../context/SettingsContext'

export default function Register() {
  const { register } = useAuth()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  useWow()

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      await register(formData.name, formData.email, formData.password, formData.phone)
      navigate('/')
    } catch (err) {
      setError(err.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader title="Register" crumb="Register" />

      <div className="container-fluid bg-light overflow-hidden py-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="bg-white rounded p-5">
                <h3 className="mb-4">Create Account</h3>
                <p className="text-muted mb-4">Join us for the best shopping experience</p>

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                  </div>
                )}

                {settings?.system?.allowRegistration === false ? (
                  <div className="alert alert-warning text-center">
                    Registration is currently disabled by the administrator.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone (Optional)</label>
                    <input type="tel" className="form-control" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} minLength={8} required />
                    <div className="form-text">At least 8 characters</div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 py-3" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                  </button>
                </form>
                )}

                <div className="text-center mt-4">
                  <p className="mb-0">Already have an account? <Link to="/login" className="text-primary">Sign In</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
