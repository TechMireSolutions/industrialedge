import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import Services from '../components/Services.jsx'
import ProductOffer from '../components/ProductOffer.jsx'
import ProductBanner from '../components/ProductBanner.jsx'
import ShopSidebar from '../components/ShopSidebar.jsx'
import ProductCard from '../components/ProductCard.jsx'

import useWow from '../hooks/useWow.js'
import { productApi, categoryApi, cmsApi } from '../services'

export default function Shop() {
  const [view, setView] = useState('grid')
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const q = searchParams.get('q') || ''
  const urlCategory = searchParams.get('category') || ''
  const urlCollection = searchParams.get('collection') || ''
  const urlTag = searchParams.get('tag') || ''
  const urlSale = searchParams.get('sale') === 'true'
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 })
  const [filters, setFilters] = useState({
    category: urlCategory,
    collection: urlCollection,
    tag: urlTag,
    minPrice: '',
    maxPrice: '',
    sort: 'default',
    sale: urlSale
  })
  useWow()

  const fetchProducts = async (page = 1) => {
    // This is now handled by useEffect directly to prevent race conditions
  }

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll(true)
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchTags = async () => {
    try {
      const response = await productApi.getTags()
      setTags(response.data)
    } catch (error) {
      console.error('Failed to fetch tags:', error)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchTags()
  }, [])

  useEffect(() => {
    let active = true

    const loadProducts = async () => {
      setLoading(true)
      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          search: q || undefined,
          category: filters.category || undefined,
          collection: filters.collection || undefined,
          tag: filters.tag || undefined,
          sale: filters.sale || undefined,
          minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
          maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
          sort: filters.sort === 'price-asc' ? 'price' : filters.sort === 'price-desc' ? 'price' : undefined,
          order: filters.sort === 'price-asc' ? 'asc' : filters.sort === 'price-desc' ? 'desc' : 'desc',
        }
        const response = await productApi.getAll(params)
        
        if (!active) return

        setProducts(response.data || [])
        if (response.pagination) {
          setPagination(prev => ({ 
            ...prev, 
            total: response.pagination.total, 
            totalPages: response.pagination.totalPages 
          }))
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProducts()

    return () => {
      active = false
    }
  }, [q, filters.category, filters.collection, filters.tag, filters.sale, filters.minPrice, filters.maxPrice, filters.sort, pagination.page, pagination.limit])

  const handleSearch = (term) => {
    setSearchParams(term ? { q: term } : {})
    setFilters(prev => ({ ...prev, category: '', collection: '', tag: '', minPrice: '', maxPrice: '', sale: false }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page }))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSortChange = (e) => {
    handleFilterChange('sort', e.target.value)
  }

  const clearFilters = () => {
    setFilters({ category: '', collection: '', tag: '', minPrice: '', maxPrice: '', sort: 'default', sale: false })
    setPagination(prev => ({ ...prev, page: 1 }))
    setSearchParams({})
  }

  return (
    <>
      <PageHeader title="Shop" crumb="Shop" />

      <Services />

      <ProductOffer />

      {/* Shop Page */}
      <div className="container-fluid shop py-5">
        <div className="container py-5">
          <div className="row g-4">
            <div className="col-lg-3 wow fadeInUp" data-wow-delay="0.1s">
              <ShopSidebar
                query={q}
                onSearch={handleSearch}
                categories={categories}
                tags={tags}
                selectedCategory={filters.category}
                onCategoryChange={(cat) => handleFilterChange('category', cat)}
                selectedTag={filters.tag}
                onTagChange={(tag) => handleFilterChange('tag', tag)}
                priceRange={{ min: filters.minPrice, max: filters.maxPrice }}
                onPriceChange={(min, max) => { handleFilterChange('minPrice', min); handleFilterChange('maxPrice', max); }}
              />
            </div>
            <div className="col-lg-9 wow fadeInUp" data-wow-delay="0.1s">


              {q && (
                <div className="d-flex justify-content-between align-items-center bg-light rounded p-3 mb-4">
                  <p className="mb-0">Showing results for <strong>"{q}"</strong> ({pagination.total} found)</p>
                  <button className="btn btn-sm btn-outline-primary" onClick={clearFilters}>Clear all filters</button>
                </div>
              )}

              {(filters.category || filters.collection || filters.tag || filters.sale || filters.minPrice || filters.maxPrice) && (
                <div className="d-flex justify-content-between align-items-center bg-light rounded p-3 mb-4">
                  <p className="mb-0">
                    Active filters:
                    {filters.category && <span className="badge bg-primary ms-2">{categories.find(c => c.slug === filters.category)?.name || filters.category}</span>}
                    {filters.collection && <span className="badge bg-primary ms-2">Collection: {filters.collection}</span>}
                    {filters.tag && <span className="badge bg-primary ms-2">Tag: {filters.tag}</span>}
                    {filters.sale && <span className="badge bg-primary ms-2">On Sale</span>}
                    {filters.minPrice && <span className="badge bg-primary ms-2">Min: ${filters.minPrice}</span>}
                    {filters.maxPrice && <span className="badge bg-primary ms-2">Max: ${filters.maxPrice}</span>}
                  </p>
                  <button className="btn btn-sm btn-outline-primary" onClick={clearFilters}>Clear all</button>
                </div>
              )}

              <div className="row g-4 mb-4">
                <div className="col-xl-7">
                  <div className="filter-widget rounded-4 shadow-sm d-flex align-items-stretch" style={{ overflow: 'hidden' }}>
                    <input 
                      type="search" 
                      className="form-control border-0 p-3 shadow-none focus-ring-none" 
                      placeholder="Search products..." 
                      defaultValue={q} 
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.target.value)} 
                      style={{ outline: 'none', boxShadow: 'none', backgroundColor: '#ffffff' }}
                    />
                    <button 
                      type="button" 
                      className="btn border-0 px-4 text-secondary transition-all d-flex align-items-center justify-content-center"
                      onClick={() => { const input = document.querySelector('.col-xl-7 input'); if (input) handleSearch(input.value); }} 
                      style={{ backgroundColor: 'var(--card-bg-color, #f8f9fa)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
                    >
                      <i className="fa fa-search"></i>
                    </button>
                  </div>
                </div>
                <div className="col-xl-3 text-end">
                  <div className="px-3 py-3 rounded-4 shadow-sm d-flex justify-content-between align-items-center h-100" style={{ backgroundColor: 'var(--card-bg-color, #f8f9fa)' }}>
                    <label htmlFor="sort-select" className="me-2 mb-0 fw-medium small text-uppercase" style={{ letterSpacing: '0.5px' }}>Sort By:</label>
                    <select id="sort-select" className="border-0 form-select-sm shadow-none cursor-pointer" style={{ backgroundColor: 'transparent', outline: 'none' }} value={filters.sort} onChange={handleSortChange}>
                      <option value="default">Default</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="newest">Newest</option>
                      <option value="popularity">Popularity</option>
                      <option value="rating">Top Rated</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-4 col-xl-2">
                  <div className="d-inline-flex justify-content-center align-items-center h-100 w-100 rounded-4 shadow-sm px-2" style={{ backgroundColor: 'var(--card-bg-color, #f8f9fa)' }}>
                    <button 
                      className={`btn border-0 p-2 mx-1 transition-all ${view === 'grid' ? 'text-primary' : 'text-secondary'}`} 
                      style={{ backgroundColor: 'transparent', transform: view === 'grid' ? 'scale(1.1)' : 'scale(1)' }} 
                      onClick={() => setView('grid')} 
                      title="Grid View"
                    >
                      <i className="fas fa-th fs-5"></i>
                    </button>
                    <button 
                      className={`btn border-0 p-2 mx-1 transition-all ${view === 'list' ? 'text-primary' : 'text-secondary'}`} 
                      style={{ backgroundColor: 'transparent', transform: view === 'list' ? 'scale(1.1)' : 'scale(1)' }} 
                      onClick={() => setView('list')} 
                      title="List View"
                    >
                      <i className="fas fa-bars fs-5"></i>
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : products.length > 0 ? (
                <>
                  {view === 'grid' ? (
                    <div className="row g-4 product">
                      {products.map((p, i) => (
                        <ProductCard key={p.id} product={p} delay={`${0.1 + (i % 3) * 0.2}s`} />
                      ))}
                    </div>
                  ) : (
                    <div className="row g-4 product">
                      {products.map((p, i) => (
                        <ProductCard key={p.id} product={p} layout="list" colClass="col-lg-6" delay={`${0.1 + (i % 3) * 0.2}s`} />
                      ))}
                      {pagination.totalPages > 1 && (
                        <div className="col-12 wow fadeInUp" data-wow-delay="0.1s">
                          <nav aria-label="Product pagination">
                            <ul className="pagination justify-content-center mt-5">
                              <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(pagination.page - 1)} aria-label="Previous">&laquo;</button>
                              </li>
                              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                                let pageNum
                                if (pagination.totalPages <= 5) pageNum = i + 1
                                else if (pagination.page <= 3) pageNum = i + 1
                                else if (pagination.page >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i
                                else pageNum = pagination.page - 2 + i
                                return (
                                  <li key={pageNum} className={`page-item ${pagination.page === pageNum ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(pageNum)}>{pageNum}</button>
                                  </li>
                                )
                              })}
                              <li className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(pagination.page + 1)} aria-label="Next">&raquo;</button>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-search fa-3x text-muted mb-3"></i>
                  <h4>No products found</h4>
                  <p className="text-muted">Try a different keyword or adjust your filters.</p>
                  <button className="btn btn-primary mt-3" onClick={clearFilters}>Clear Filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ProductBanner />
    </>
  )
}
