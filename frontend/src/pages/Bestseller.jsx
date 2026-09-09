import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import Services from '../components/Services.jsx'
import ProductOffer from '../components/ProductOffer.jsx'
import ProductBanner from '../components/ProductBanner.jsx'
import ProductCard from '../components/ProductCard.jsx'

import useCarousel from '../hooks/useCarousel.js'
import useWow from '../hooks/useWow.js'
import { productApi } from '../services'

function chunk(items, size) {
  const result = []
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size))
  return result
}

export default function Bestseller() {
  const [activeTab, setActiveTab] = useState('all')
  const [bestsellerProducts, setBestsellerProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [topSelling, setTopSelling] = useState([])
  const [loading, setLoading] = useState(true)
  useWow()
  useCarousel('.productList-carousel', {
    smartSpeed: 2000,
    responsiveClass: true,
    responsive: { 0: { items: 1 }, 576: { items: 1 }, 768: { items: 2 }, 992: { items: 2 }, 1200: { items: 3 } }
  })
  useCarousel('.productImg-carousel', { items: 1, smartSpeed: 1500 })

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [
          bestsellerResponse,
          allProductsResponse,
          newArrivalsResponse,
          featuredResponse,
          topSellingResponse
        ] = await Promise.all([
          productApi.getBestsellers(8),
          productApi.getAll({ limit: 8 }),
          productApi.getNewArrivals(8),
          productApi.getFeatured(8),
          productApi.getTopSelling(8)
        ])
        setBestsellerProducts(bestsellerResponse.data)
        setAllProducts(allProductsResponse.data)
        setNewArrivals(newArrivalsResponse.data)
        setFeaturedProducts(featuredResponse.data)
        setTopSelling(topSellingResponse.data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
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
    <>
      <PageHeader title="Bestseller Products" crumb="Bestseller" />

      <Services />

      <ProductOffer />

      {/* Bestseller Products Start */}
      <div className="container-fluid products pt-5">
        <div className="container products-mini py-5">
          <div className="mx-auto text-center mb-5" style={{ maxWidth: 700 }}>
            <h4 className="text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius wow fadeInUp" data-wow-delay="0.1s">Bestseller Products</h4>
            <p className="mb-0 wow fadeInUp" data-wow-delay="0.2s">Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, asperiores ducimus sint quos tempore officia similique quia? Libero, pariatur consectetur?</p>
          </div>
          <div className="row g-4">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="col-md-6 col-lg-6 col-xl-4 wow fadeInUp" data-wow-delay={`${0.1 + (n % 3) * 0.2}s`}>
                  <ProductCard product={bestsellerProducts[n % bestsellerProducts.length]} layout="list" colClass="col-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Bestseller Products End */}

      {/* Our Products Start */}
      <div className="container-fluid product pt-5">
        <div className="container py-5">
          <div className="tab-class">
            <div className="row g-4">
              <div className="col-lg-4 text-start wow fadeInLeft" data-wow-delay="0.1s">
                <h1>Our Products</h1>
              </div>
              <div className="col-lg-8 text-end wow fadeInRight" data-wow-delay="0.1s">
                <ul className="nav nav-pills d-inline-flex text-center mb-5">
                  {tabs.map((tab) => (
                    <li key={tab.id} className="nav-item mb-4">
                      <a className={`d-flex mx-2 py-2 bg-light rounded-pill ${activeTab === tab.id ? 'active' : ''}`}
                        href={`#${tab.id}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab(tab.id) }}>
                        <span className="text-dark" style={{ width: 130 }}>{tab.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="tab-content">
              <div className="tab-pane fade show p-0 active">
                <div className="row g-4">
                  {getActiveProducts().map((p, i) => (
                    <ProductCard key={p.id} product={p} delay={`${0.1 + (i % 3) * 0.2}s`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Our Products End */}

      {/* Product List Start */}
      <div className="container-fluid products productList overflow-hidden">
        <div className="container products-mini py-5">
          <div className="mx-auto text-center mb-5" style={{ maxWidth: 900 }}>
            <h4 className="text-primary border-bottom border-primary border-2 d-inline-block p-2 title-border-radius wow fadeInUp" data-wow-delay="0.1s">Products</h4>
            <h1 className="mb-0 display-3 wow fadeInUp" data-wow-delay="0.3s">All Product Items</h1>
          </div>
          <div className="productList-carousel owl-carousel pt-4 wow fadeInUp" data-wow-delay="0.3s">
            {chunk(bestsellerProducts.concat(bestsellerProducts, bestsellerProducts), 4).map((group, gi) => (
              <div key={gi} className="productImg-carousel owl-carousel productList-item">
                {group.map((p) => (
                    <ProductCard product={p} layout="list" colClass="col-lg-6" />))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Product List End */}

      <ProductBanner />
    </>
  )
}
