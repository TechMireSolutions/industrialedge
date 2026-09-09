
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../utils/getImageUrl'
import axios from 'axios'
import ProductCard from '../components/ProductCard.jsx'

import Services from '../components/Services.jsx'
import ProductOffer from '../components/ProductOffer.jsx'
import ProductBanner from '../components/ProductBanner.jsx'
import HeroBackground from '../components/HeroBackground.jsx'
import InfiniteMarquee from '../components/InfiniteMarquee.jsx'
import useCarousel from '../hooks/useCarousel.js'
import useWow from '../hooks/useWow.js'
import { useSettings } from '../context/SettingsContext.jsx'
import { productApi, cmsApi } from '../services'

function chunk(items, size) {
  const result = []
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size))
  return result
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('all')
  const [heroSlides, setHeroSlides] = useState([])
  const [partners, setPartners] = useState([])
  const [services, setServices] = useState([])
  const [offers, setOffers] = useState([])
  const [banners, setBanners] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [topSelling, setTopSelling] = useState([])
  const [bestsellerProducts, setBestsellerProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { settings } = useSettings()

  useWow()

  // Initialize carousels safely after loading finishes
  useCarousel(loading ? null : '.hero-carousel', {
    items: 1,
    autoplayTimeout: 3500,
    autoplayHoverPause: true,
    smartSpeed: 1000,
    nav: false,
    loop: heroSlides.length > 1
  })

  useCarousel(loading ? null : '.productList-carousel', {
    smartSpeed: 2000,
    responsiveClass: true,
    responsive: { 0: { items: 1 }, 576: { items: 1 }, 768: { items: 2 }, 992: { items: 2 }, 1200: { items: 3 } }
  })

  const tabs = [
    { id: 'all', label: 'All Products' },
    { id: 'new', label: 'New Arrivals' },
    { id: 'featured', label: 'Featured' },
    { id: 'top', label: 'Top Selling' }
  ]

  const getActiveProducts = () => {
    switch (activeTab) {
      case 'new': return newArrivals
      case 'featured': return featuredProducts
      case 'top': return topSelling
      default: return allProducts
    }
  }

  const siteName = settings?.general?.siteName || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [
          heroResponse,
          partnersResponse,
          servicesResponse,
          offersResponse,
          bannersResponse,
          allProductsResponse,
          newArrivalsResponse,
          featuredResponse,
          topSellingResponse,
          bestsellerResponse
        ] = await Promise.all([
          cmsApi.getHeroSlides(),
          cmsApi.getPartners ? cmsApi.getPartners() : axios.get('/partners'),
          cmsApi.getServices(),
          cmsApi.getOffers(),
          cmsApi.getBanners(),
          productApi.getAll({ limit: 8 }),
          productApi.getNewArrivals(8),
          productApi.getFeatured(8),
          productApi.getTopSelling(8),
          productApi.getBestsellers(8)
        ])

        setHeroSlides(heroResponse.data?.data || heroResponse.data || [])
        setPartners(partnersResponse.data?.data || partnersResponse.data || [])
        setServices(servicesResponse.data?.data || servicesResponse.data || [])
        setOffers(offersResponse.data?.data || offersResponse.data || [])
        setBanners(bannersResponse.data?.data || bannersResponse.data || [])
        setAllProducts(allProductsResponse.data?.data || [])
        setNewArrivals(newArrivalsResponse.data?.data || newArrivalsResponse.data || [])
        setFeaturedProducts(featuredResponse.data?.data || featuredResponse.data || [])
        setTopSelling(topSellingResponse.data?.data || topSellingResponse.data || [])
        setBestsellerProducts(bestsellerResponse.data?.data || bestsellerResponse.data || [])
      } catch (error) {
        console.error('Failed to fetch home data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="home-page-container">
      {/* 1. CINEMATIC HERO */}
      <style>{`
        .hero-product-img {
          transition: transform 8s ease-out, opacity 1.2s ease-out;
          transform: scale(0.95);
          opacity: 0;
        }
        .owl-item.active .hero-product-img {
          transform: scale(1.03);
          opacity: 1;
        }
        .hero-text-content {
          opacity: 0;
          transform: translateY(20px);
          transition: all 1s cubic-bezier(0.25, 1, 0.5, 1) 0.2s;
        }
        .owl-item.active .hero-text-content {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-title-line {
          display: block;
        }
        .hero-title-white {
          color: #ffffff;
        }
        .hero-title-purple {
          background: linear-gradient(90deg, var(--accent-color) 0%, var(--primary-color) 45%, var(--secondary-color) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        .hero-primary-button {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 45%, var(--accent-color) 100%);
          color: #fff;
          border: none;
          box-shadow: 0 0 25px rgba(43, 32, 125, 0.45), 0 8px 30px rgba(24, 18, 70, 0.3);
          transition: all 0.3s ease;
        }
        .hero-primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 35px rgba(71, 54, 191, 0.6), 0 10px 35px rgba(43, 32, 125, 0.4);
          color: #fff;
        }
        .hero-secondary-button {
          background: transparent;
          border: 2px solid var(--accent-color);
          color: #fff;
          transition: all 0.3s ease;
        }
        .hero-secondary-button:hover {
          background: rgba(43, 32, 125, 0.3);
          color: #fff;
        }
        .hero-section {
          background: var(--primary-color) !important;
        }
        .hero-bg::before {
          background: linear-gradient(90deg, var(--primary-color) 0%, var(--primary-color) 40%, var(--success-color) 100%) !important;
        }
        .hero-orb-1 {
          background: rgba(var(--success-color-rgb), 0.35) !important;
        }
        .hero-orb-2 {
          background: rgba(var(--success-color-rgb), 0.25) !important;
        }
        .hero-pill {
          background: linear-gradient(90deg, var(--success-color), var(--primary-color)) !important;
        }
        .hero-gradient-text {
          background: linear-gradient(90deg, var(--success-color), var(--primary-color), var(--accent-color)) !important;
        }
        .hero-btn {
          background: linear-gradient(90deg, var(--success-color), var(--primary-color)) !important;
        }
        .hero-glow {
          background: radial-gradient(circle, rgba(var(--success-color-rgb), 0.35) 0%, rgba(var(--success-color-rgb), 0.12) 55%, transparent 70%) !important;
        }
        .hero-card {
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.35) !important;
        }
        .hero-slide-item {
          min-height: max(100vh, 700px);
          display: flex;
          align-items: center;
          padding-top: 120px;
          padding-bottom: 4rem;
        }
        @media (max-width: 991.98px) {
          .hero-slide-item {
            min-height: auto;
            padding-top: 140px;
            padding-bottom: 5rem;
          }
        }
        @media (max-width: 767.98px) {
          .hero-slide-item {
            padding-top: 110px;
            padding-bottom: 4rem;
          }
        }
      `}</style>

      <div className="container-fluid hero-section px-0 position-relative overflow-hidden">
        <HeroBackground />

        <div className="hero-carousel owl-carousel position-relative z-2">
          {heroSlides.length > 0 ? (
            heroSlides.map((slide) => (
              <div key={slide.id} className="item w-100 position-relative hero-slide-item">

                {slide.backgroundImage && (
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      background: `url(${getImageUrl(slide.backgroundImage)}) center/cover no-repeat`,
                      zIndex: 0
                    }}
                  />
                )}

                {/* Darkening vignette for text contrast */}
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'radial-gradient(circle at center, transparent 30%, rgba(5,4,13,0.85) 100%)', zIndex: 1 }}></div>

                <div className="position-relative mx-auto" style={{ width: '100%', maxWidth: 'calc(100vw - 8vh)', zIndex: 2 }}>
                  <div className="d-flex flex-column flex-lg-row align-items-center justify-content-center w-100 gap-4 gap-lg-5">
                    {/* LEFT SIDE: Text Content */}
                    <div className="text-center text-lg-start z-3" style={{ flex: '0 1 auto', minWidth: 0 }}>
                      <div className="hero-text-content">
                        {slide.showEyebrow && slide.eyebrowText && (
                          <span className="badge rounded-pill px-3 py-2 mb-4 d-inline-block shadow-sm bg-primary" style={{ border: '1px solid rgba(255,255,255,0.1)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                            {slide.eyebrowText}
                          </span>
                        )}
                        <h1 className="display-3 fw-bold mb-4 lh-sm text-shadow-sm" style={{ letterSpacing: '-1px' }}>
                          {slide.titleLine1 && <span className="hero-title-line hero-title-white d-block text-truncate">{slide.titleLine1}</span>}
                          {slide.titleLine2 && <span className="hero-title-line hero-title-white d-block text-truncate">{slide.titleLine2}</span>}
                          {slide.titleLine3 && <span className="hero-title-line hero-title-purple d-block text-truncate">{slide.titleLine3}</span>}
                        </h1>
                        {slide.description && (
                          <p className="fs-5 text-light opacity-75 mb-5 mx-auto ms-lg-0" style={{ maxWidth: '450px' }}>
                            {slide.description}
                          </p>
                        )}
                        <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                          {slide.showPrimaryCTA && slide.primaryButtonText && (
                            <Link to={slide.primaryButtonUrl || '/shop'} className="btn hero-primary-button rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center">
                              <span>{slide.primaryButtonText}</span>
                              <i className="fas fa-arrow-right ms-2"></i>
                            </Link>
                          )}
                          {slide.showSecondaryCTA && slide.secondaryButtonText && (
                            <Link to={slide.secondaryButtonUrl || '/contact'} className="btn hero-secondary-button rounded-pill px-4 py-3 fw-bold d-inline-flex align-items-center">
                              {slide.secondaryButtonText}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT SIDE: Product Image */}
                    <div className="position-relative z-2" style={{ flex: '0 0 auto', width: '100%', maxWidth: '650px' }}>
                      <div className="hero-image-wrapper mx-auto position-relative">
                        <div className="position-absolute top-50 start-50 translate-middle rounded-circle" style={{ width: '70%', height: '70%', background: 'radial-gradient(circle, rgba(24,18,70,0.6) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: 1 }}></div>

                        <img
                          src={getImageUrl(slide.image || `${import.meta.env.BASE_URL}hero-laptop.png`)}
                          className="img-fluid position-relative z-2 hero-product-img"
                          alt={slide.imageAlt || 'Hero product visual'}
                          style={{ objectFit: 'contain', maxHeight: '550px', width: '100%', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="item w-100 position-relative hero-slide-item">
              <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)', zIndex: 0 }} />
              <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'radial-gradient(circle at center, transparent 30%, rgba(5,4,13,0.85) 100%)', zIndex: 1 }}></div>
              <div className="position-relative mx-auto" style={{ width: '100%', maxWidth: 'calc(100vw - 8vh)', zIndex: 2 }}>
                <div className="text-center z-3">
                  <div className="hero-text-content mx-auto">
                    <span className="badge rounded-pill px-3 py-2 mb-4 d-inline-block shadow-sm bg-primary" style={{ border: '1px solid rgba(255,255,255,0.1)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                      Welcome
                    </span>
                    <h1 className="display-3 fw-bold mb-4 lh-sm text-shadow-sm" style={{ letterSpacing: '-1px' }}>
                      <span className="hero-title-line hero-title-white d-block text-truncate">Welcome to</span>
                      <span className="hero-title-line hero-title-purple d-block text-truncate">Industrial Edge</span>
                    </h1>
                    <p className="fs-5 text-light opacity-75 mb-5 mx-auto" style={{ maxWidth: '600px' }}>
                      Explore our premium collection of industrial products and services. Set up your hero slides in the Admin Panel to customize this section.
                    </p>
                    <div className="d-flex flex-wrap gap-3 justify-content-center">
                      <Link to="/shop" className="btn hero-primary-button rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center">
                        <span>Shop Now</span>
                        <i className="fas fa-arrow-right ms-2"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 1.5 TRUSTED PARTNERS MARQUEE */}
      {(settings?.featureFlags?.enablePartners !== false) && partners && partners.length > 0 && (
        <div className="container-fluid py-4 bg-white text-center">
          <p className="text-muted fw-bold text-uppercase letter-spacing-2 mb-4" style={{ fontSize: '0.8rem' }}>Trusted by Industry Leaders</p>
          <InfiniteMarquee items={partners} speed={40} />
        </div>
      )}

      {/* 2. FEATURED PRODUCTS (ONLY FEATURED) */}
      <div className="container-fluid py-6 bg-white">
        <div className="container py-5">
          <div className="text-center mb-5 wow fadeInUp" data-wow-delay="0.1s">
            <span className="text-uppercase fw-bold text-muted letter-spacing-2">Curated Collection</span>
            <h2 className="display-4 fw-bold text-primary mt-2">Featured Products</h2>
            <div className="mx-auto mt-4 bg-primary" style={{ width: '60px', height: '4px' }}></div>
          </div>

          <div className="row g-4 justify-content-center">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={`${0.1 + i * 0.1}s`} />
              ))
            ) : (
              <div className="col-12 text-center text-muted">No featured products available at the moment.</div>
            )}
          </div>

          <div className="text-center mt-5 wow fadeInUp" data-wow-delay="0.4s">
            <Link to="/shop" className="btn btn-outline-dark rounded-pill px-5 py-3 fw-bold hover-elevate">
              View All Products
            </Link>
          </div>
        </div>
      </div>

      {/* 3. PROMOTIONAL CARDS (CMS CONTROLLED) */}
      {offers.length > 0 && (
        <div className="container-fluid py-5" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="container">
            <div className="row g-4">
              {offers.map((offer, i) => (
                <div key={offer.id} className="col-lg-6 wow fadeInUp" data-wow-delay={`${0.1 + i * 0.2}s`}>
                  <div className="position-relative overflow-hidden rounded-4 shadow-sm hover-elevate h-100 bg-primary offer-card" style={{ minHeight: '350px' }}>
                    <div className="position-absolute top-0 end-0 h-100 w-50 offer-card-img">
                      <img src={getImageUrl(offer.image)} className="h-100 w-100 object-fit-cover" style={{ opacity: 0.8, maskImage: 'linear-gradient(to right, transparent, black 50%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 50%)' }} alt={offer.title} />
                    </div>
                    <div className="position-relative z-1 p-5 d-flex flex-column justify-content-center h-100 w-75 offer-card-content">
                      <span className="badge bg-white text-dark align-self-start mb-3 rounded-pill px-3 py-2 fw-bold">
                        {offer.discount}% OFF
                      </span>
                      <h3 className="display-6 fw-bold text-white mb-3">{offer.title}</h3>
                      <p className="text-light opacity-75 mb-4 fs-5">{offer.description}</p>
                      <Link to={offer.ctaUrl || '/shop'} className="btn btn-light rounded-pill align-self-start px-4 py-2 fw-bold text-dark hover-scale">
                        {offer.ctaText || 'Shop Now'} <i className="fas fa-arrow-right ms-2"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. TRUST / SERVICE HIGHLIGHTS */}
      <Services services={services} />

      {/* 5. CTA SECTION (FIXED SCOPE ERROR) */}
      <div className="container-fluid py-6 position-relative overflow-hidden" style={{ backgroundColor: 'var(--primary-color)' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)' }}></div>
        <div className="container text-center position-relative z-1 py-5 wow zoomIn" data-wow-delay="0.1s">
          <h2 className="display-4 fw-bold mb-4" style={{ color: '#ffffff' }}>Ready to Upgrade?</h2>
          {siteName && (
            <p className="fs-4 mb-5 mx-auto" style={{ maxWidth: '700px', color: '#ffffff', opacity: 0.75 }}>
              Join thousands of satisfied professionals who trust {siteName} for their equipment needs.
            </p>
          )}
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            <Link
              to="/shop"
              className="btn rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center text-white border-0"
              style={{
                background: "var(--secondary-color)",
                boxShadow: "0 0 25px rgba(43, 32, 125, 0.45), 0 8px 30px rgba(24, 18, 70, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 0 35px rgba(71, 54, 191, 0.6), 0 10px 35px rgba(43, 32, 125, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 0 25px rgba(43, 32, 125, 0.45), 0 8px 30px rgba(24, 18, 70, 0.3)";
              }}
            >
              <span>Create Account</span>
              <i className="fas fa-arrow-right ms-2"></i>
            </Link>


            <Link
              to="/contact"
              className="btn rounded-pill px-4 py-3 fw-bold d-inline-flex align-items-center"
              style={{
                background: "transparent",
                border: "2px solid var(--secondary-color)",
                color: "var(--secondary-color)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--primary-color)";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--primary-color)";
              }}
            >
              Contact Sales
            </Link>

          </div>
        </div>
      </div>
    </div>
  )
}
