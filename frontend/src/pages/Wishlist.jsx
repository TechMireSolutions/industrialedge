import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import useWow from '../hooks/useWow.js'
import { cartApi } from '../services'
import { useCart } from '../context/CartContext'

export default function Wishlist() {
  const { wishlist, wishlistCount, loading: cartLoading, addToCart, removeFromWishlist, moveToCart } = useCart()
  const [localLoading, setLocalLoading] = useState(false)
  useWow()

  useEffect(() => {
    // wishlist is loaded via CartContext
  }, [])

  const handleRemove = async (productId) => {
    setLocalLoading(true)
    try {
      await removeFromWishlist(productId)
    } finally {
      setLocalLoading(false)
    }
  }

  const handleMoveToCart = async (productId) => {
    setLocalLoading(true)
    try {
      await moveToCart(productId)
    } finally {
      setLocalLoading(false)
    }
  }

  const handleAddToCart = async (product) => {
    setLocalLoading(true)
    try {
      await addToCart(product.id, 1)
    } finally {
      setLocalLoading(false)
    }
  }

  return (
    <>
      <PageHeader title="My Wishlist" crumb="Wishlist" />

      <div className="container-fluid bg-light py-5">
        <div className="container py-5">
          <div className="bg-white rounded p-4">
            {cartLoading || localLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : wishlist.length > 0 ? (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0">Wishlist ({wishlistCount} items)</h4>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => wishlist.forEach(item => handleRemove(item.productId))} disabled={localLoading}>
                    <i className="fas fa-trash me-2"></i> Clear All
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Availability</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wishlist.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <Link to={`/product/${item.product.slug}`} className="me-3">
                                <img src={getImageUrl(item.product.images[0])} alt={item.product.name} style={{ width: 60, height: 60, objectFit: 'cover' }} className="rounded" />
                              </Link>
                              <Link to={`/product/${item.product.slug}`} className="fw-bold">{item.product.name}</Link>
                            </div>
                          </td>
                          <td>
                            {item.product.oldPrice && item.product.oldPrice > item.product.price ? (
                              <>
                                <del className="text-muted me-2">${Number(item.product.oldPrice).toFixed(2)}</del>
                                <span className="text-primary fw-bold">${Number(item.product.price).toFixed(2)}</span>
                              </>
                            ) : (
                              <span className="fw-bold">${Number(item.product.price).toFixed(2)}</span>
                            )}
                          </td>
                          <td>
                            <span className={item.product.stock > 0 ? 'text-success' : 'text-danger'}>
                              {item.product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-primary" onClick={() => handleAddToCart(item.product)} disabled={item.product.stock <= 0 || localLoading}>
                                <i className="fas fa-cart-plus me-1"></i> Add to Cart
                              </button>
                              <button className="btn btn-outline-secondary" onClick={() => handleMoveToCart(item.product.id)} disabled={localLoading} title="Move to Cart">
                                <i className="fas fa-arrow-right"></i>
                              </button>
                              <button className="btn btn-outline-danger" onClick={() => handleRemove(item.product.id)} disabled={localLoading} title="Remove">
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-5">
                <i className="fas fa-heart fa-3x text-muted mb-3"></i>
                <h5>Your wishlist is empty</h5>
                <p className="text-muted">Save items you love for later</p>
                <Link to="/shop" className="btn btn-primary mt-3">Continue Shopping</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
