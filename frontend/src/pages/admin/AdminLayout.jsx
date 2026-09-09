import { getImageUrl } from '../../utils/getImageUrl';
import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSettings } from '../../context/SettingsContext'
import { notificationApi } from '../../services'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const { settings } = useSettings()
  const navigate = useNavigate()

  const siteName = settings?.general?.siteName || ''
  const navbarLogoUrl = settings?.branding?.navbarLogoId?.storagePath || settings?.branding?.navbarLogo?.storagePath || null
  const flags = settings?.featureFlags || {}

  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fetchNotifications = async () => {
    try {
      const response = await notificationApi.getUnread()
      setNotifications(response.data || [])
    } catch (error) {
      console.error('Failed to fetch notifications', error)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const closeSidebar = () => setSidebarOpen(false)

  const handleNotificationClick = async (notification) => {
    try {
      await notificationApi.markAsRead(notification.id)
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
      setShowNotifications(false)
      if (notification.link) {
        navigate(notification.link)
      }
    } catch (error) {
      console.error('Failed to mark notification as read', error)
    }
  }

  const menuGroups = [
    {
      title: 'MAIN',
      items: [
        { path: '/admin', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
      ]
    },
    {
      title: 'CATALOG',
      items: [
        { path: '/admin/products', label: 'Products', icon: 'fas fa-box' },
        { path: '/admin/categories', label: 'Categories', icon: 'fas fa-tags' },
        { path: '/admin/collections', label: 'Collections', icon: 'fas fa-layer-group' },
        { path: '/admin/tags', label: 'Tags', icon: 'fas fa-hashtag' },
      ]
    },
    {
      title: 'SALES',
      items: [
        { path: '/admin/orders', label: 'Orders', icon: 'fas fa-shopping-bag' },
        { path: '/admin/coupons', label: 'Coupons', icon: 'fas fa-ticket-alt' },
      ]
    },
    {
      title: 'CUSTOMERS',
      items: [
        { path: '/admin/users', label: 'Users', icon: 'fas fa-users' },
        { path: '/admin/reviews', label: 'Reviews', icon: 'fas fa-star' },
      ]
    },
    {
      title: 'CONTENT',
      items: [
        { path: '/admin/hero-slides', label: 'Hero Slides', icon: 'fas fa-images' },
        { path: '/admin/banners', label: 'Banners', icon: 'fas fa-image' },
        { path: '/admin/offers', label: 'Offers', icon: 'fas fa-percentage' },
        { path: '/admin/services', label: 'Services', icon: 'fas fa-concierge-bell' },
        { path: '/admin/pages', label: 'Pages', icon: 'fas fa-file-alt' },
        ...(flags.enablePartners !== false ? [{ path: '/admin/partners', label: 'Partners', icon: 'fas fa-handshake' }] : []),
        { path: '/admin/media', label: 'Media Library', icon: 'fas fa-folder-open' },
      ]
    },
    {
      title: 'ENGAGEMENT',
      items: [
        { path: '/admin/contact-submissions', label: 'Contacts', icon: 'fas fa-envelope' },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { path: '/admin/settings', label: 'Settings', icon: 'fas fa-cog' },
        { path: '/admin/homepage-builder', label: 'Homepage Builder', icon: 'fas fa-home' },
        { path: '/admin/menus', label: 'Navigation', icon: 'fas fa-bars' },
        { path: '/admin/footer', label: 'Footer', icon: 'fas fa-columns' },
      ]
    }
  ]

  // Conditionally remove SALES -> Coupons and CUSTOMERS -> Reviews
  if (flags.enableCoupons === false) {
    const salesGroup = menuGroups.find(g => g.title === 'SALES');
    if (salesGroup) salesGroup.items = salesGroup.items.filter(i => i.path !== '/admin/coupons');
  }
  if (flags.enableReviews === false) {
    const custGroup = menuGroups.find(g => g.title === 'CUSTOMERS');
    if (custGroup) custGroup.items = custGroup.items.filter(i => i.path !== '/admin/reviews');
  }

  return (
    <>
      <div className={`admin-sidebar d-flex flex-column ${sidebarOpen ? 'open' : ''}`}>
        <div className="p-4 d-flex align-items-center mb-2 justify-content-between">
          <div className="d-flex align-items-center">
            {navbarLogoUrl ? (
              <img src={getImageUrl(navbarLogoUrl)} alt={siteName} className="me-2" style={{ height: 32, objectFit: 'contain' }} />
            ) : siteName ? (
              <h4 className="text-warning m-0" style={{ fontWeight: 600, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>{siteName}</h4>
            ) : null}
          </div>
          <button type="button" className="btn-close btn-close-white d-lg-none" onClick={closeSidebar} aria-label="Close sidebar"></button>
        </div>

        <div className="px-3 pb-5 flex-grow-1">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="mb-2">
              <div className="admin-section-title">{group.title}</div>
              <nav className="nav flex-column">
                {group.items.map((item) => (
                  <NavLink key={item.path} to={item.path} className="admin-nav-item" end onClick={closeSidebar}>
                    <i className={`${item.icon} me-3 text-center`} style={{ width: '20px' }}></i>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="mt-auto p-4 border-top" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <NavLink to="/" className="btn btn-outline-light w-100 rounded-pill py-2 text-start d-flex align-items-center justify-content-between" style={{ opacity: 0.8 }} target="_blank">
            <span>View Storefront</span>
            <i className="fas fa-arrow-right"></i>
          </NavLink>
        </div>
      </div>

      <div className="admin-main">
        <div className="admin-topbar">
          <button type="button" className="btn btn-light btn-sm d-lg-none admin-sidebar-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
            <i className="fas fa-bars"></i>
          </button>
          <div className="d-flex align-items-center w-50">
            <div className="position-relative w-100 max-w-md">
              <i className="fas fa-search position-absolute text-muted" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)' }}></i>
              <input type="text" className="form-control border-0 bg-light rounded-pill ps-5 py-2" placeholder="Search..." />
            </div>
          </div>

          <div className="d-flex align-items-center gap-4">
            <div style={{ cursor: 'pointer' }} className="text-secondary hover-primary transition">
              <i className="fas fa-moon fs-5"></i>
            </div>

            <div className="position-relative" style={{ cursor: 'pointer' }} onClick={() => setShowNotifications(!showNotifications)}>
              <i className="fas fa-bell fs-5 text-secondary hover-primary transition"></i>
              {notifications.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                  {notifications.length}
                </span>
              )}
            </div>

            <div className="dropdown">
              <div className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }} data-bs-toggle="dropdown">
                <div className="rounded-circle bg-light d-flex align-items-center justify-content-center text-primary fw-bold" style={{ width: 40, height: 40 }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="d-none d-md-block">
                  <div className="fw-bold fs-7 text-dark lh-1 mb-1">{user?.name}</div>
                  <div className="text-muted small lh-1">Admin</div>
                </div>
                <i className="fas fa-chevron-down text-muted small ms-2"></i>
              </div>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                <li><button className="dropdown-item py-2 text-danger" onClick={handleLogout}><i className="fas fa-sign-out-alt me-2"></i>Logout</button></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Notifications Dropdown (Absolute Positioning below topbar) */}
        {showNotifications && (
          <div className="position-absolute bg-white border rounded shadow-lg p-0" style={{ top: '80px', right: '100px', width: '320px', zIndex: 1050, overflow: 'hidden' }}>
            <div className="p-3 border-bottom bg-light">
              <h6 className="mb-0 fw-bold">Notifications</h6>
            </div>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted small">No unread notifications</div>
            ) : (
              <div className="d-flex flex-column" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} onClick={() => handleNotificationClick(n)} className="p-3 border-bottom hover-bg-light transition" style={{ cursor: 'pointer' }}>
                    <div className="fw-bold fs-7 text-dark mb-1">{n.title}</div>
                    <div className="text-muted small lh-sm mb-2">{n.message}</div>
                    <div className="text-primary" style={{ fontSize: '0.7rem' }}>{new Date(n.createdAt).toLocaleTimeString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex-grow-1 p-4 p-md-5">
          <Outlet />
        </div>
      </div>

      <div className={`admin-sidebar-backdrop ${sidebarOpen ? 'show' : ''}`} onClick={closeSidebar}></div>
    </>
  )
}

