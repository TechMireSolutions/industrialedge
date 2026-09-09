import { getImageUrl } from '../utils/getImageUrl';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { cmsApi } from '../services'
import { useSettings } from '../context/SettingsContext'

export default function Footer() {
  const [footerContents, setFooterContents] = useState([])
  const { settings } = useSettings()
  const siteName = settings?.general?.siteName || ''
  const footerLogoUrl = settings?.branding?.footerLogoId?.storagePath || settings?.branding?.footerLogo?.storagePath || null

  // Theme colors from settings
  const primaryColor = settings?.theme?.primaryColor || '#181246'
  const bgColor = settings?.theme?.backgroundColor || '#0a0a0a'
  const cardColor = settings?.theme?.cardColor || '#111111'
  const textColor = settings?.theme?.textColor || '#ffffff'
  const borderColor = settings?.theme?.borderColor || 'rgba(255,255,255,0.1)'

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await cmsApi.getFooterContents()
        setFooterContents(response.data)
      } catch (error) {
        console.error('Failed to fetch footer data:', error)
      }
    }
    fetchFooter()
  }, [])

  const getContentBySection = (section) => {
    return footerContents.find((c) => c.section === section)
  }

  const parseSocialLinks = (value) => {
    if (!value) return {}

    // Already an object
    if (typeof value === 'object') {
      return value
    }

    try {
      return JSON.parse(value)
    } catch (error) {
      console.error('Invalid socialLinks JSON:', value, error)
      return {}
    }
  }

  const contactInfo = getContentBySection('contact')?.content || {}
  const customerService =
    getContentBySection('customer-service')?.content?.links || []
  const information = getContentBySection('information')?.content?.links || []
  const extras = getContentBySection('extras')?.content?.links || []

  return (
    <>
      <div className="container-fluid py-6 position-relative overflow-hidden" style={{ backgroundColor: bgColor }}>
        {/* Subtle background glow */}
        <div className="position-absolute top-0 start-50 translate-middle-x" style={{ width: '100%', height: '100%', background: `radial-gradient(ellipse at top, ${primaryColor}40 0%, transparent 70%)`, pointerEvents: 'none' }}></div>

        <div className="container position-relative z-1 pt-5">
          <div className="row g-5 mb-5">
            {/* Brand & Newsletter */}
            <div className="col-lg-4 pe-lg-5 mb-4 mb-lg-0 wow fadeInUp" data-wow-delay="0.1s">
              <Link to="/" className="text-decoration-none d-inline-block mb-4">
                <div className="d-flex align-items-center">
                  {footerLogoUrl ? (
                    <img src={getImageUrl(footerLogoUrl)} alt={siteName} className="me-3" style={{ height: 45, objectFit: 'contain' }} />
                  ) : siteName ? (
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 45, height: 45 }}>
                      <i className="fas fa-bolt text-white"></i>
                    </div>
                  ) : null}
                  {siteName && <h3 className="fw-bold" style={{ color: textColor, letterSpacing: '1px' }}>{siteName}</h3>}
                </div>
              </Link>
              <p className="mb-4" style={{ color: textColor, opacity: 0.75, lineHeight: '1.8' }}>
                Premium industrial tech and accessories. Elevate your workspace with cutting-edge equipment designed for professionals.
              </p>

              {settings?.featureFlags?.enableNewsletter !== false && (
                <>
                  <h5 className="fw-bold mb-3" style={{ color: textColor }}>Subscribe to Newsletter</h5>
                  <form className="position-relative">
                    <input
                      className="form-control rounded-pill py-3 ps-4 pe-5"
                      type="email"
                      placeholder="Your email address"
                      style={{ 
                        backgroundColor: cardColor, 
                        borderColor: borderColor,
                        color: textColor 
                      }}
                    />
                    <button type="submit" className="btn btn-primary rounded-pill position-absolute top-0 end-0 py-2 mt-2 me-2">
                      Subscribe
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Links Columns */}
            <div className="col-lg-8">
              <div className="row g-4">
                <div className="col-md-4 wow fadeInUp" data-wow-delay="0.2s">
                  <h5 className="fw-bold mb-4 text-uppercase" style={{ color: textColor, letterSpacing: '2px', fontSize: '0.9rem' }}>Customer Service</h5>
                  <ul className="list-unstyled d-flex flex-column gap-3">
                    {customerService.length > 0 ? (
                      customerService.map((link, i) => (
                        <li key={i}><Link to={link.url} className="text-decoration-none transition-all" style={{ color: textColor, opacity: 0.75 }}>{link.label}</Link></li>
                      ))
                    ) : (
                      <>
                        <li><Link to="/contact" className="text-decoration-none transition-all" style={{ color: textColor, opacity: 0.75 }}>Contact Us</Link></li>
                        <li><Link to="/page/returns" className="text-decoration-none transition-all" style={{ color: textColor, opacity: 0.75 }}>Returns</Link></li>
                        <li><Link to="/account/orders" className="text-decoration-none transition-all" style={{ color: textColor, opacity: 0.75 }}>Order History</Link></li>
                        <li><Link to="/account" className="text-decoration-none transition-all" style={{ color: textColor, opacity: 0.75 }}>My Account</Link></li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="col-md-4 wow fadeInUp" data-wow-delay="0.3s">
                  <h5 className="fw-bold mb-4 text-uppercase" style={{ color: textColor, letterSpacing: '2px', fontSize: '0.9rem' }}>Information</h5>
                  <ul className="list-unstyled d-flex flex-column gap-3">
                    {information.length > 0 ? (
                      information.map((link, i) => (
                        <li key={i}><Link to={link.url} className="text-decoration-none transition-all" style={{ color: textColor, opacity: 0.75 }}>{link.label}</Link></li>
                      ))
                    ) : (
                      <>
                        <li><Link to="/page/about" className="text-decoration-none transition-all" style={{ color: textColor, opacity: 0.75 }}>About Us</Link></li>
                        <li><Link to="/page/delivery-info" className="text-decoration-none transition-all" style={{ color: textColor, opacity: 0.75 }}>Delivery Info</Link></li>
                        <li><Link to="/page/privacy-policy" className="text-decoration-none transition-all" style={{ color: textColor, opacity: 0.75 }}>Privacy Policy</Link></li>
                        <li><Link to="/page/terms" className="text-decoration-none transition-all" style={{ color: textColor, opacity: 0.75 }}>Terms & Conditions</Link></li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="col-md-4 wow fadeInUp" data-wow-delay="0.4s">
                  <h5 className="fw-bold mb-4 text-uppercase" style={{ color: textColor, letterSpacing: '2px', fontSize: '0.9rem' }}>Contact Us</h5>
                  <ul className="list-unstyled d-flex flex-column gap-3" style={{ color: textColor, opacity: 0.75 }}>
                    {settings?.contact?.addresses && (
                      <li className="d-flex align-items-start gap-3">
                        <i className="fas fa-map-marker-alt mt-1" style={{ color: primaryColor }}></i>
                        <span>{settings.contact.addresses}</span>
                      </li>
                    )}
                    {settings?.contact?.emails && (
                      <li className="d-flex align-items-center gap-3">
                        <i className="fas fa-envelope" style={{ color: primaryColor }}></i>
                        <span>{settings.contact.emails}</span>
                      </li>
                    )}
                    {settings?.contact?.phones && (
                      <li className="d-flex align-items-center gap-3">
                        <i className="fas fa-phone-alt" style={{ color: primaryColor }}></i>
                        <span>{settings.contact.phones}</span>
                      </li>
                    )}
                  </ul>

                  {settings?.contact?.socialLinks && (
                    <div className="d-flex gap-2 mt-4">
                      {Object.entries(parseSocialLinks(settings.contact.socialLinks)).map(([platform, url]) => (
                        <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, borderColor: borderColor, color: textColor }}>
                          <i className={`fab fa-${platform}`}></i>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid py-4" style={{ backgroundColor: bgColor, borderTop: `1px solid ${borderColor}` }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <span style={{ color: textColor, opacity: 0.5, fontSize: '0.9rem' }}>
                &copy; {new Date().getFullYear()} <span className="fw-bold" style={{ color: textColor }}>{siteName}</span>. All Rights Reserved.
              </span>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="d-flex justify-content-center justify-content-md-end gap-3" style={{ color: textColor, opacity: 0.5, fontSize: '0.9rem' }}>
                <span>Secure Payments By</span>
                <i className="fab fa-cc-visa fa-lg"></i>
                <i className="fab fa-cc-mastercard fa-lg"></i>
                <i className="fab fa-cc-paypal fa-lg"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

