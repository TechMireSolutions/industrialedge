import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSettings } from '../../context/SettingsContext'
import './AdminLogin.css'

export default function AdminLogin() {
  const { login } = useAuth()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect to original location or admin dashboard
  const from = location.state?.from?.pathname || '/admin'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)

      // Enforce admin only
      if (user.role !== 'ADMIN') {
        setError('Access denied. Superuser privileges required.')
        // In a real app we might want to log them out here if they aren't admin,
        // but AdminProtectedRoute will also catch them and redirect them.
        return
      }

      navigate(from, { replace: true })
    } catch (err) {
      setError(err.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const siteName = settings?.general?.siteName || ''
  const navbarLogoUrl = settings?.branding?.navbarLogoId?.storagePath || settings?.branding?.navbarLogo?.storagePath || null

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="d-flex align-items-center mb-4">
          {navbarLogoUrl ? (
            <img src={getImageUrl(navbarLogoUrl)} alt={siteName} className="me-3" style={{ height: 45, objectFit: 'contain' }} />
          ) : siteName ? (
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 45, height: 45 }}>
              <i className="fas fa-bolt text-white"></i>
            </div>
          ) : null}
          {siteName && <h3 className="fw-bold text-white mb-0" style={{ letterSpacing: '1px' }}>{siteName}</h3>}
        </div>

        <h2 className="admin-login-title">Welcome Back</h2>
        {siteName && <p className="admin-login-subtitle">Sign in to continue to {siteName}</p>}

        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-login-form-group">
            <i className="fas fa-envelope admin-login-input-icon"></i>
            <input
              type="email"
              className="admin-login-input"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="admin-login-form-group">
            <i className="fas fa-lock admin-login-input-icon"></i>
            <input
              type={showPassword ? "text" : "password"}
              className="admin-login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="admin-login-input-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>

          <div className="admin-login-options">
            <label className="admin-login-checkbox">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="admin-login-link" onClick={(e) => e.preventDefault()}>
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <i className="fas fa-arrow-right"></i>}
          </button>
        </form>
      </div>
    </div>
  )
}
