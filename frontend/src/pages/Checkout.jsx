import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import Services from '../components/Services.jsx'
import useWow from '../hooks/useWow.js'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { orderApi } from '../services'

export default function Checkout() {
  const { user } = useAuth()
  const { cart, fetchCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showShipping, setShowShipping] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY')
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [applyingCoupon, setApplyingCoupon] = useState(false)
  const [couponError, setCouponError] = useState('')

  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    city: '',
    country: 'USA',
    postalCode: '',
    phone: '',
    email: '',
  })

  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    city: '',
    country: 'USA',
    postalCode: '',
    phone: '',
  })

  const [notes, setNotes] = useState('')

  useWow()

  useEffect(() => {
    if (user) {
      // Pre-fill billing address from user profile
      setBillingAddress(prev => ({
        ...prev,
        email: user.email,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
      }))
    }
    // Ensure cart is loaded
    fetchCart()
  }, [user, fetchCart])

  useEffect(() => {
    if (cart) {
      applyCouponDiscount()
    }
  }, [cart])

  const applyCouponDiscount = async () => {
    if (couponCode && cart) {
      try {
        const response = await orderApi.validateCoupon(couponCode, cart.subtotal)
        setCouponDiscount(response.data.discount)
      } catch {
        setCouponDiscount(0)
      }
    } else {
      setCouponDiscount(0)
    }
  }

  const handleBillingChange = (e) => {
    const { name, value } = e.target
    setBillingAddress(prev => ({ ...prev, [name]: value }))
  }

  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShippingAddress(prev => ({ ...prev, [name]: value }))
  }

  const copyBillingToShipping = () => {
    setShippingAddress(billingAddress)
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !cart) return
    setApplyingCoupon(true)
    setCouponError('')
    try {
      const response = await orderApi.validateCoupon(couponCode, cart.subtotal)
      setCouponDiscount(response.data.discount)
      setCouponError('')
    } catch (err) {
      setCouponDiscount(0)
      setCouponError(err.data?.message || 'Invalid coupon code')
    } finally {
      setApplyingCoupon(false)
    }
  }

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'address', 'city', 'country', 'phone', 'email']
    for (const field of required) {
      if (!billingAddress[field]?.trim()) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return false
      }
    }
    if (showShipping) {
      const shipRequired = ['firstName', 'lastName', 'address', 'city', 'country', 'phone']
      for (const field of shipRequired) {
        if (!shippingAddress[field]?.trim()) {
          setError(`Please fill in shipping ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
          return false
        }
      }
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return
    if (!cart || cart.items.length === 0) {
      setError('Your cart is empty')
      return
    }

    setSubmitting(true)
    try {
      const orderData = {
        billingAddress,
        shippingAddress: showShipping ? shippingAddress : billingAddress,
        paymentMethod,
        notes,
        couponCode: couponCode || undefined,
        cartId: cart.items[0]?.id || '', // This would need proper cart ID from backend
      }

      const response = await orderApi.createFromCart(orderData)
      navigate(`/account/orders/${response.data.id}`)
    } catch (err) {
      setError(err.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const subtotal = cart?.subtotal || 0
  const shipping = cart?.shippingTotal || 0
  const total = subtotal - couponDiscount + shipping

  if (!cart || cart.items.length === 0) {
    return (
      <>
        <PageHeader title="Checkout" crumb="Checkout" />
        <div className="container-fluid py-5">
          <div className="container py-5 text-center">
            <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
            <h4>Your cart is empty</h4>
            <p className="text-muted mb-4">Add items to your cart before checkout.</p>
            <Link to="/shop" className="btn btn-primary rounded-pill py-3 px-5">Continue Shopping</Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Checkout" crumb="Checkout" />

      <Services />

      {/* Checkout Page Start */}
      <div className="container-fluid bg-light overflow-hidden py-5">
        <div className="container py-5">
          <h1 className="mb-4 wow fadeInUp" data-wow-delay="0.1s">Billing Details</h1>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
              {error}
              <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-5">
              <div className="col-md-12 col-lg-7 wow fadeInUp" data-wow-delay="0.1s">
                <div className="bg-white rounded p-4 mb-4">
                  <h5 className="mb-4">Billing Address</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="billingFirstName" className="form-label">First Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" id="billingFirstName" name="firstName" value={billingAddress.firstName} onChange={handleBillingChange} required />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="billingLastName" className="form-label">Last Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" id="billingLastName" name="lastName" value={billingAddress.lastName} onChange={handleBillingChange} required />
                    </div>
                    <div className="col-12">
                      <label htmlFor="billingCompany" className="form-label">Company Name</label>
                      <input type="text" className="form-control" id="billingCompany" name="company" value={billingAddress.company} onChange={handleBillingChange} />
                    </div>
                    <div className="col-12">
                      <label htmlFor="billingAddress" className="form-label">Address <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" id="billingAddress" name="address" placeholder="House Number, Street Name" value={billingAddress.address} onChange={handleBillingChange} required />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="billingCity" className="form-label">Town/City <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" id="billingCity" name="city" value={billingAddress.city} onChange={handleBillingChange} required />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="billingCountry" className="form-label">Country <span className="text-danger">*</span></label>
                      <select className="form-select" id="billingCountry" name="country" value={billingAddress.country} onChange={handleBillingChange} required>
                        <option value="USA">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="billingPhone" className="form-label">Mobile <span className="text-danger">*</span></label>
                      <input type="tel" className="form-control" id="billingPhone" name="phone" value={billingAddress.phone} onChange={handleBillingChange} required />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="billingEmail" className="form-label">Email Address <span className="text-danger">*</span></label>
                      <input type="email" className="form-control" id="billingEmail" name="email" value={billingAddress.email} onChange={handleBillingChange} required />
                    </div>
                  </div>

                  {!user && (
                    <div className="form-check mt-3">
                      <input type="checkbox" className="form-check-input" id="createAccount" />
                      <label className="form-check-label" htmlFor="createAccount">Create an account?</label>
                    </div>
                  )}

                  <hr className="my-4" />

                  <div className="form-check mb-3">
                    <input type="checkbox" className="form-check-input" id="shipToDifferent" checked={showShipping} onChange={(e) => setShowShipping(e.target.checked)} />
                    <label className="form-check-label" htmlFor="shipToDifferent">Ship to a different address?</label>
                  </div>

                  {showShipping && (
                    <div className="bg-light rounded p-4">
                      <h6 className="mb-3">Shipping Address</h6>
                      <button type="button" className="btn btn-sm btn-outline-secondary mb-3" onClick={copyBillingToShipping}>
                        <i className="fas fa-copy me-1"></i> Copy from billing
                      </button>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label htmlFor="shippingFirstName" className="form-label">First Name <span className="text-danger">*</span></label>
                          <input type="text" className="form-control" id="shippingFirstName" name="firstName" value={shippingAddress.firstName} onChange={handleShippingChange} required />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="shippingLastName" className="form-label">Last Name <span className="text-danger">*</span></label>
                          <input type="text" className="form-control" id="shippingLastName" name="lastName" value={shippingAddress.lastName} onChange={handleShippingChange} required />
                        </div>
                        <div className="col-12">
                          <label htmlFor="shippingCompany" className="form-label">Company Name</label>
                          <input type="text" className="form-control" id="shippingCompany" name="company" value={shippingAddress.company} onChange={handleShippingChange} />
                        </div>
                        <div className="col-12">
                          <label htmlFor="shippingAddress" className="form-label">Address <span className="text-danger">*</span></label>
                          <input type="text" className="form-control" id="shippingAddress" name="address" placeholder="House Number, Street Name" value={shippingAddress.address} onChange={handleShippingChange} required />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="shippingCity" className="form-label">Town/City <span className="text-danger">*</span></label>
                          <input type="text" className="form-control" id="shippingCity" name="city" value={shippingAddress.city} onChange={handleShippingChange} required />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="shippingCountry" className="form-label">Country <span className="text-danger">*</span></label>
                          <select className="form-select" id="shippingCountry" name="country" value={shippingAddress.country} onChange={handleShippingChange} required>
                            <option value="USA">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="Australia">Australia</option>
                            <option value="Germany">Germany</option>
                            <option value="France">France</option>
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="shippingPhone" className="form-label">Phone <span className="text-danger">*</span></label>
                          <input type="tel" className="form-control" id="shippingPhone" name="phone" value={shippingAddress.phone} onChange={handleShippingChange} required />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="orderNotes" className="form-label">Order Notes (Optional)</label>
                    <textarea className="form-control" id="orderNotes" rows={4} placeholder="Special instructions for your order..." value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                  </div>
                </div>
              </div>

              <div className="col-md-12 col-lg-5 wow fadeInUp" data-wow-delay="0.3s">
                <div className="bg-white rounded p-4 sticky-top" style={{ top: 100 }}>
                  <h4 className="mb-4">Your Order</h4>

                  <div className="table-responsive mb-4">
                    <table className="table">
                      <thead>
                        <tr className="text-center">
                          <th scope="col" className="text-start">Product</th>
                          <th scope="col">Price</th>
                          <th scope="col">Qty</th>
                          <th scope="col">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.items.map((item) => (
                          <tr key={item.id} className="text-center">
                            <th scope="row" className="text-start py-3">
                              <div className="d-flex align-items-center">
                                <img src={getImageUrl(item.product.images[0])} alt={item.product.name} style={{ width: 50, height: 50, objectFit: 'cover' }} className="rounded me-2" />
                                <span>{item.product.name}</span>
                              </div>
                            </th>
                            <td className="py-3">${Number(item.unitPrice).toFixed(2)}</td>
                            <td className="py-3">{item.quantity}</td>
                            <td className="py-3 fw-bold">${Number(item.total).toFixed(2)}</td>
                          </tr>
                        ))}
                        <tr>
                          <th scope="row" colSpan="3" className="text-end py-3">Subtotal</th>
                          <td className="py-3 fw-bold">${subtotal.toFixed(2)}</td>
                        </tr>
                        {couponDiscount > 0 && (
                          <tr className="text-success">
                            <th scope="row" colSpan="3" className="text-end py-3">Discount ({couponCode})</th>
                            <td className="py-3 fw-bold">-${couponDiscount.toFixed(2)}</td>
                          </tr>
                        )}
                        <tr>
                          <th scope="row" colSpan="3" className="text-end py-3">Shipping</th>
                          <td className="py-3 fw-bold">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</td>
                        </tr>
                        <tr className="border-top border-bottom">
                          <th scope="row" colSpan="3" className="text-end py-3 fw-bold">Total</th>
                          <td className="py-3 fw-bold fs-5">${total.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mb-4">
                    <label className="form-label mb-2">Coupon Code</label>
                    <div className="input-group mb-3">
                      <input type="text" className="form-control" placeholder="Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                      <button type="button" className="btn btn-outline-primary" onClick={handleApplyCoupon} disabled={applyingCoupon}>
                        {applyingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && <div className="text-danger small">{couponError}</div>}
                  </div>

                  <div className="mb-4">
                    <h6 className="mb-3">Payment Method</h6>
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      <strong>Cash on Delivery</strong> - Pay when your order is delivered. No online payment required.
                    </div>
                    <input type="hidden" name="paymentMethod" value="CASH_ON_DELIVERY" />
                  </div>

                  <button type="submit" className="btn btn-primary border-secondary py-3 px-4 text-uppercase w-100" disabled={submitting}>
                    {submitting ? 'Placing Order...' : 'Place Order'}
                  </button>

                  <p className="text-center text-muted small mt-3">By placing your order, you agree to our <Link to="/page/terms" className="text-primary">Terms & Conditions</Link> and <Link to="/page/privacy-policy" className="text-primary">Privacy Policy</Link>.</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* Checkout Page End */}
    </>
  )
}
