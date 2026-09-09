import { getImageUrl } from '../utils/getImageUrl';
import { useState, useEffect, useMemo } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useSettings } from '../context/SettingsContext'
import { menuApi } from '../services'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { cart, wishlistCount } = useCart()
  const { settings } = useSettings()

  const siteName = settings?.general?.siteName || ''
  const navbarLogoUrl = settings?.branding?.navbarLogoId?.storagePath || settings?.branding?.navbarLogo?.storagePath || null
  const showWishlist = settings?.featureFlags?.enableWishlist ?? true

  // Fallback menu if API fails
  const fallbackMenu = [
    { id: 'f-home', label: 'Home', type: 'link', destinationType: 'custom', url: '/', visible: true, desktopVisible: true, mobileVisible: true },
    { id: 'f-shop', label: 'Shop', type: 'link', destinationType: 'custom', url: '/shop', visible: true, desktopVisible: true, mobileVisible: true },
    { id: 'f-search', type: 'system_action', systemAction: 'search', visible: true, desktopVisible: true, mobileVisible: true },
    { id: 'f-wishlist', type: 'system_action', systemAction: 'wishlist', visible: true, desktopVisible: true, mobileVisible: true },
    { id: 'f-account', type: 'system_action', systemAction: 'account', visible: true, desktopVisible: true, mobileVisible: true },
    { id: 'f-cart', type: 'system_action', systemAction: 'cart', visible: true, desktopVisible: true, mobileVisible: true }
  ];

  useEffect(() => {
    menuApi.getActiveMenu('main-nav')
      .then(res => setMenuItems(res.data?.items || []))
      .catch(() => setMenuItems(fallbackMenu))
      .finally(() => setLoading(false))
  }, [])

  const closeMenu = () => {
    const menu = document.getElementById('navbarCollapse')
    if (menu) menu.classList.remove('show')
  }

  useEffect(() => {
    closeMenu()
  }, [location.pathname, location.search])

  const submitSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
    const bar = document.getElementById('searchBar')
    if (bar) bar.classList.remove('show')
    setQuery('')
    closeMenu()
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const resolveUrl = (item) => {
    switch (item.destinationType) {
      case 'internal': return item.url || '#';
      case 'external': return item.url || '#';
      case 'category': return item.category?.slug ? `/category/${item.category.slug}` : '#';
      case 'collection': return item.collection?.slug ? `/collection/${item.collection.slug}` : '#';
      case 'product': return item.product?.slug ? `/product/${item.product.slug}` : '#';
      case 'page': return item.page?.slug ? `/page/${item.page.slug}` : '#';
      default: return '#';
    }
  };

  const renderBadge = (item) => {
    if (!item.badgeText) return null;
    return <span className={`badge bg-${item.badgeVariant || 'primary'} ms-2`} style={{ fontSize: '0.65rem' }}>{item.badgeText}</span>
  };

  const renderIcon = (item) => {
    if (!item.icon) return null;
    return <i className={`${item.icon} ${item.iconPosition === 'right' ? 'ms-2' : 'me-2'}`}></i>
  };

  // Pre-process items to split into left (nav links) and right (actions/buttons) if needed,
  // or just render them in order. For the navbar, standard items go into the collapse,
  // while system actions (search, wishlist, account, cart) typically go on the right side fixed.
  // We'll separate system actions to the right-side container to preserve the visual design.
  
  const navLinks = [];
  const systemActions = [];

  menuItems.filter(i => i.visible).forEach(item => {
    if (item.type === 'system_action') {
      systemActions.push(item);
    } else {
      navLinks.push(item);
    }
  });

  const renderNavItem = (item, isMobile = false) => {
    const visibilityClass = !item.desktopVisible ? 'd-lg-none' : (!item.mobileVisible ? 'd-none d-lg-block' : '');
    
    if (item.type === 'button') {
      const ButtonComponent = item.destinationType === 'external' ? 'a' : Link;
      const btnProps = item.destinationType === 'external' 
        ? { href: resolveUrl(item), target: item.target || '_blank', rel: 'noopener noreferrer' }
        : { to: resolveUrl(item), target: item.target || '_self' };
        
      return (
        <ButtonComponent 
          key={item.id} 
          {...btnProps} 
          className={`btn btn-${item.variant || 'primary'} rounded-pill px-3 ms-lg-3 my-2 my-lg-0 align-self-start align-self-lg-center ${visibilityClass}`}
        >
          {item.iconPosition !== 'right' && renderIcon(item)}
          {item.label}
          {item.iconPosition === 'right' && renderIcon(item)}
          {renderBadge(item)}
        </ButtonComponent>
      );
    }

    if (item.type === 'dropdown' || item.type === 'mega_menu') {
      return (
        <div key={item.id} className={`nav-item dropdown custom-nav-dropdown ${visibilityClass}`}>
          <button type="button" className="nav-link custom-nav-link dropdown-toggle border-0 bg-transparent" data-bs-toggle="dropdown" aria-expanded="false">
            {item.iconPosition !== 'right' && renderIcon(item)}
            {item.label}
            {item.iconPosition === 'right' && renderIcon(item)}
            {renderBadge(item)}
          </button>
          <div className="dropdown-menu dropdown-menu-modern shadow-sm border-0 m-0 mt-2 rounded-4 p-2">
            {item.children?.filter(c => c.visible).map(child => {
              const ChildComponent = child.destinationType === 'external' ? 'a' : Link;
              const childProps = child.destinationType === 'external' 
                ? { href: resolveUrl(child), target: child.target || '_blank', rel: "noopener noreferrer" }
                : { to: resolveUrl(child), target: child.target || '_self' };

              return (
                <ChildComponent key={child.id} {...childProps} className="dropdown-item rounded-3 py-2 d-flex align-items-center justify-content-between">
                  <span>
                    {child.iconPosition !== 'right' && renderIcon(child)}
                    {child.label}
                    {child.iconPosition === 'right' && renderIcon(child)}
                  </span>
                  {renderBadge(child)}
                </ChildComponent>
              );
            })}
          </div>
        </div>
      );
    }

    // Default Link
    if (item.destinationType === 'external') {
      return (
        <a key={item.id} href={resolveUrl(item)} target={item.target || '_blank'} rel="noopener noreferrer" className={`nav-item nav-link custom-nav-link ${visibilityClass}`}>
          {item.iconPosition !== 'right' && renderIcon(item)}
          {item.label}
          {item.iconPosition === 'right' && renderIcon(item)}
          {renderBadge(item)}
        </a>
      );
    }

    return (
      <NavLink key={item.id} to={resolveUrl(item)} target={item.target || '_self'} className={`nav-item nav-link custom-nav-link ${visibilityClass}`}>
        {item.iconPosition !== 'right' && renderIcon(item)}
        {item.label}
        {item.iconPosition === 'right' && renderIcon(item)}
        {renderBadge(item)}
      </NavLink>
    );
  };

  const renderSystemAction = (item) => {
    const visibilityClass = !item.desktopVisible ? 'd-lg-none' : (!item.mobileVisible ? 'd-none d-lg-block' : '');
    
    if (item.systemAction === 'search') {
      return (
        <button key={item.id} type="button" className={`btn btn-light btn-circle border-0 text-dark shadow-sm hover-elevate ${visibilityClass}`} data-bs-toggle="collapse" data-bs-target="#searchBar" aria-label="Search" onClick={(e) => e.preventDefault()}>
          <i className={item.icon || "fas fa-search"}></i>
        </button>
      );
    }
    if (item.systemAction === 'wishlist' && showWishlist) {
      return (
        <Link key={item.id} to="/wishlist" className={`btn btn-light btn-circle border-0 text-dark shadow-sm hover-elevate position-relative ${visibilityClass}`} aria-label="Wishlist">
          <i className={item.icon || "fas fa-heart"}></i>
          {wishlistCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{ fontSize: '0.65rem' }}>{wishlistCount > 99 ? '99+' : wishlistCount}</span>}
        </Link>
      );
    }
    if (item.systemAction === 'account') {
      return (
        <div key={item.id} className={`dropdown ${visibilityClass}`}>
          <button type="button" className="btn btn-light btn-circle border-0 text-dark shadow-sm hover-elevate position-relative" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Account">
            <i className={item.icon || "fas fa-user"}></i>
          </button>
          <div className="dropdown-menu dropdown-menu-end dropdown-menu-modern shadow border-0 m-0 mt-3 rounded-4 p-2" style={{ minWidth: '220px' }}>
            {user ? (
              <>
                <div className="px-3 py-3 border-bottom mb-2 bg-light rounded-3">
                  <span className="fw-bold d-block text-truncate text-dark">{user.name}</span>
                  <small className="text-muted text-truncate d-block">{user.email}</small>
                </div>
                <Link to="/account" className="dropdown-item rounded-3 py-2"><i className="fas fa-user-circle me-2 text-muted"></i>My Account</Link>
                <Link to="/account/orders" className="dropdown-item rounded-3 py-2"><i className="fas fa-box me-2 text-muted"></i>Order History</Link>
                {user.role === 'ADMIN' && <Link to="/admin" className="dropdown-item rounded-3 py-2"><i className="fas fa-shield-alt me-2 text-primary"></i>Admin Dashboard</Link>}
                <hr className="dropdown-divider my-2" />
                <button className="dropdown-item rounded-3 py-2 text-danger fw-medium" onClick={handleLogout}><i className="fas fa-sign-out-alt me-2"></i>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="dropdown-item rounded-3 py-2 fw-medium text-dark"><i className="fas fa-sign-in-alt me-2 text-primary"></i>Login</Link>
                <Link to="/register" className="dropdown-item rounded-3 py-2"><i className="fas fa-user-plus me-2 text-muted"></i>Register</Link>
              </>
            )}
          </div>
        </div>
      );
    }
    if (item.systemAction === 'cart') {
      return (
        <Link key={item.id} to="/cart" className={`btn btn-primary btn-circle shadow-sm hover-elevate position-relative ms-1 ${visibilityClass}`} aria-label="Cart">
          <i className={item.icon || "fas fa-shopping-cart text-white"}></i>
          {cart?.itemCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{ fontSize: '0.65rem' }}>{cart.itemCount > 99 ? '99+' : cart.itemCount}</span>}
        </Link>
      );
    }
    return null;
  };

  return (
    <>
      <div style={{ zIndex: 1030, pointerEvents: 'none', position: 'sticky', top: 10, marginBottom: '-80px' }}>
        <div className="container-fluid p-0">
          <nav className="navbar navbar-expand-lg floating-navbar" style={{ pointerEvents: 'auto' }}>
            <div className="container-fluid px-2 px-lg-4 py-2 d-flex align-items-center justify-content-between">
              
              {/* Left: Logo & Hamburger (Mobile) */}
              <div className="d-flex align-items-center flex-shrink-0" style={{ maxWidth: '40%' }}>
                <Link to="/" className="navbar-brand d-flex align-items-center">
                  {navbarLogoUrl ? (
                    <img
                      src={getImageUrl(navbarLogoUrl)}
                      alt={siteName}
                      className="me-2"
                      style={{ maxHeight: 34, maxWidth: 110, objectFit: 'contain' }}
                    />
                  ) : siteName ? (
                    <span className="fw-bold fs-5 text-dark text-truncate" style={{ letterSpacing: '-0.5px' }}>{siteName}</span>
                  ) : null}
                </Link>

                <button
                  className="navbar-toggler border-0 shadow-none p-1 ms-1 flex-shrink-0"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarCollapse"
                  aria-controls="navbarCollapse"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="fas fa-bars text-dark"></span>
                </button>
              </div>

              {/* Center: Main Navigation (Desktop) / Collapsed (Mobile) */}
              <div className="collapse navbar-collapse justify-content-center" id="navbarCollapse">
                <div className="navbar-nav mx-auto gap-1 py-3 py-lg-0">
                  {loading ? (
                    <span className="nav-link text-muted">Loading...</span>
                  ) : (
                    navLinks.map(item => renderNavItem(item))
                  )}
                </div>
              </div>

              {/* Right: System Actions (Always visible, responsive gap) */}
              <div
                className="d-flex align-items-center flex-nowrap gap-1 gap-lg-2 ms-auto ms-lg-3 flex-shrink-0"
                style={{ pointerEvents: 'auto' }}
              >
                {!loading && systemActions.map(item => renderSystemAction(item))}
              </div>
              
            </div>
          </nav>
        </div>
      </div>

      {/* Search Bar Dropdown Overlay */}
      <div className="collapse fixed-top" id="searchBar" style={{ zIndex: 1040 }}>
        <div className="container-fluid p-0">
          <div className="bg-white shadow-sm px-3 py-3 px-md-4 py-md-4 d-flex align-items-center justify-content-center" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.95)' }}>
            <form className="d-flex w-100" style={{ maxWidth: '800px' }} onSubmit={submitSearch}>
              <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border">
                <input className="form-control border-0 ps-4" type="text" placeholder="Search for products, categories..." value={query} onChange={(e) => setQuery(e.target.value)} style={{ boxShadow: 'none' }} autoFocus />
                <button type="submit" className="btn btn-primary text-white px-3 px-md-4"><i className="fas fa-search"></i> <span className="d-none d-md-inline">Search</span></button>
                <button type="button" className="btn btn-light px-3 px-md-4 border-start" onClick={() => { const bar = document.getElementById('searchBar'); if (bar) bar.classList.remove('show'); }}><i className="fas fa-times"></i></button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

