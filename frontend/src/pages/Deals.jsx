import { getImageUrl } from '../utils/getImageUrl';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { cmsApi, productApi } from '../services'

export default function Deals() {
  const [offers, setOffers] = useState([])
  const [saleProducts, setSaleProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [offersRes, productsRes] = await Promise.all([
          cmsApi.getOffers(),
          productApi.getAll({ sale: true, limit: 12 })
        ])
        setOffers(offersRes.data || [])
        setSaleProducts(productsRes.data?.data || [])
      } catch (error) {
        console.error('Failed to fetch deals data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    )
  }

  return (
    <>
      <PageHeader title="Deals & Offers" crumb="Deals" />

      {/* Offers Section */}
      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: 700 }}>
            <h1 className="display-4 text-primary wow border-bottom border-primary d-inline-block pb-2">Current Promotions</h1>
            <p className="lead mt-3 text-muted">Take advantage of our exclusive offers before they expire!</p>
          </div>
          
          {offers.length === 0 ? (
            <div className="text-center text-muted py-4">No active promotions at the moment.</div>
          ) : (
            <div className="row g-4">
              {offers.map((offer, index) => {
                const now = new Date()
                const start = offer.startDate ? new Date(offer.startDate) : null
                const end = offer.endDate ? new Date(offer.endDate) : null
                
                let statusBadge = null
                if (start && start > now) {
                  statusBadge = <span className="badge bg-info mb-3 d-inline-block fs-6">Upcoming</span>
                } else if (end && end < now) {
                  statusBadge = <span className="badge bg-secondary mb-3 d-inline-block fs-6">Expired</span>
                } else if (end) {
                  const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
                  statusBadge = <span className="badge bg-warning text-dark mb-3 d-inline-block fs-6">Ends in {daysLeft} days!</span>
                }

                return (
                  <div key={offer.id} className="col-lg-6 col-xl-4 wow fadeInUp" data-wow-delay={`${0.1 + (index * 0.1)}s`}>
                    <div className="card h-100 shadow-sm border-0 position-relative rounded overflow-hidden">
                      <div className="position-absolute top-0 start-0 m-3 z-index-1">
                        <span className="badge bg-danger fs-5 px-3 py-2 rounded-pill shadow">
                          {offer.discount}% OFF
                        </span>
                      </div>
                      <img src={getImageUrl(offer.image)} className="card-img-top" alt={offer.title} style={{ height: 250, objectFit: 'cover' }} />
                      <div className="card-body p-4 d-flex flex-column">
                        {statusBadge}
                        <h4 className="card-title fw-bold mb-3">{offer.title}</h4>
                        <p className="card-text text-muted mb-4 flex-grow-1">{offer.description}</p>
                        {offer.ctaUrl && (
                          <Link to={offer.ctaUrl} className="btn btn-outline-primary rounded-pill w-100 py-2 fw-bold">
                            {offer.ctaText || 'Shop Now'}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sale Products Section */}
      <div className="container-fluid bg-light py-5">
        <div className="container py-5">
          <div className="d-flex justify-content-between align-items-center mb-5 border-bottom border-primary pb-3">
            <h2 className="m-0 text-primary fw-bold">Products on Sale</h2>
            <Link to="/shop?sale=true" className="btn btn-outline-primary rounded-pill px-4">View All Sale Items</Link>
          </div>
          
          {saleProducts.length === 0 ? (
            <div className="text-center text-muted py-4">No products currently on sale.</div>
          ) : (
            <div className="row g-4 product">
              {saleProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={`${0.1 + (i % 3) * 0.2}s`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

