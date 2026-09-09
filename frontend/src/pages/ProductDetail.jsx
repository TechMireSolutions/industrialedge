import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import ProductCard from '../components/ProductCard.jsx'
import useCarousel from '../hooks/useCarousel.js'
import useWow from '../hooks/useWow.js'
import { productApi } from '../services'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../hooks/useWishlist'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, checkWishlist: checkWishlistApi } = useWishlist()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('about')
  const [quantity, setQuantity] = useState(1)
  const [inWishlist, setInWishlist] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useWow()
  useCarousel('.related-carousel', {
    responsiveClass: true,
    responsive: { 0: { items: 1 }, 576: { items: 1 }, 768: { items: 2 }, 992: { items: 3 }, 1200: { items: 4 } }
  }, [loading, relatedProducts])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productApi.getBySlug(slug)
        setProduct(response.data)
        if (user) {
          const wishlistCheck = await checkWishlistApi(response.data.id)
          setInWishlist(wishlistCheck)
        }
        const relatedResponse = await productApi.getRelated(response.data.id)
        setRelatedProducts(relatedResponse.data)
      } catch (error) {
        console.error('Failed to fetch product:', error)
        navigate('/shop')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug, navigate, user, checkWishlistApi])

  useEffect(() => {
    if (product) {
      fetchReviews()
    }
  }, [product, tab])

  const fetchReviews = async () => {
    setReviewsLoading(true)
    try {
      const response = await productApi.getProductReviews(product.id, 1, 10, true)
      setReviews(response.data || [])
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setReviewsLoading(false)
    }
  }

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  const handleExpressCheckout = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await addToCart(product.id, quantity)
    navigate('/checkout')
  }

  const handleRelatedWishlist = async (productId) => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${slug}` } })
      return
    }
    try {
      await addToWishlist(productId)
    } catch (error) {
      console.error('Failed to add to wishlist:', error)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login', { state: { from: `/product/${slug}` } })
      return
    }
    setSubmittingReview(true)
    try {
      await productApi.submitReview(product.id, reviewForm)
      setReviewForm({ rating: 5, title: '', comment: '' })
      fetchReviews()
    } catch (error) {
      console.error('Failed to submit review:', error)
    } finally {
      setSubmittingReview(false)
    }
  }

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

  if (!product) {
    return <Navigate to="/shop" replace />
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
    console.warn('Failed to parse product images:', e);
  }

  const productImages = parsedImages.length > 0 
    ? parsedImages 
    : (product.img ? [product.img] : [`${import.meta.env.BASE_URL}img/placeholder.png`])

  return (
    <>
      <PageHeader title={product.name} crumb="Product" />

      {/* Single Product Start */}
      <div className="container-fluid py-5 bg-white">
        <div className="container py-4">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/shop" className="text-decoration-none text-muted">Shop</Link></li>
              <li className="breadcrumb-item"><Link to={`/shop?category=${product.category?.slug}`} className="text-decoration-none text-muted">{product.category?.name}</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
            </ol>
          </nav>

          <div className="row g-5">
            {/* Left Column: Images */}
            <div className="col-lg-6 wow fadeInLeft" data-wow-delay="0.1s">
              <div className="position-relative bg-light rounded-4 overflow-hidden mb-3 d-flex align-items-center justify-content-center" style={{ height: '600px' }}>
                <img src={getImageUrl(productImages[activeImageIndex])} className="img-fluid" style={{ maxHeight: '100%', objectFit: 'contain' }} alt={product.name} />
                
                {/* Floating Wishlist Button */}
                <button 
                  className={`btn rounded-circle position-absolute top-0 end-0 m-4 shadow-sm hover-elevate d-flex align-items-center justify-content-center ${inWishlist ? 'btn-danger text-white' : 'btn-white text-muted'}`} 
                  style={{ width: '45px', height: '45px', backgroundColor: inWishlist ? '' : '#ffffff', zIndex: 10 }}
                  onClick={() => inWishlist ? removeFromWishlist(product.id).then(() => setInWishlist(false)) : addToWishlist(product.id).then(() => setInWishlist(true))}
                  title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <i className={`fas fa-heart ${inWishlist ? '' : 'text-secondary'}`}></i>
                </button>
              </div>

              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="d-flex gap-3 overflow-auto pb-2 custom-scrollbar">
                  {productImages.map((img, index) => (
                    <button 
                      key={index} 
                      className={`btn p-0 border-0 rounded-3 overflow-hidden flex-shrink-0 transition-all ${activeImageIndex === index ? 'shadow' : 'opacity-75 hover-opacity-100'}`}
                      style={{ width: '80px', height: '80px', border: activeImageIndex === index ? '2px solid var(--primary)' : '2px solid transparent', backgroundColor: '#f8f9fa' }}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img src={getImageUrl(img)} className="img-fluid w-100 h-100" style={{ objectFit: 'cover' }} alt={`${product.name} thumbnail ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Right Column: Product Info */}
            <div className="col-lg-6 wow fadeInRight" data-wow-delay="0.2s">
              <div className="d-flex align-items-center mb-2">
                <span className="badge bg-primary rounded-pill px-3 py-2 me-2">{product.category?.name}</span>
                {product.isFeatured && <span className="badge bg-success rounded-pill px-3 py-2 me-2">Featured</span>}
                {product.isNew && <span className="badge bg-info rounded-pill px-3 py-2 me-2 text-white">New</span>}
                <div className="ms-auto d-flex align-items-center text-warning">
                  <i className="fas fa-star me-1"></i>
                  <span className="text-dark fw-bold me-1">{Number(product.rating || 0).toFixed(1)}</span>
                  <span className="text-muted">({product.reviewCount} Reviews)</span>
                </div>
              </div>

              <h1 className="display-5 fw-bold text-primary mb-3 lh-sm">{product.name}</h1>
              
              <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-4">
                <h2 className="fw-bold mb-0 text-dark">${Number(product.price).toFixed(2)}</h2>
                {product.oldPrice && product.oldPrice > product.price && (
                  <del className="fs-4 text-muted">${Number(product.oldPrice).toFixed(2)}</del>
                )}
                {discount > 0 && (
                  <span className="badge bg-danger fs-6 px-3 py-2 rounded-pill">Save {discount}%</span>
                )}
              </div>
              
              <p className="fs-5 text-muted mb-4">{product.shortDescription || (product.description ? product.description.replace(/<[^>]+>/g, '').substring(0, 200) + '...' : '')}</p>
              
              <div className="row mb-4 g-3">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center">
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                      <i className="fas fa-box text-primary"></i>
                    </div>
                    <div>
                      <small className="text-muted d-block">SKU</small>
                      <span className="fw-bold">{product.sku}</span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center">
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                      <i className="fas fa-check-circle text-primary"></i>
                    </div>
                    <div>
                      <small className="text-muted d-block">Availability</small>
                      <span className={`fw-bold ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
                        {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-light p-4 rounded-4 mb-4 product-detail-qty">
                <div className="row align-items-center g-3">
                  <div className="col-md-4">
                    <div className="input-group quantity">
                      <button className="btn btn-white border" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>
                        <i className="fas fa-minus"></i>
                      </button>
                      <input type="text" className="form-control text-center border bg-white fw-bold" value={quantity} readOnly />
                      <button className="btn btn-white border" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock}>
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                  <div className="col-md-8 d-flex gap-2">
                    <button className="btn btn-dark rounded-3 py-3 px-4 w-100 fw-bold hover-elevate shadow-sm d-flex align-items-center justify-content-center gap-2" onClick={handleAddToCart} disabled={product.stock <= 0}>
                      <i className="fas fa-shopping-bag"></i> Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <button 
                  className="btn btn-outline-dark rounded-3 py-3 px-4 w-100 fw-bold hover-elevate d-flex align-items-center justify-content-center gap-2" 
                  disabled={product.stock <= 0}
                  onClick={handleExpressCheckout}
                >
                  Express Checkout <i className="fas fa-arrow-right ms-2"></i>
                </button>
              </div>

              <div className="d-flex align-items-center gap-3">
                <span className="fw-bold text-dark">Share:</span>
                <button className="btn btn-light rounded-circle text-primary hover-elevate"><i className="fab fa-facebook-f"></i></button>
                <button className="btn btn-light rounded-circle text-info hover-elevate"><i className="fab fa-twitter"></i></button>
                <button className="btn btn-light rounded-circle text-danger hover-elevate"><i className="fab fa-pinterest-p"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="container-fluid py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <ul className="nav nav-pills justify-content-center mb-5 gap-3" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button className={`nav-link rounded-pill px-5 py-3 fw-bold ${tab === 'about' ? 'active shadow-sm bg-primary text-white' : 'bg-white text-dark'}`} onClick={() => setTab('about')}>
                    Product Description
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className={`nav-link rounded-pill px-5 py-3 fw-bold ${tab === 'reviews' ? 'active shadow-sm bg-primary text-white' : 'bg-white text-dark'}`} onClick={() => setTab('reviews')}>
                    Reviews ({product.reviewCount})
                  </button>
                </li>
              </ul>
              
              <div className="tab-content bg-white p-5 rounded-4 shadow-sm border">
                {tab === 'about' ? (
                  <div className="tab-pane fade show active animate__animated animate__fadeIn">
                    <div className="product-description-content" dangerouslySetInnerHTML={{ __html: product.description }} />
                  </div>
                ) : (
                  <div className="tab-pane fade show active animate__animated animate__fadeIn">
                    <div className="row g-5">
                      <div className="col-lg-7">
                        <h4 className="fw-bold mb-4">Customer Reviews</h4>
                        {reviewsLoading ? (
                          <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        ) : reviews.length > 0 ? (
                          reviews.map((review) => (
                            <div key={review.id} className="d-flex mb-4 pb-4 border-bottom">
                              <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold me-3" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                                {review.user.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <h6 className="fw-bold mb-0">{review.user.name}</h6>
                                  <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
                                </div>
                                <div className="text-warning mb-2" style={{ fontSize: '0.8rem' }}>
                                  {[...Array(5)].map((_, i) => (
                                    <i key={i} className={`fas fa-star ${i < review.rating ? '' : 'text-muted opacity-25'}`}></i>
                                  ))}
                                </div>
                                <h6 className="fw-bold">{review.title}</h6>
                                <p className="text-muted mb-0">{review.comment}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-5 bg-light rounded">
                            <i className="far fa-comment-dots fa-3x text-muted mb-3"></i>
                            <p className="text-muted mb-0">No reviews yet. Be the first to share your thoughts!</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="col-lg-5">
                        <div className="bg-light p-4 rounded-4 border">
                          <h4 className="fw-bold mb-4">Write a Review</h4>
                          {user ? (
                            <form onSubmit={handleSubmitReview}>
                              <div className="mb-3">
                                <label className="form-label text-muted">Your Rating</label>
                                <div className="d-flex gap-2">
                                  {[...Array(5)].map((_, i) => (
                                    <button key={i} type="button" className={`btn rounded-circle p-0 d-flex align-items-center justify-content-center ${reviewForm.rating > i ? 'bg-warning text-white' : 'bg-white text-muted border'}`} style={{ width: '36px', height: '36px' }} onClick={() => setReviewForm(prev => ({ ...prev, rating: i + 1 }))}>
                                      <i className="fas fa-star" style={{ fontSize: '0.8rem' }}></i>
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="mb-3">
                                <input type="text" className="form-control px-4 py-3 rounded-pill bg-white border" placeholder="Review Title" value={reviewForm.title} onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))} required />
                              </div>
                              <div className="mb-4">
                                <textarea className="form-control px-4 py-3 rounded-4 bg-white border" rows="4" placeholder="Share your experience..." value={reviewForm.comment} onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))} required></textarea>
                              </div>
                              <button type="submit" className="btn btn-primary w-100 rounded-pill py-3 fw-bold" disabled={submittingReview}>
                                {submittingReview ? 'Submitting...' : 'Submit Review'}
                              </button>
                            </form>
                          ) : (
                            <div className="text-center py-4">
                              <i className="fas fa-lock fa-2x text-muted mb-3"></i>
                              <p className="text-muted mb-3">You must be logged in to write a review.</p>
                              <Link to="/login" className="btn btn-primary rounded-pill px-4 py-2 fw-bold">Sign In</Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Single Product End */}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="container-fluid py-6 bg-white border-top">
          <div className="container">
            <div className="text-center mb-5 wow fadeInUp" data-wow-delay="0.1s">
              <span className="text-uppercase fw-bold text-muted letter-spacing-2">Similar Items</span>
              <h2 className="display-5 fw-bold text-primary mt-2">Related Products</h2>
              <div className="mx-auto mt-4 bg-primary" style={{ width: '60px', height: '4px' }}></div>
            </div>
            <div className="row g-4 justify-content-center">
              {relatedProducts.slice(0, 4).map((p, i) => (
                <ProductCard key={p.id} product={p} delay={`${0.1 + i * 0.1}s`} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
