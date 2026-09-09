import { getImageUrl } from '../utils/getImageUrl';
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useSettings } from '../context/SettingsContext'

export default function ProductCard({ product, delay = '0.1s', layout = 'grid', colClass = 'col-md-6 col-lg-4 col-xl-3' }) {
  const { addToCart } = useCart()
  const { settings } = useSettings()
  const showWishlist = settings?.featureFlags?.enableWishlist ?? true
  const showReviews = settings?.featureFlags?.enableReviews ?? true
  const showCompare = settings?.featureFlags?.enableCompare ?? true

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product.id, 1)
  }

  const discount = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  let parsedImages = [];
  try {
    if (typeof product.images === 'string') {
      parsedImages = JSON.parse(product.images);
    } else if (Array.isArray(product.images)) {
      parsedImages = product.images;
    }
  } catch (e) {
    // silently fail
  }

  const coverImage = parsedImages?.[0] || product.img || `${import.meta.env.BASE_URL}img/placeholder.png`;

  if (layout === 'list') {
    return (
      <div className={colClass}>
        <div className="products-mini-item border wow fadeInUp" data-wow-delay={delay}>
          <div className="row g-0">
            <div className="col-5">
              <div className="products-mini-img border-end h-100">
                <Link to={`/product/${product.slug}`}>
                  <img src={getImageUrl(coverImage)} className="img-fluid w-100 h-100" style={{ objectFit: 'cover' }} alt={product.name} />
                </Link>
                <div className="products-mini-icon rounded-circle bg-primary">
                  <Link to={`/product/${product.slug}`}><i className="fa fa-eye fa-1x text-white"></i></Link>
                </div>
              </div>
            </div>
            <div className="col-7">
              <div className="products-mini-content p-3">
                <Link to={`/shop?category=${product.category?.slug}`} className="d-block mb-2 text-muted small text-decoration-none">{product.category?.name || 'Uncategorized'}</Link>
                <Link to={`/product/${product.slug}`} className="d-block h5 text-decoration-none text-dark fw-bold text-truncate" title={product.name}>{product.name}</Link>
                <div className="d-flex align-items-center gap-2 mt-2">
                  <span className="text-primary fw-bold fs-5">${Number(product.price).toFixed(2)}</span>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <del className="fs-6 text-muted">${Number(product.oldPrice).toFixed(2)}</del>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="products-mini-add border-top p-3 bg-light">
            <button className="btn btn-primary rounded-pill py-2 px-4 w-100 fw-bold shadow-sm hover-elevate" onClick={handleAddToCart}>
              <i className="fas fa-shopping-cart me-2"></i> Add To Cart
            </button>
            <div className="d-flex justify-content-center gap-2 mt-2">
              {showCompare && <button className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '35px', height: '35px' }} title="Compare"><i className="fas fa-random"></i></button>}
              {showWishlist && <button className="btn btn-sm btn-outline-danger rounded-circle" style={{ width: '35px', height: '35px' }} title="Wishlist"><i className="fas fa-heart"></i></button>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={colClass}>
      <div className="product-card-modern wow fadeInUp" data-wow-delay={delay}>
        {/* Image & Badges */}
        <div className="product-img-wrapper">
          <Link to={`/product/${product.slug}`}>
            <img src={getImageUrl(coverImage)} alt={product.name} />
          </Link>
          
          <div className="product-badges">
            {product.isFeatured && <span className="badge bg-primary rounded-pill px-3 py-2">Featured</span>}
            {product.isNew && <span className="badge bg-success rounded-pill px-3 py-2">New</span>}
            {discount > 0 && <span className="badge bg-danger rounded-pill px-3 py-2">-{discount}%</span>}
          </div>

          {showWishlist && (
            <button className="product-wishlist-btn" title="Add to Wishlist">
              <i className="fas fa-heart"></i>
            </button>
          )}

          <div className="product-action-overlay">
            <button className="btn btn-primary rounded-pill w-100 fw-bold shadow-sm" onClick={handleAddToCart}>
              <i className="fas fa-shopping-cart me-2"></i> Add To Cart
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="p-4 d-flex flex-column flex-grow-1">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Link to={`/shop?category=${product.category?.slug}`} className="text-muted small text-decoration-none text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
              {product.category?.name || 'Uncategorized'}
            </Link>
            {showReviews && (
              <div className="d-flex align-items-center text-warning" style={{ fontSize: '0.8rem' }}>
                <i className="fas fa-star me-1"></i>
                <span className="text-dark fw-bold">{Number(product.rating || 0).toFixed(1)}</span>
                <span className="text-muted ms-1">({product.reviewCount || 0})</span>
              </div>
            )}
          </div>
          
          {product.tags && product.tags.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mb-2">
              {product.tags.map(tag => (
                <Link key={tag.id} to={`/shop?tag=${tag.slug}`} className="badge bg-light text-secondary text-decoration-none border border-secondary" style={{ fontSize: '0.65rem' }}>
                  {tag.name}
                </Link>
              ))}
            </div>
          )}
          
          <Link to={`/product/${product.slug}`} className="h5 text-dark text-decoration-none fw-bold mb-3 d-block text-truncate" title={product.name}>
            {product.name}
          </Link>
          
          <div className="mt-auto d-flex align-items-center gap-2">
            <span className="fs-5 fw-bold text-primary">${Number(product.price).toFixed(2)}</span>
            {product.oldPrice && product.oldPrice > product.price && (
              <del className="small text-muted">${Number(product.oldPrice).toFixed(2)}</del>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

