import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import useWow from '../hooks/useWow.js'
import { useCart } from '../context/CartContext'
import { orderApi } from '../services'

export default function Cart() {
  const { cart, loading, updateCartItem, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [applyingCoupon, setApplyingCoupon] = useState(false)
  const [couponError, setCouponError] = useState('')
  useWow()

  useEffect(() => {
    // Cart is loaded via CartContext
  }, [])

  const subtotal = cart?.subtotal || 0
  const shipping = cart?.shippingTotal || 0
  const total = subtotal - couponDiscount + shipping

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return
    try {
      await updateCartItem(productId, newQuantity)
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  }

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId)
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setApplyingCoupon(true)
    setCouponError('')
    try {
      const response = await orderApi.validateCoupon(couponCode, subtotal)
      setCouponDiscount(response.data.discount)
      setCouponError('')
    } catch (error) {
      setCouponDiscount(0)
      setCouponError(error.data?.message || 'Invalid coupon code')
    } finally {
      setApplyingCoupon(false)
    }
  }

  const handleProceedToCheckout = () => {
    if (!cart || cart.items.length === 0) return
    navigate('/checkout')
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

  return (
    <>
      <PageHeader title="Shopping Cart" crumb="Cart" />

      {/* Cart Page Start */}
      <div className="container-fluid py-5">
        <div className="container py-5">
          {cart && cart.items.length > 0 ? (
            <>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Product</th>
                      <th scope="col">Price</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Total</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.items.map((item) => (
                      <tr key={item.id}>
                        <th scope="row">
                          <div className="d-flex align-items-center">
                            <Link to={`/product/${item.product.slug}`} className="me-3">
                              <img src={getImageUrl(item.product.images[0])} alt={item.product.name} style={{ width: 80, height: 80, objectFit: 'cover' }} className="rounded" />
                            </Link>
                            <div>
                              <Link to={`/product/${item.product.slug}`} className="d-block fw-bold">{item.product.name}</Link>
                              <small className="text-muted">SKU: {item.product.sku}</small>
                              {item.product.badge && (
                                <span className={`badge ${item.product.badge === 'sale' ? 'bg-danger' : 'bg-primary'} ms-2`}>
                                  {item.product.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </th>
                        <td className="align-middle">
                          {item.product.oldPrice && item.product.oldPrice > item.product.price ? (
                            <>
                              <del className="text-muted d-block">${Number(item.product.oldPrice).toFixed(2)}</del>
                              <span className="text-primary fw-bold">${Number(item.product.price).toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="fw-bold">${Number(item.product.price).toFixed(2)}</span>
                          )}
                        </td>
                        <td className="align-middle">
                          <div className="input-group quantity" style={{ width: 120 }}>
                            <button className="btn btn-sm btn-minus rounded-circle bg-light border" onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}><i className="fa fa-minus"></i></button>
                            <input type="text" className="form-control form-control-sm text-center border-0" value={item.quantity} readOnly />
                            <button className="btn btn-sm btn-plus rounded-circle bg-light border" onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)} disabled={item.quantity >= item.product.stock}><i className="fa fa-plus"></i></button>
                          </div>
                        </td>
                        <td className="align-middle fw-bold">${Number(item.total).toFixed(2)}</td>
                        <td className="align-middle">
                          <button className="btn btn-md rounded-circle bg-light border text-danger" onClick={() => handleRemove(item.productId)}><i className="fa fa-times"></i></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="row g-4 mt-5">
                <div className="col-lg-8">
                  <div className="border rounded p-4">
                    <h5 className="mb-4">Apply Coupon</h5>
                    <div className="input-group mb-3">
                      <input type="text" className="form-control" placeholder="Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                      <button className="btn btn-primary" onClick={handleApplyCoupon} disabled={applyingCoupon}>
                        {applyingCoupon ? 'Applying...' : 'Apply Coupon'}
                      </button>
                    </div>
                    {couponError && <div className="text-danger small">{couponError}</div>}
                    {couponDiscount > 0 && <div className="text-success small mt-2">Coupon applied! You saved ${couponDiscount.toFixed(2)}</div>}
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="bg-light rounded p-4 sticky-top" style={{ top: 100 }}>
                    <h4 className="mb-4">Cart Totals</h4>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Subtotal ({cart.itemCount} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="d-flex justify-content-between mb-3 text-success">
                        <span>Discount</span>
                        <span>-${couponDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="d-flex justify-content-between mb-3">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <button className="btn btn-primary rounded-pill w-100 py-3 text-uppercase" onClick={handleProceedToCheckout} disabled={cart.items.length === 0}>
                      Proceed to Checkout
                    </button>
                    <p className="text-center text-muted small mt-3">Shipping calculated at checkout</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
              <h4>Your cart is empty</h4>
              <p className="text-muted mb-4">Looks like you haven't added any items yet.</p>
              <Link to="/shop" className="btn btn-primary rounded-pill py-3 px-5">Continue Shopping</Link>
            </div>
          )}
        </div>
      </div>
      {/* Cart Page End */}
    </>
  )
}
