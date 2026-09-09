import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { cmsApi } from '../services'

export default function ProductOffer() {
  const [offers, setOffers] = useState([])

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await cmsApi.getOffers()
        setOffers(response.data)
      } catch (error) {
        console.error('Failed to fetch offers:', error)
      }
    }
    fetchOffers()
  }, [])

  if (!offers || offers.length === 0) {
    return null
  }

  return (
    <div className="container-fluid bg-light py-5">
      <div className="container">
        <div className="row g-4">
          {offers.map((offer, i) => (
            <div key={offer.id || i} className="col-lg-6 wow fadeInLeft" data-wow-delay={`${0.2 + i * 0.1}s`}>
              <Link to={offer.ctaUrl || '#'} className="d-flex align-items-center justify-content-between border bg-white rounded p-4 text-decoration-none">
                <div>
                  <p className="text-muted mb-3">{offer.description}</p>
                  <h3 className="text-primary">{offer.title}</h3>
                  <h1 className="display-3 text-secondary mb-0">{offer.discount}% <span className="text-primary fw-normal">Off</span></h1>
                </div>
                <img src={getImageUrl(offer.image)} className="img-fluid" alt={offer.title || ''} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
