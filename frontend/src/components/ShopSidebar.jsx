import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function ShopSidebar({
  withPrice = true,
  withColor = true,
  query = '',
  onSearch,
  categories = [],
  tags = [],
  selectedCategory = '',
  onCategoryChange,
  selectedTag = '',
  onTagChange,
  priceRange = { min: '', max: '' },
  onPriceChange,
}) {
  const [term, setTerm] = useState(query)
  const [price, setPrice] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    setTerm(query)
  }, [query])

  const submitSearch = (e) => {
    e.preventDefault()
    const t = term.trim()
    if (onSearch) {
      onSearch(t)
    } else {
      navigate(t ? `/shop?q=${encodeURIComponent(t)}` : '/shop')
    }
  }

  const handleCategoryClick = (categorySlug) => {
    if (onCategoryChange) {
      onCategoryChange(categorySlug === selectedCategory ? '' : categorySlug)
    }
  }

  const handlePriceChange = (e) => {
    const value = parseFloat(e.target.value)
    setPrice(value)
    if (onPriceChange) {
      onPriceChange(value, value) // min and max same for single slider
    }
  }

  return (
    <div className="shop-sidebar-modern">
      {/* Search Widget */}
      <div className="filter-widget mb-4 rounded-4 shadow-sm d-flex align-items-stretch" style={{ overflow: 'hidden' }}>
        <input 
          type="search" 
          className="form-control border-0 p-3 shadow-none focus-ring-none" 
          placeholder="Search keywords..." 
          value={term} 
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submitSearch(e);
            }
          }}
          style={{ outline: 'none', boxShadow: 'none', backgroundColor: '#ffffff' }}
        />
        <button 
          type="button" 
          className="btn border-0 px-4 text-secondary transition-all d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'var(--card-bg-color, #f8f9fa)' }}
          onClick={submitSearch}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
        >
          <i className="fa fa-search"></i>
        </button>
      </div>

      {/* Categories Widget */}
      <div className="filter-widget mb-4 rounded-4 shadow-sm p-4" style={{ backgroundColor: 'var(--card-bg-color, #f8f9fa)' }}>
        <h5 className="mb-4 fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.9rem' }}>
          Categories
        </h5>
        <ul className="list-unstyled m-0 d-flex flex-column gap-2">
          {categories.map((c) => {
            const isActive = selectedCategory === c.slug;
            return (
              <li key={c.slug}>
                <button
                  className={`w-100 text-start d-flex justify-content-between align-items-center rounded-3 p-2 transition-all border-0 ${isActive ? 'bg-primary text-white' : 'bg-transparent text-body'}`}
                  onClick={() => handleCategoryClick(c.slug)}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  style={{ transition: 'all 0.2s ease-in-out' }}
                >
                  <span className="d-flex align-items-center gap-2">
                    <i className={`fas fa-circle ${isActive ? 'text-white' : 'text-secondary'} small`} style={{ fontSize: '6px' }}></i>
                    {c.name}
                  </span>
                  <span className={`badge rounded-pill ${isActive ? 'bg-white text-primary' : 'bg-white border text-secondary'}`}>
                    {c._count?.products || 0}
                  </span>
                </button>
              </li>
            );
          })}
          {categories.length === 0 && <span className="text-muted small">No categories found</span>}
        </ul>
      </div>

      {/* Price Range Widget */}
      {withPrice && (
        <div className="filter-widget mb-4 rounded-4 shadow-sm p-4" style={{ backgroundColor: 'var(--card-bg-color, #f8f9fa)' }}>
          <h5 className="mb-4 fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.9rem' }}>
            Price Range
          </h5>
          <div className="row g-2 mb-3">
            <div className="col-6">
              <div className="form-floating">
                <input 
                  type="number" 
                  className="form-control rounded-3" 
                  id="minPrice" 
                  placeholder="Min" 
                  value={priceRange.min} 
                  onChange={(e) => onPriceChange?.(e.target.value, priceRange.max)} 
                  style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.1)' }}
                />
                <label htmlFor="minPrice">Min $</label>
              </div>
            </div>
            <div className="col-6">
              <div className="form-floating">
                <input 
                  type="number" 
                  className="form-control rounded-3" 
                  id="maxPrice" 
                  placeholder="Max" 
                  value={priceRange.max} 
                  onChange={(e) => onPriceChange?.(priceRange.min, e.target.value)} 
                  style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.1)' }}
                />
                <label htmlFor="maxPrice">Max $</label>
              </div>
            </div>
          </div>
          <div className="mt-2 px-1">
            <input 
              type="range" 
              className="form-range" 
              min="0" 
              max="10000" 
              step="10"
              value={price} 
              onChange={handlePriceChange} 
            />
            <div className="d-flex justify-content-between text-muted small mt-1 fw-medium">
              <span>$0</span>
              <span className="text-primary fw-bold">${price.toFixed(0)}</span>
              <span>$10,000</span>
            </div>
          </div>
        </div>
      )}

      {/* Product Tags Widget */}
      <div className="filter-widget rounded-4 shadow-sm p-4" style={{ backgroundColor: 'var(--card-bg-color, #f8f9fa)' }}>
        <h5 className="mb-4 fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.9rem' }}>
          Product Tags
        </h5>
        <div className="d-flex flex-wrap gap-2">
          {tags.map((t) => {
            const isActive = selectedTag === t.slug;
            return (
              <button
                key={t.slug}
                className={`btn rounded-pill border px-3 py-1 text-sm transition-all ${isActive ? 'bg-primary text-white border-primary' : 'bg-white text-secondary'}`}
                onClick={() => onTagChange && onTagChange(selectedTag === t.slug ? '' : t.slug)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.classList.remove('text-secondary');
                    e.currentTarget.classList.add('text-primary');
                    e.currentTarget.style.borderColor = 'var(--primary-color)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.classList.remove('text-primary');
                    e.currentTarget.classList.add('text-secondary');
                    e.currentTarget.style.borderColor = 'var(--bs-border-color)';
                  }
                }}
                style={{ fontSize: '0.85rem' }}
              >
                {t.name}
              </button>
            );
          })}
          {tags.length === 0 && <span className="text-muted small">No tags found</span>}
        </div>
      </div>
    </div>
  )
}
