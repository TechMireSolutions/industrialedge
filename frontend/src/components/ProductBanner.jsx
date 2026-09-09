import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { cmsApi } from '../services'

export default function ProductBanner() {
  const [banners, setBanners] = useState([])

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await cmsApi.getBanners()
        setBanners(response.data)
      } catch (error) {
        console.error('Failed to fetch banners:', error)
      }
    }
    fetchBanners()
  }, [])

  if (!banners || banners.length === 0) {
    return null
  }

  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="row g-4">
          {banners.map((banner, i) => (
            <div key={banner.id || i} className="col-lg-6 wow fadeInLeft" data-wow-delay={`${0.1 + i * 0.1}s`}>
              <div className="bg-primary rounded position-relative overflow-hidden">
                <img src={getImageUrl(banner.image)} className="img-fluid w-100 rounded" alt="" />
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center rounded p-4" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                  <h3 className="display-5 text-primary">{banner.title}</h3>
                  {banner.description && <p className="fs-4 text-muted">{banner.description}</p>}
                  <Link to={banner.ctaUrl || '/shop'} className="btn btn-primary rounded-pill align-self-start py-2 px-4">
                    {banner.ctaText || 'Shop Now'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
